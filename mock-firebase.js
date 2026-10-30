// mock-firebase.js — Mock local (compat) do Firebase para a demo.
// Substitui firebase-app/auth/firestore-compat.js. Backend fictício, em memória.
// Precisa ser carregado DEPOIS de mock-data.js e ANTES do script do app.
(function () {
  'use strict';

  var SESSION_KEY = 'aurora_desk_sessao';

  // ═══════════════════════════════════════════════════════
  // STORE (em memoria) — reinicializado a cada carga
  // ═══════════════════════════════════════════════════════
  var store = {};
  var listeners = []; // { col: string, run: fn }

  function clone(o) { return o == null ? o : JSON.parse(JSON.stringify(o)); }

  function initStore() {
    store = {};
    var seed = window.__AURORA_SEED || {};
    Object.keys(seed).forEach(function (col) {
      store[col] = {};
      Object.keys(seed[col]).forEach(function (id) {
        store[col][id] = clone(seed[col][id]);
      });
    });
  }
  initStore();

  function col(name) { if (!store[name]) store[name] = {}; return store[name]; }

  function notify(colName) {
    listeners.slice().forEach(function (l) {
      if (l.col !== colName) return;
      try { l.run(); } catch (e) { console.error('[mock-firebase] listener', e); }
    });
  }

  // ═══════════════════════════════════════════════════════
  // SNAPSHOTS
  // ═══════════════════════════════════════════════════════
  function docSnapshot(id, data) {
    return {
      id: id,
      exists: data !== undefined && data !== null,
      data: function () { return clone(data); }
    };
  }

  function querySnapshot(items) {
    var docs = items.map(function (it) { return docSnapshot(it.id, it.data); });
    return {
      docs: docs,
      size: docs.length,
      empty: docs.length === 0,
      forEach: function (cb) { docs.forEach(cb); }
    };
  }

  // ═══════════════════════════════════════════════════════
  // FIRESTORE
  // ═══════════════════════════════════════════════════════
  function DocRef(colName, id) { this._col = colName; this.id = id; }

  DocRef.prototype.get = function () {
    return Promise.resolve(docSnapshot(this.id, col(this._col)[this.id]));
  };
  DocRef.prototype.set = function (data, opts) {
    var c = col(this._col);
    if (opts && opts.merge && c[this.id]) {
      c[this.id] = Object.assign({}, c[this.id], clone(data));
    } else {
      c[this.id] = clone(data);
    }
    notify(this._col);
    return Promise.resolve();
  };
  DocRef.prototype.update = function (data) {
    var c = col(this._col);
    c[this.id] = Object.assign({}, c[this.id] || {}, clone(data));
    notify(this._col);
    return Promise.resolve();
  };
  DocRef.prototype.delete = function () {
    delete col(this._col)[this.id];
    notify(this._col);
    return Promise.resolve();
  };
  DocRef.prototype.onSnapshot = function (cb) {
    var self = this;
    var run = function () { cb(docSnapshot(self.id, col(self._col)[self.id])); };
    var l = { col: this._col, run: run };
    listeners.push(l);
    setTimeout(run, 0);
    return function () { var i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); };
  };

  function Query(colName, filters) { this._col = colName; this._filters = filters || []; this._order = null; this._limit = null; }

  Query.prototype._items = function () {
    var c = col(this._col);
    var arr = Object.keys(c).map(function (id) { return { id: id, data: c[id] }; });
    this._filters.forEach(function (f) {
      arr = arr.filter(function (it) {
        var v = it.data ? it.data[f.field] : undefined;
        switch (f.op) {
          case '==': return v === f.value;
          case '!=': return v !== f.value;
          case '>': return v > f.value;
          case '>=': return v >= f.value;
          case '<': return v < f.value;
          case '<=': return v <= f.value;
          case 'in': return Array.isArray(f.value) && f.value.indexOf(v) !== -1;
          case 'array-contains': return Array.isArray(v) && v.indexOf(f.value) !== -1;
          default: return true;
        }
      });
    });
    if (this._order) {
      var field = this._order.field;
      var dir = this._order.dir === 'desc' ? -1 : 1;
      arr.sort(function (a, b) {
        var va = a.data ? a.data[field] : undefined;
        var vb = b.data ? b.data[field] : undefined;
        if (va === vb) return 0;
        if (va == null) return -1 * dir;
        if (vb == null) return 1 * dir;
        return (va < vb ? -1 : 1) * dir;
      });
    }
    if (this._limit && this._limit > 0) arr = arr.slice(0, this._limit);
    return arr;
  };
  Query.prototype.orderBy = function (field, dir) { this._order = { field: field, dir: dir || 'asc' }; return this; };
  Query.prototype.limit = function (n) { this._limit = n; return this; };
  Query.prototype.get = function () {
    return Promise.resolve(querySnapshot(this._items()));
  };
  Query.prototype.onSnapshot = function (cb) {
    var self = this;
    var run = function () { cb(querySnapshot(self._items())); };
    var l = { col: this._col, run: run };
    listeners.push(l);
    setTimeout(run, 0);
    return function () { var i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); };
  };

  var _autoId = 0;

  function CollectionRef(name) { this._name = name; }
  CollectionRef.prototype.doc = function (id) { return new DocRef(this._name, id); };
  CollectionRef.prototype.add = function (data) {
    var id = 'auto_' + (++_autoId) + '_' + Date.now().toString(36);
    var ref = new DocRef(this._name, id);
    return ref.set(data).then(function () { return ref; });
  };
  CollectionRef.prototype.where = function (field, op, value) {
    return new Query(this._name, [{ field: field, op: op, value: value }]);
  };
  CollectionRef.prototype.get = function () { return new Query(this._name, []).get(); };
  CollectionRef.prototype.onSnapshot = function (cb) { return new Query(this._name, []).onSnapshot(cb); };

  function Firestore() {}
  Firestore.prototype.collection = function (name) { return new CollectionRef(name); };
  Firestore.prototype.batch = function () {
    var ops = [];
    var api = {
      set: function (ref, data) { ops.push(function () { return ref.set(data); }); return api; },
      update: function (ref, data) { ops.push(function () { return ref.update(data); }); return api; },
      delete: function (ref) { ops.push(function () { return ref.delete(); }); return api; },
      commit: function () { ops.forEach(function (f) { f(); }); return Promise.resolve(); }
    };
    return api;
  };

  // ═══════════════════════════════════════════════════════
  // AUTH (funcional; comeca deslogado; sessao em localStorage)
  // ═══════════════════════════════════════════════════════
  var authListeners = [];
  var currentUser = null;
  var authUsers = {}; // uid -> { uid, email }

  function userFromEmail(email) {
    var uid = String(email || '').split('@')[0];
    return { uid: uid, email: email };
  }
  function seedAuthUsers() {
    var seed = window.__AURORA_SEED || {};
    Object.keys(seed.usuarios || {}).forEach(function (uid) {
      authUsers[uid] = { uid: uid, email: uid + '@interno.local' };
    });
  }
  seedAuthUsers();

  function loadSession() {
    try { var raw = localStorage.getItem(SESSION_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
    return null;
  }
  function saveSession(u) {
    try { if (u) localStorage.setItem(SESSION_KEY, JSON.stringify(u)); else localStorage.removeItem(SESSION_KEY); } catch (e) {}
  }
  function fireAuth() {
    authListeners.slice().forEach(function (cb) {
      try { cb(currentUser ? clone(currentUser) : null); } catch (e) { console.error('[mock-firebase] auth', e); }
    });
  }
  currentUser = loadSession();

  function authError(code, msg) {
    var e = new Error(msg || code);
    e.code = code;
    return e;
  }

  function Auth() {}
  Auth.prototype.onAuthStateChanged = function (cb) {
    authListeners.push(cb);
    setTimeout(function () { cb(currentUser ? clone(currentUser) : null); }, 0);
    return function () { var i = authListeners.indexOf(cb); if (i >= 0) authListeners.splice(i, 1); };
  };
  Object.defineProperty(Auth.prototype, 'currentUser', {
    get: function () { return currentUser ? clone(currentUser) : null; }
  });
  Auth.prototype.signInWithEmailAndPassword = function (email, senha) {
    var u = userFromEmail(email);
    if (!authUsers[u.uid]) {
      return Promise.reject(authError('auth/user-not-found', 'Usuario inexistente.'));
    }
    currentUser = u;
    saveSession(u);
    fireAuth();
    return Promise.resolve({ user: clone(u) });
  };
  Auth.prototype.createUserWithEmailAndPassword = function (email, senha) {
    var u = userFromEmail(email);
    if (authUsers[u.uid]) {
      return Promise.reject(authError('auth/email-already-in-use', 'Usuario ja existe.'));
    }
    authUsers[u.uid] = u;
    currentUser = u;
    saveSession(u);
    fireAuth();
    return Promise.resolve({ user: clone(u) });
  };
  Auth.prototype.signOut = function () {
    currentUser = null;
    saveSession(null);
    fireAuth();
    return Promise.resolve();
  };

  // ═══════════════════════════════════════════════════════
  // API global "firebase" (compat)
  // ═══════════════════════════════════════════════════════
  var _fs = null;
  var _auth = null;

  window.firebase = {
    initializeApp: function () { return {}; },
    firestore: function () { if (!_fs) _fs = new Firestore(); return _fs; },
    auth: function () { if (!_auth) _auth = new Auth(); return _auth; }
  };

  window.__aurora_demo = true;
  console.info('[mock-firebase] ativo — backend ficticio em memoria. Login: demo / 246810');
})();
