/**
 * FreshCorner — app.js
 * Logique partagée entre boutique.html et admin.html
 * TwinDev Agency
 */

// ════════════════════════════════════════════════════════
//  CONSTANTES
// ════════════════════════════════════════════════════════
const FC = {
  DEFAULT_PRODUCTS: [
    { id:1, name:"Brocolis frais",    cat:"Légumes",  price:850,  unit:"kg",   desc:"Arrivage du matin, vitaminé.",   icon:"🥦", bg:"#c8f5d6", tag:"new",   stock:true,  image:"" },
    { id:2, name:"Maïs doux",         cat:"Céréales", price:300,  unit:"épi",  desc:"Parfait pour grillades.",        icon:"🌽", bg:"#fde68a", tag:"promo", stock:true,  image:"" },
    { id:3, name:"Piments locaux",    cat:"Épices",   price:500,  unit:"100g", desc:"Séchés, très aromatiques.",      icon:"🌶️", bg:"#fecaca", tag:"hot",   stock:true,  image:"" },
    { id:4, name:"Tilapia entier",    cat:"Poissons", price:2500, unit:"kg",   desc:"Pêché du jour, nettoyé.",        icon:"🐟", bg:"#dbeafe", tag:"new",   stock:true,  image:"" },
    { id:5, name:"Oignons violets",   cat:"Légumes",  price:400,  unit:"kg",   desc:"Base de toutes les sauces.",     icon:"🧅", bg:"#ede9fe", tag:"promo", stock:true,  image:"" },
    { id:6, name:"Œufs fermiers",     cat:"Laitages", price:1200, unit:"dz",   desc:"Poules élevées localement.",     icon:"🥚", bg:"#fef3c7", tag:"new",   stock:true,  image:"" },
    { id:7, name:"Huile de palme",    cat:"Huiles",   price:1800, unit:"L",    desc:"Huile rouge naturelle.",         icon:"🫚", bg:"#d1fae5", tag:"hot",   stock:true,  image:"" },
    { id:8, name:"Bananes plantains", cat:"Fruits",   price:200,  unit:"pce",  desc:"Mûres à point, pour alloco.",    icon:"🍌", bg:"#f0fdf4", tag:"new",   stock:true,  image:"" },
  ],
  DEFAULT_CATS: ["Légumes","Fruits","Épices","Céréales","Viandes","Poissons","Huiles","Laitages","Boissons","Boulangerie"],
  CAT_ICONS:    { Légumes:"🥬", Fruits:"🍌", Épices:"🌶️", Céréales:"🌽", Viandes:"🥩", Poissons:"🐟", Huiles:"🧴", Laitages:"🥛", Boissons:"🧃", Boulangerie:"🍞" },
  TAG_LABELS:   { new:"Nouveau", promo:"Promo", hot:"⭐ Top" },
  STATUS_LABELS:{ pending:"En attente", confirmed:"Confirmée", delivering:"En livraison", done:"Livrée" },
  COLORS: ["#c8f5d6","#fde68a","#fecaca","#dbeafe","#ede9fe","#fef3c7","#d1fae5","#f0fdf4","#fce7f3","#ffedd5","#e0f2fe","#f1f5f9"],
  ICONS:  ["🥦","🍅","🌽","🥕","🧅","🥚","🐟","🥩","🌶️","🍌","🍎","🍊","🧄","🫛","🥜","🫘","🍚","🧃","🧴","🫚","🥛","🍞","🧁","🐔","🫐","🥭"],
  // Clé unique pour la session admin — même nom partout
  AUTH_KEY: "fc_admin_logged",
};


// ════════════════════════════════════════════════════════
//  STOCKAGE  (localStorage)
// ════════════════════════════════════════════════════════
const Store = {
  _get(key, fallback) {
    try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback; }
    catch { return fallback; }
  },
  _set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },

  products() { return this._get("fc_products", null) || FC.DEFAULT_PRODUCTS; },
  cats()     { return this._get("fc_cats",     null) || FC.DEFAULT_CATS;     },
  settings() { return this._get("fc_settings", {});                          },
  orders()   { return this._get("fc_orders",   []);                          },
  cart()     { return this._get("fc_cart",     []);                          },
  favs()     { return this._get("fc_favs",     []);                          },

  saveProducts(v) { this._set("fc_products", v); },
  saveCats(v)     { this._set("fc_cats",     v); },
  saveSettings(v) { this._set("fc_settings", v); },
  saveOrders(v)   { this._set("fc_orders",   v); },
  saveCart(v)     { this._set("fc_cart",     v); },
  saveFavs(v)     { this._set("fc_favs",     v); },
};


// ════════════════════════════════════════════════════════
//  UTILITAIRES
// ════════════════════════════════════════════════════════
const Utils = {
  // Affiche un toast
  toast(msg, type) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.className = "toast" + (type ? " " + type : "");
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2400);
  },

  // Format prix
  fcfa(n) { return Number(n).toLocaleString("fr-FR") + " FCFA"; },

  // ID commande unique
  orderId() { return "CMD-" + Date.now().toString().slice(-6); },

  // Date formatée
  now() {
    return new Date().toLocaleString("fr-FR", {
      day:"2-digit", month:"2-digit", year:"numeric",
      hour:"2-digit", minute:"2-digit",
    });
  },

  // Ouvre / ferme via classe CSS
  open(id)  { document.getElementById(id)?.classList.add("open");    },
  close(id) { document.getElementById(id)?.classList.remove("open"); },

  // Lit un input
  val(id) { return (document.getElementById(id)?.value || "").trim(); },
  setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v ?? ""; },
};


// ════════════════════════════════════════════════════════
//  AUTH
//  On utilise localStorage (pas sessionStorage) pour que
//  la session survive la navigation en file:// (VS Code)
// ════════════════════════════════════════════════════════
const Auth = {
  isLogged() {
    return localStorage.getItem(FC.AUTH_KEY) === "1";
  },

  login(user, pass) {
    const s = Store.settings();
    const validUser = s.adminUser || "admin";
    const validPass = s.adminPass || "1234";
    if (user === validUser && pass === validPass) {
      localStorage.setItem(FC.AUTH_KEY, "1");
      return true;
    }
    return false;
  },

  logout() {
    localStorage.removeItem(FC.AUTH_KEY);
  },
};


// ════════════════════════════════════════════════════════
//  PANIER
// ════════════════════════════════════════════════════════
const Cart = {
  items: [],

  init()  { this.items = Store.cart(); },
  save()  { Store.saveCart(this.items); },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  isEmpty() { return this.items.length === 0; },

  add(id) {
    const p = Store.products().find(x => x.id === id);
    if (!p || !p.stock) return;
    const ex = this.items.find(i => i.id === id);
    if (ex) { ex.qty++; }
    else { this.items.push({ id:p.id, name:p.name, icon:p.icon, image:p.image||"", price:p.price, unit:p.unit, qty:1 }); }
    this.save();
  },

  changeQty(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.items = this.items.filter(i => i.id !== id);
    this.save();
  },

  clear() { this.items = []; this.save(); },

  render() {
    const countEl = document.getElementById("cartCount");
    const totalEl = document.getElementById("cartTotal");
    const itemsEl = document.getElementById("cartItems");
    if (countEl) countEl.textContent = this.count();
    if (totalEl) totalEl.textContent = Utils.fcfa(this.total());
    if (!itemsEl) return;

    if (this.isEmpty()) {
      itemsEl.innerHTML = `<div class="cart-empty"><div style="font-size:3rem;margin-bottom:.8rem">🛒</div><p style="font-weight:800;color:var(--muted)">Panier vide</p></div>`;
      return;
    }

    itemsEl.innerHTML = this.items.map(i => `
      <div class="citem">
        <div class="citem-icon">
          ${i.image ? `<img src="${i.image}" alt="${i.name}" onerror="this.outerHTML='<span>${i.icon||"🛒"}</span>'">` : (i.icon || "🛒")}
        </div>
        <div class="citem-info">
          <div class="citem-name">${i.name}</div>
          <div class="citem-price">${Utils.fcfa(i.price * i.qty)}</div>
        </div>
        <div class="citem-qty">
          <button class="qty-btn" onclick="Cart.changeQty(${i.id},-1);Cart.render()">−</button>
          <span class="qty-num">${i.qty}</span>
          <button class="qty-btn" onclick="Cart.changeQty(${i.id},1);Cart.render()">+</button>
        </div>
      </div>`).join("");
  },
};


// ════════════════════════════════════════════════════════
//  COMMANDES
// ════════════════════════════════════════════════════════
const Orders = {
  create({ name, phone, address, payment, note }) {
    const order = {
      id: Utils.orderId(), name, phone, address, payment, note,
      items: Cart.items.map(i => ({ name:i.name, qty:i.qty, price:i.price })),
      total: Cart.total(),
      status: "pending",
      date: Utils.now(),
    };
    const all = Store.orders();
    all.push(order);
    Store.saveOrders(all);
    return order;
  },

  setStatus(id, status) {
    const all = Store.orders();
    const o = all.find(x => x.id === id);
    if (o) { o.status = status; Store.saveOrders(all); }
    return o;
  },

  delete(id) { Store.saveOrders(Store.orders().filter(o => o.id !== id)); },

  pendingCount() { return Store.orders().filter(o => o.status === "pending").length; },

  filter({ query = "", status = "" } = {}) {
    return Store.orders().filter(o => {
      const q = query.toLowerCase();
      const mQ = !q || o.name.toLowerCase().includes(q) || o.phone.includes(q) || o.id.toLowerCase().includes(q);
      const mS = !status || o.status === status;
      return mQ && mS;
    });
  },

  // Carte commande pour la vue client (boutique)
  clientCardHTML(o) {
    return `
      <div class="ocard">
        <div class="ocard-head">
          <span class="ocard-id">${o.id}</span>
          <span class="ostatus s-${o.status}">${FC.STATUS_LABELS[o.status] || o.status}</span>
        </div>
        <div class="ocard-items">${o.items.map(i => `${i.name} x${i.qty}`).join(" · ")}</div>
        <div class="ocard-foot">
          <span class="ocard-total">${Utils.fcfa(o.total)}</span>
          <span class="ocard-date">${o.date}</span>
        </div>
      </div>`;
  },
};


// ════════════════════════════════════════════════════════
//  BOUTIQUE  (boutique.html)
// ════════════════════════════════════════════════════════
const Boutique = {
  activeFilter: "Tout",
  favs: [],

  init() {
    Cart.init();
    this.favs = Store.favs();
    this._applySettings();
    this._buildHeroCats();
    this._buildFilters();
    this.renderProducts();
    Cart.render();

    document.getElementById("searchInput")
      ?.addEventListener("input", () => this.renderProducts());

    // Rafraîchir si l'admin modifie quelque chose dans un autre onglet
    window.addEventListener("storage", () => {
      this._applySettings();
      this._buildFilters();
      this.renderProducts();
    });
  },

  // ── Paramètres boutique ──────────────────────────────
  _applySettings() {
    const s = Store.settings();
    const setText = (id, val) => { if (val) { const el = document.getElementById(id); if (el) el.textContent = val; } };
    setText("shopName",  s.shopName);
    setText("shopPhone", s.phone);
    setText("shopAddr",  s.address);
    setText("shopHours", s.hours);
    if (s.promoText) { const el = document.getElementById("promoStrip"); if (el) el.innerHTML = s.promoText; }
    if (s.shopName) document.title = s.shopName;

    const prods = Store.products();
    const cats  = [...new Set(prods.map(p => p.cat))];
    const sp = document.getElementById("statProd");
    const sc = document.getElementById("statCat");
    if (sp) sp.textContent = prods.filter(p => p.stock).length + "+";
    if (sc) sc.textContent = cats.length;
  },

  // ── Catégories hero ──────────────────────────────────
  _buildHeroCats() {
    const el = document.getElementById("heroCats");
    if (!el) return;
    const prods = Store.products();
    const cats  = [...new Set(prods.map(p => p.cat))];
    el.innerHTML = cats.slice(0, 4).map(c => {
      const n = prods.filter(p => p.cat === c && p.stock).length;
      return `<div class="hcard" onclick="Boutique.setFilter('${c}')">
        <span class="hcard-icon">${FC.CAT_ICONS[c] || "🛒"}</span>
        <div class="hcard-name">${c}</div>
        <div class="hcard-count">${n} produit${n > 1 ? "s" : ""}</div>
      </div>`;
    }).join("");
  },

  // ── Filtres ──────────────────────────────────────────
  _buildFilters() {
    const el = document.getElementById("filterPills");
    if (!el) return;
    const cats = ["Tout", ...new Set(Store.products().map(p => p.cat))];
    el.innerHTML = cats.map(c =>
      `<div class="fpill${c === this.activeFilter ? " on" : ""}" onclick="Boutique.setFilter('${c}')">${c}</div>`
    ).join("");
  },

  setFilter(cat) {
    this.activeFilter = cat;
    this._buildFilters();
    this.renderProducts();
  },

  // ── Produits ─────────────────────────────────────────
  renderProducts() {
    let prods = Store.products();
    const q    = (document.getElementById("searchInput")?.value || "").toLowerCase();
    const sort = document.getElementById("sortSel")?.value || "";

    if (this.activeFilter !== "Tout") prods = prods.filter(p => p.cat === this.activeFilter);
    if (q) prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
    if (sort === "asc")  prods.sort((a, b) => a.price - b.price);
    if (sort === "desc") prods.sort((a, b) => b.price - a.price);
    if (sort === "name") prods.sort((a, b) => a.name.localeCompare(b.name));

    const grid  = document.getElementById("prodGrid");
    const count = document.getElementById("prodCount");
    if (!grid) return;
    if (count) count.textContent = `${prods.length} produit${prods.length > 1 ? "s" : ""}`;

    grid.innerHTML = prods.length
      ? prods.map(p => this._prodCard(p)).join("")
      : `<div class="empty-state"><div style="font-size:3rem;margin-bottom:.8rem">🔍</div><p style="font-weight:800">Aucun produit trouvé</p></div>`;
  },

  _prodCard(p) {
    const tagLabel = p.stock ? (FC.TAG_LABELS[p.tag] || "Nouveau") : "Rupture";
    const tagClass = p.stock ? `tag-${p.tag || "new"}` : "tag-rup";
    const isFav = this.favs.includes(p.id);
    return `
      <div class="pcard" id="pc-${p.id}">
        <div class="pcard-img" style="background:linear-gradient(135deg,${p.bg},${p.bg}bb)">
          ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : ""}
          <span class="efb"${p.image ? ' style="display:none"' : ""}>${p.icon || "🛒"}</span>
          <span class="pcard-tag ${tagClass}">${tagLabel}</span>
          <button class="pcard-fav" onclick="Boutique.toggleFav(${p.id},this)">${isFav ? "❤️" : "🤍"}</button>
        </div>
        <div class="pcard-body">
          <div class="pcard-cat">${p.cat}</div>
          <div class="pcard-name">${p.name}</div>
          <div class="pcard-desc">${p.desc || ""}</div>
          <div class="pcard-foot">
            <span class="pcard-price">
              ${p.price.toLocaleString("fr-FR")} <span class="pcard-unit">FCFA/${p.unit}</span>
            </span>
            ${p.stock ? `<button class="add-btn" onclick="Boutique.addToCart(${p.id})">+</button>` : ""}
          </div>
        </div>
      </div>`;
  },

  // ── Panier ───────────────────────────────────────────
  addToCart(id) {
    Cart.add(id);
    Cart.render();
    const p = Store.products().find(x => x.id === id);
    if (p) Utils.toast(`✅ ${p.name} ajouté`);
    const btn = document.querySelector(`#pc-${id} .add-btn`);
    if (btn) {
      btn.style.transform = "scale(1.5) rotate(90deg)";
      btn.style.background = "var(--o)";
      setTimeout(() => { btn.style.transform = ""; btn.style.background = ""; }, 340);
    }
  },

  openCart()  { Utils.open("cartOverlay");  Utils.open("cartPanel"); },
  closeCart() { Utils.close("cartOverlay"); Utils.close("cartPanel"); },

  showOrderForm() {
    if (Cart.isEmpty()) { Utils.toast("⚠️ Panier vide !"); return; }
    const s1 = document.getElementById("cartStep1");
    const s2 = document.getElementById("cartStep2");
    if (s1) s1.style.display = "none";
    if (s2) s2.style.display = "";
  },

  hideOrderForm() {
    const s1 = document.getElementById("cartStep1");
    const s2 = document.getElementById("cartStep2");
    if (s1) s1.style.display = "";
    if (s2) s2.style.display = "none";
  },

  submitOrder() {
    const name    = Utils.val("oName");
    const phone   = Utils.val("oPhone");
    const address = Utils.val("oAddr");
    const payment = Utils.val("oPay");
    const note    = Utils.val("oNote");
    if (!name || !phone || !address || !payment) {
      Utils.toast("⚠️ Remplissez tous les champs *", "err");
      return;
    }
    const order = Orders.create({ name, phone, address, payment, note });
    Cart.clear();
    Cart.render();
    this.closeCart();
    this.hideOrderForm();
    Utils.toast(`🎉 Commande ${order.id} confirmée !`);
    this.searchOrders();
  },

  orderWhatsApp() {
    if (Cart.isEmpty()) { Utils.toast("⚠️ Panier vide !"); return; }
    const phone = (Store.settings().phone || "0700000000").replace(/\D/g, "");
    const lines = Cart.items.map(i => `• ${i.name} x${i.qty} = ${Utils.fcfa(i.price * i.qty)}`).join("\n");
    const msg = `🛒 *Commande FreshCorner*\n\n${lines}\n\n*Total : ${Utils.fcfa(Cart.total())}*`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  },

  // ── Suivi commande ───────────────────────────────────
  searchOrders() {
    const q  = Utils.val("orderQ");
    const el = document.getElementById("ordersGrid");
    if (!el) return;
    if (!q) {
      el.innerHTML = `<p class="muted-hint">Entrez votre numéro pour voir vos commandes.</p>`;
      return;
    }
    const results = Orders.filter({ query: q });
    el.innerHTML = results.length
      ? results.slice().reverse().map(o => Orders.clientCardHTML(o)).join("")
      : `<p class="muted-hint">Aucune commande trouvée pour ce numéro.</p>`;
  },

  // ── Favoris ──────────────────────────────────────────
  toggleFav(id, btn) {
    if (this.favs.includes(id)) {
      this.favs = this.favs.filter(f => f !== id);
      btn.textContent = "🤍";
    } else {
      this.favs.push(id);
      btn.textContent = "❤️";
    }
    Store.saveFavs(this.favs);
  },

  // ── Connexion admin depuis boutique ──────────────────
  openAdminLogin() {
    Utils.open("modalBg");
    setTimeout(() => document.getElementById("alUser")?.focus(), 300);
  },

  closeAdminLogin() { Utils.close("modalBg"); },

  doAdminLogin() {
    const user = Utils.val("alUser");
    const pass = document.getElementById("alPass")?.value || "";

    if (Auth.login(user, pass)) {
      // Redirection vers admin.html — fonctionne en file:// ET http://
      window.location.href = "admin.html";
    } else {
      const err = document.getElementById("loginErr");
      const inp = document.getElementById("alPass");
      if (err) err.style.display = "block";
      if (inp) inp.style.borderColor = "var(--o)";
      setTimeout(() => {
        if (err) err.style.display = "none";
        if (inp) inp.style.borderColor = "";
      }, 2800);
    }
  },
};


// ════════════════════════════════════════════════════════
//  ADMIN  (admin.html)
// ════════════════════════════════════════════════════════
const Admin = {

  // ── Accès & Auth ─────────────────────────────────────

  /**
   * Point d'entrée unique de admin.html.
   * Appelé une seule fois via <script>Admin.checkAccess()</script>
   * en bas de la page, après le chargement de app.js.
   */
  checkAccess() {
    const loginEl = document.getElementById("loginScreen");
    const appEl   = document.getElementById("app");

    if (Auth.isLogged()) {
      // ✅ Connecté → afficher l'app, masquer le login
      if (loginEl) loginEl.style.display = "none";
      if (appEl)   appEl.classList.add("show");
      this._startApp();
    } else {
      // 🔒 Pas connecté → afficher le login, masquer l'app
      if (loginEl) loginEl.style.display = "flex";
      if (appEl)   appEl.classList.remove("show");
      // Mettre le focus sur le champ identifiant
      setTimeout(() => document.getElementById("lu")?.focus(), 100);
    }
  },

  doLogin() {
    const user = Utils.val("lu");
    const pass = document.getElementById("lp")?.value || "";

    if (!user || !pass) {
      Utils.toast("⚠️ Remplissez l'identifiant et le mot de passe", "err");
      return;
    }

    if (Auth.login(user, pass)) {
      const loginEl = document.getElementById("loginScreen");
      const appEl   = document.getElementById("app");
      if (loginEl) loginEl.style.display = "none";
      if (appEl)   appEl.classList.add("show");
      this._startApp();
    } else {
      const lerr = document.getElementById("lerr");
      const lp   = document.getElementById("lp");
      if (lerr) lerr.style.display = "block";
      if (lp)   { lp.style.borderColor = "var(--o)"; lp.select(); }
      setTimeout(() => {
        if (lerr) lerr.style.display = "none";
        if (lp)   lp.style.borderColor = "";
      }, 2500);
    }
  },

  logout() {
    Auth.logout();
    const loginEl = document.getElementById("loginScreen");
    const appEl   = document.getElementById("app");
    if (appEl)   appEl.classList.remove("show");
    if (loginEl) loginEl.style.display = "flex";
    const lp = document.getElementById("lp");
    if (lp) { lp.value = ""; }
    setTimeout(() => document.getElementById("lu")?.focus(), 100);
  },

  _startApp() {
    const dateEl = document.getElementById("topDate");
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString("fr-FR", {
      weekday:"long", day:"numeric", month:"long"
    });
    this._updateBadge();
    this.goPage("dashboard", document.querySelector(".sb-item"));
  },

  _updateBadge() {
    const n  = Orders.pendingCount();
    const el = document.getElementById("pendingBadge");
    if (!el) return;
    el.style.display = n ? "flex" : "none";
    el.textContent   = n;
  },

  // ── Navigation ───────────────────────────────────────
  TITLES: {
    dashboard:"Tableau de bord", produits:"Produits",
    commandes:"Commandes", livraisons:"Livraisons",
    categories:"Catégories", settings:"Paramètres",
  },

  goPage(page, el) {
    document.querySelectorAll(".sb-item").forEach(i => i.classList.remove("active"));
    if (el) el.classList.add("active");
    const titleEl = document.getElementById("pageTitle");
    if (titleEl) titleEl.textContent = this.TITLES[page] || page;
    const content = document.getElementById("pageContent");
    if (!content) return;
    const pages = {
      dashboard:  () => this._pageDashboard(),
      produits:   () => this._pageProducts(),
      commandes:  () => this._pageOrders(),
      livraisons: () => this._pageDeliveries(),
      categories: () => this._pageCategories(),
      settings:   () => this._pageSettings(),
    };
    content.innerHTML = (pages[page] || (() => ""))();
    if (page === "commandes") this._updateBadge();
  },


  // ════════════════════════════════════════
  //  PAGE DASHBOARD
  // ════════════════════════════════════════
  _pageDashboard() {
    const prods      = Store.products();
    const orders     = Store.orders();
    const pending    = orders.filter(o => o.status === "pending");
    const delivering = orders.filter(o => o.status === "delivering");
    const done       = orders.filter(o => o.status === "done");
    const rupt       = prods.filter(p => !p.stock);
    const revenue    = done.reduce((s, o) => s + o.total, 0);
    const cats       = [...new Set(prods.map(p => p.cat))];

    const barRows = cats.map(c => {
      const n = prods.filter(p => p.cat === c).length;
      const pct = prods.length ? Math.round(n / prods.length * 100) : 0;
      return `<div style="margin-bottom:.8rem">
        <div style="display:flex;justify-content:space-between;font-size:.82rem;font-weight:700;margin-bottom:.3rem">
          <span>${c}</span><span style="color:var(--muted)">${n}</span>
        </div>
        <div style="background:var(--border);border-radius:99px;height:6px;overflow:hidden">
          <div style="height:100%;border-radius:99px;background:var(--g);width:${pct}%"></div>
        </div>
      </div>`;
    }).join("");

    const recentRows = orders.slice(-6).reverse().map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.name}</td>
        <td><span class="ostatus s-${o.status}">${FC.STATUS_LABELS[o.status] || o.status}</span></td>
        <td class="td-price">${Utils.fcfa(o.total)}</td>
      </tr>`).join("");

    const pendingRows = pending.slice(0, 5).map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.name}<br><small style="color:var(--muted)">${o.phone}</small></td>
        <td class="td-price">${Utils.fcfa(o.total)}</td>
        <td style="color:var(--muted);font-size:.8rem">${o.date}</td>
        <td><button class="btn-edit" onclick="Admin.changeStatus('${o.id}','confirmed')">Confirmer ✓</button></td>
      </tr>`).join("");

    return `
      <div class="kpi-row">
        <div class="kpi"><div class="kpi-lbl">Produits</div><div class="kpi-val kv-g">${prods.length}<span class="kpi-ico">🛒</span></div><div class="kpi-sub">${prods.filter(p=>p.stock).length} disponibles</div></div>
        <div class="kpi"><div class="kpi-lbl">Commandes</div><div class="kpi-val kv-b">${orders.length}<span class="kpi-ico">📦</span></div><div class="kpi-sub">${pending.length} en attente</div></div>
        <div class="kpi"><div class="kpi-lbl">En livraison</div><div class="kpi-val kv-o">${delivering.length}<span class="kpi-ico">🚴</span></div><div class="kpi-sub">à livrer</div></div>
        <div class="kpi"><div class="kpi-lbl">Chiffre d'affaires</div><div class="kpi-val kv-g">${revenue.toLocaleString("fr-FR")}<span class="kpi-ico">💰</span></div><div class="kpi-sub">FCFA livré</div></div>
        ${rupt.length ? `<div class="kpi"><div class="kpi-lbl">Ruptures</div><div class="kpi-val kv-o">${rupt.length}<span class="kpi-ico">⚠️</span></div><div class="kpi-sub">à réappro.</div></div>` : ""}
      </div>

      ${pending.length ? `
      <div class="card">
        <div class="card-head"><h3>🔔 Nouvelles commandes (${pending.length})</h3>
          <button class="btn-add" onclick="Admin.goPage('commandes',document.querySelectorAll('.sb-item')[2])">Gérer →</button>
        </div>
        <div class="tbl-wrap"><table>
          <thead><tr><th>Commande</th><th>Client</th><th>Total</th><th>Date</th><th></th></tr></thead>
          <tbody>${pendingRows}</tbody>
        </table></div>
      </div>` : ""}

      <div class="dash-grid">
        <div class="card">
          <div class="card-head"><h3>📦 Dernières commandes</h3></div>
          <div class="tbl-wrap">
            ${orders.length
              ? `<table><thead><tr><th>ID</th><th>Client</th><th>Statut</th><th>Total</th></tr></thead><tbody>${recentRows}</tbody></table>`
              : `<div class="empty-block">Aucune commande pour l'instant.</div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>📊 Par catégorie</h3></div>
          <div class="card-body">${barRows}</div>
        </div>
      </div>

      ${rupt.length ? `
      <div class="alert-rupt">
        <span class="alert-icon">⚠️</span>
        <div>
          <strong>Rupture : ${rupt.map(p=>p.name).join(", ")}</strong>
          <div class="alert-sub">Pensez à réapprovisionner ou marquer disponible</div>
        </div>
        <button class="btn-edit" onclick="Admin.goPage('produits',document.querySelectorAll('.sb-item')[1])">Gérer →</button>
      </div>` : ""}`;
  },


  // ════════════════════════════════════════
  //  PAGE PRODUITS
  // ════════════════════════════════════════
  _pageProducts() {
    const prods = Store.products();
    return `
      <div class="page-head">
        <div>
          <h2>🛒 Produits (${prods.length})</h2>
          <p class="page-sub">${prods.filter(p=>p.stock).length} en stock · ${prods.filter(p=>!p.stock).length} en rupture</p>
        </div>
        <button class="btn-add" onclick="Admin.openModal()">+ Ajouter un produit</button>
      </div>
      <div class="card">
        <div class="tbar">
          <div class="tsearch">
            <span>🔍</span>
            <input type="text" id="tSearch" placeholder="Rechercher..." oninput="Admin.filterTable()">
          </div>
          <select class="tsel" id="tCat" onchange="Admin.filterTable()">
            <option value="">Toutes catégories</option>
            ${Store.cats().map(c => `<option value="${c}">${c}</option>`).join("")}
          </select>
          <select class="tsel" id="tStock" onchange="Admin.filterTable()">
            <option value="">Tout stock</option>
            <option value="yes">✅ En stock</option>
            <option value="no">❌ Rupture</option>
          </select>
        </div>
        <div class="tbl-wrap" id="prodTableWrap">${this._prodTableHTML(prods)}</div>
      </div>`;
  },

  _prodTableHTML(prods) {
    if (!prods.length) return `<div class="empty-block"><div style="font-size:3rem;margin-bottom:.8rem">🔍</div><p>Aucun produit trouvé</p></div>`;
    return `<table>
      <thead><tr><th></th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Unité</th><th>Stock</th><th>Actions</th></tr></thead>
      <tbody>${prods.map(p => `
        <tr>
          <td>
            <div class="prod-thumb" style="background:${p.bg}">
              ${p.image ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">` : ""}
              ${p.icon || "🛒"}
            </div>
          </td>
          <td><strong>${p.name}</strong><br><small style="color:var(--muted)">${p.desc || ""}</small></td>
          <td><span class="td-cat">${p.cat}</span></td>
          <td class="td-price">${p.price.toLocaleString("fr-FR")} FCFA</td>
          <td class="td-unit">/${p.unit}</td>
          <td>
            <button class="stock-pill ${p.stock ? "sp-yes" : "sp-no"}" onclick="Admin.toggleStock(${p.id})">
              ${p.stock ? "✅ En stock" : "❌ Rupture"}
            </button>
          </td>
          <td>
            <div class="td-actions">
              <button class="btn-edit" onclick="Admin.openModal(${p.id})">✏️ Modifier</button>
              <button class="btn-del"  onclick="Admin.confirmDel(${p.id})">🗑️</button>
            </div>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  },

  filterTable() {
    let p = Store.products();
    const q  = (document.getElementById("tSearch")?.value || "").toLowerCase();
    const c  = document.getElementById("tCat")?.value || "";
    const st = document.getElementById("tStock")?.value || "";
    if (q)        p = p.filter(x => x.name.toLowerCase().includes(q) || (x.desc||"").toLowerCase().includes(q));
    if (c)        p = p.filter(x => x.cat === c);
    if (st==="yes") p = p.filter(x => x.stock);
    if (st==="no")  p = p.filter(x => !x.stock);
    const wrap = document.getElementById("prodTableWrap");
    if (wrap) wrap.innerHTML = this._prodTableHTML(p);
  },

  toggleStock(id) {
    const prods = Store.products();
    const p = prods.find(x => x.id === id);
    if (!p) return;
    p.stock = !p.stock;
    Store.saveProducts(prods);
    this.filterTable();
    Utils.toast(p.stock ? `✅ ${p.name} en stock` : `⚠️ ${p.name} rupture`);
  },

  // ── Modal produit ────────────────────────────────────
  openModal(id = null) {
    const sel = document.getElementById("fCat");
    if (sel) sel.innerHTML = '<option value="">-- Choisir --</option>' + Store.cats().map(c => `<option value="${c}">${c}</option>`).join("");

    const ip = document.getElementById("iconPicker");
    if (ip) ip.innerHTML = FC.ICONS.map(i => `<span class="icon-opt" onclick="Admin.selIcon('${i}')">${i}</span>`).join("");

    const cp = document.getElementById("colorPicker");
    if (cp) cp.innerHTML = FC.COLORS.map(c => `<div class="color-opt" style="background:${c}" onclick="Admin.selColor('${c}')"></div>`).join("");

    this._clearImg();

    if (id) {
      const p = Store.products().find(x => x.id === id);
      if (!p) return;
      document.getElementById("modalTitle").textContent = "✏️ Modifier le produit";
      Utils.setVal("editId", id);
      Utils.setVal("fName",  p.name);
      Utils.setVal("fCat",   p.cat);
      Utils.setVal("fPrice", p.price);
      Utils.setVal("fUnit",  p.unit);
      Utils.setVal("fDesc",  p.desc || "");
      Utils.setVal("fIcon",  p.icon);
      Utils.setVal("fBg",    p.bg);
      Utils.setVal("fTag",   p.tag || "new");
      Utils.setVal("fStock", String(p.stock));
      Utils.setVal("fImage", p.image || "");
      if (p.image) this._showImg(p.image);
    } else {
      document.getElementById("modalTitle").textContent = "➕ Nouveau produit";
      ["editId","fName","fPrice","fUnit","fDesc","fImage"].forEach(i => Utils.setVal(i, ""));
      Utils.setVal("fIcon","🛒"); Utils.setVal("fBg","#e8f7ee");
      Utils.setVal("fTag","new"); Utils.setVal("fStock","true"); Utils.setVal("fCat","");
    }
    Utils.open("modalBg");
  },

  closeModal() { Utils.close("modalBg"); },

  selIcon(i) {
    Utils.setVal("fIcon", i);
    document.querySelectorAll(".icon-opt").forEach(el => el.classList.toggle("sel", el.textContent === i));
  },

  selColor(c) {
    Utils.setVal("fBg", c);
    document.querySelectorAll(".color-opt").forEach(el =>
      el.classList.toggle("sel", el.style.background === c || el.style.backgroundColor === c));
  },

  handleImgUpload(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { Utils.toast("⚠️ Image trop lourde (max 2 Mo)", "err"); return; }
    const reader = new FileReader();
    reader.onload = e => { Utils.setVal("fImage", e.target.result); this._showImg(e.target.result); };
    reader.readAsDataURL(file);
  },

  previewUrl(url) { if (url) this._showImg(url); },

  _showImg(src) {
    const prev   = document.getElementById("imgPreview");
    const prompt = document.getElementById("uploadPrompt");
    if (prev)   { prev.src = src; prev.style.display = "block"; }
    if (prompt) prompt.style.display = "none";
  },

  _clearImg() {
    const prev   = document.getElementById("imgPreview");
    const prompt = document.getElementById("uploadPrompt");
    const file   = document.getElementById("imgFile");
    if (prev)   prev.style.display = "none";
    if (prompt) prompt.style.display = "";
    if (file)   file.value = "";
    Utils.setVal("fImage", "");
  },

  saveProduct() {
    const name  = Utils.val("fName");
    const cat   = Utils.val("fCat");
    const price = parseInt(Utils.val("fPrice"));
    const unit  = Utils.val("fUnit");
    if (!name || !cat || !price || !unit) {
      Utils.toast("⚠️ Remplissez les champs obligatoires (*)", "err");
      return;
    }
    const prods = Store.products();
    const eid   = parseInt(Utils.val("editId")) || null;
    const prod  = {
      id:    eid || (Math.max(0, ...prods.map(p => p.id)) + 1),
      name, cat, price, unit,
      desc:  Utils.val("fDesc"),
      icon:  Utils.val("fIcon") || "🛒",
      bg:    Utils.val("fBg")   || "#e8f7ee",
      tag:   Utils.val("fTag")  || "new",
      stock: Utils.val("fStock") === "true",
      image: Utils.val("fImage") || "",
    };
    if (eid) { const idx = prods.findIndex(p => p.id === eid); prods[idx] = prod; }
    else { prods.push(prod); }
    Store.saveProducts(prods);
    this.closeModal();
    this.goPage("produits", null);
    Utils.toast(eid ? "✅ Produit modifié !" : "✅ Produit ajouté !");
  },

  _delId: null,
  confirmDel(id) { this._delId = id; Utils.open("confirmBg"); },
  closeConfirm()  { Utils.close("confirmBg"); this._delId = null; },
  execDel() {
    if (!this._delId) return;
    Store.saveProducts(Store.products().filter(p => p.id !== this._delId));
    this.closeConfirm();
    this.goPage("produits", null);
    Utils.toast("🗑️ Produit supprimé");
  },


  // ════════════════════════════════════════
  //  PAGE COMMANDES
  // ════════════════════════════════════════
  _pageOrders() {
    return `
      <div class="page-head">
        <div><h2>📦 Commandes (${Store.orders().length})</h2></div>
        <div class="page-filters">
          <div class="tsearch">
            <span>🔍</span>
            <input type="text" id="oSearch" placeholder="Chercher..." oninput="Admin.renderOrdersList()">
          </div>
          <select class="tsel" id="oStatus" onchange="Admin.renderOrdersList()">
            <option value="">Tous statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="delivering">En livraison</option>
            <option value="done">Livrées</option>
          </select>
        </div>
      </div>
      <div id="ordersContainer">${this._ordersGridHTML(Store.orders())}</div>`;
  },

  renderOrdersList() {
    const q  = (document.getElementById("oSearch")?.value || "").toLowerCase();
    const st = document.getElementById("oStatus")?.value || "";
    const el = document.getElementById("ordersContainer");
    if (el) el.innerHTML = this._ordersGridHTML(Orders.filter({ query: q, status: st }));
  },

  _ordersGridHTML(list) {
    if (!list.length) return `<div class="empty-block"><div style="font-size:3rem;margin-bottom:.8rem">📭</div><p>Aucune commande trouvée</p></div>`;
    return `<div class="order-grid">${list.slice().reverse().map(o => this._orderCardHTML(o)).join("")}</div>`;
  },

  _orderCardHTML(o) {
    const opts = Object.entries(FC.STATUS_LABELS)
      .map(([v, l]) => `<option value="${v}"${o.status===v?" selected":""}>${l}</option>`).join("");
    return `
      <div class="ocard">
        <div class="ocard-head">
          <span class="ocard-id">${o.id}</span>
          <span class="ostatus s-${o.status}">${FC.STATUS_LABELS[o.status] || o.status}</span>
        </div>
        <div class="ocard-client">👤 ${o.name}</div>
        <div class="ocard-addr">📍 ${o.address}</div>
        <div class="ocard-pay">💳 ${o.payment} · ⏰ ${o.date}</div>
        ${o.note ? `<div class="ocard-note">💬 ${o.note}</div>` : ""}
        <div class="ocard-items">${o.items.map(i=>`${i.name} x${i.qty} = ${Utils.fcfa(i.price*i.qty)}`).join("<br>")}</div>
        <div class="ocard-foot">
          <span class="ocard-total">${Utils.fcfa(o.total)}</span>
          <div class="ocard-actions">
            <select class="status-select" onchange="Admin.changeStatus('${o.id}',this.value)">${opts}</select>
            <button class="btn-del" onclick="Admin.deleteOrder('${o.id}')">🗑️</button>
          </div>
        </div>
      </div>`;
  },

  changeStatus(id, status) {
    Orders.setStatus(id, status);
    this._updateBadge();
    this.renderOrdersList();
    Utils.toast("✅ Statut mis à jour");
  },

  deleteOrder(id) {
    if (!confirm("Supprimer cette commande ?")) return;
    Orders.delete(id);
    this.goPage("commandes", null);
    Utils.toast("🗑️ Commande supprimée");
  },


  // ════════════════════════════════════════
  //  PAGE LIVRAISONS
  // ════════════════════════════════════════
  _pageDeliveries() {
    const orders     = Store.orders();
    const delivering = orders.filter(o => o.status === "delivering");
    const confirmed  = orders.filter(o => o.status === "confirmed");
    const done       = orders.filter(o => o.status === "done");
    const revenue    = done.reduce((s, o) => s + o.total, 0);

    const livrCard = o => `
      <div class="ocard ocard-urgent">
        <div class="ocard-head"><span class="ocard-id">${o.id}</span><span class="ostatus s-delivering">En livraison</span></div>
        <div class="ocard-client">👤 ${o.name} · 📞 <a href="tel:${o.phone}" class="tel-link">${o.phone}</a></div>
        <div class="ocard-addr">📍 ${o.address}</div>
        <div class="ocard-items ocard-items-sm">${o.items.map(i=>`${i.name} x${i.qty}`).join(" · ")}</div>
        <div class="ocard-foot">
          <span class="ocard-total">${Utils.fcfa(o.total)}</span>
          <button class="btn-add btn-sm" onclick="Admin.changeStatus('${o.id}','done');Admin.goPage('livraisons',null)">✅ Livrée</button>
        </div>
      </div>`;

    const confCard = o => `
      <div class="ocard">
        <div class="ocard-head"><span class="ocard-id">${o.id}</span><span class="ostatus s-confirmed">Confirmée</span></div>
        <div class="ocard-client">👤 ${o.name} · 📞 <a href="tel:${o.phone}" class="tel-link">${o.phone}</a></div>
        <div class="ocard-addr">📍 ${o.address}</div>
        <div class="ocard-items ocard-items-sm">${o.items.map(i=>`${i.name} x${i.qty}`).join(" · ")}</div>
        <div class="ocard-foot">
          <span class="ocard-total">${Utils.fcfa(o.total)}</span>
          <button class="btn-add btn-sm" onclick="Admin.changeStatus('${o.id}','delivering');Admin.goPage('livraisons',null)">🚴 Expédier</button>
        </div>
      </div>`;

    return `
      <div class="page-head"><h2>🚴 Livraisons</h2></div>
      <div class="livr-stats">
        <div class="livr-kpi"><div class="livr-kpi-val" style="color:var(--o)">${delivering.length}</div><div class="livr-kpi-lbl">En cours</div></div>
        <div class="livr-kpi"><div class="livr-kpi-val" style="color:#2563eb">${confirmed.length}</div><div class="livr-kpi-lbl">À préparer</div></div>
        <div class="livr-kpi"><div class="livr-kpi-val" style="color:var(--g)">${done.length}</div><div class="livr-kpi-lbl">Livrées</div></div>
        <div class="livr-kpi"><div class="livr-kpi-val" style="color:var(--g)">${revenue.toLocaleString("fr-FR")}</div><div class="livr-kpi-lbl">FCFA encaissés</div></div>
      </div>
      ${delivering.length ? `<div class="card" style="margin-bottom:1.5rem"><div class="card-head"><h3>🔴 En livraison (${delivering.length})</h3></div><div class="order-grid card-grid-pad">${delivering.map(livrCard).join("")}</div></div>` : ""}
      ${confirmed.length  ? `<div class="card"><div class="card-head"><h3>🟡 À expédier (${confirmed.length})</h3></div><div class="order-grid card-grid-pad">${confirmed.map(confCard).join("")}</div></div>` : ""}
      ${!delivering.length && !confirmed.length ? `<div class="empty-block big"><div style="font-size:3rem;margin-bottom:.8rem">🎉</div><p><strong>Aucune livraison en cours</strong></p><p class="page-sub" style="margin-top:.3rem">Toutes les commandes sont à jour !</p></div>` : ""}`;
  },


  // ════════════════════════════════════════
  //  PAGE CATÉGORIES
  // ════════════════════════════════════════
  _pageCategories() {
    const cats  = Store.cats();
    const prods = Store.products();
    return `
      <div class="page-head"><h2>📂 Catégories (${cats.length})</h2></div>
      <div class="two-col">
        <div class="card">
          <div class="card-head"><h3>Liste des catégories</h3></div>
          <div class="card-body cat-list">
            ${cats.map((c, i) => `
              <div class="cat-row">
                <span class="cat-row-name">${c}</span>
                <span class="cat-row-count">${prods.filter(p=>p.cat===c).length} produits</span>
                <button class="btn-del" onclick="Admin.deleteCat(${i})">🗑️</button>
              </div>`).join("")}
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>➕ Ajouter une catégorie</h3></div>
          <div class="card-body">
            <div class="mg"><label class="mg-label">Nom de la catégorie</label>
              <input type="text" id="newCat" class="mg-input" placeholder="Ex: Céréales bio...">
            </div>
            <button class="btn-save" onclick="Admin.addCat()">Ajouter</button>
          </div>
        </div>
      </div>`;
  },

  addCat() {
    const name = Utils.val("newCat");
    if (!name) { Utils.toast("⚠️ Entrez un nom", "err"); return; }
    const cats = Store.cats();
    if (cats.includes(name)) { Utils.toast("⚠️ Catégorie existante", "err"); return; }
    cats.push(name);
    Store.saveCats(cats);
    this.goPage("categories", null);
    Utils.toast("✅ Catégorie ajoutée !");
  },

  deleteCat(i) {
    const cats = Store.cats();
    cats.splice(i, 1);
    Store.saveCats(cats);
    this.goPage("categories", null);
    Utils.toast("🗑️ Catégorie supprimée");
  },


  // ════════════════════════════════════════
  //  PAGE PARAMÈTRES
  // ════════════════════════════════════════
  _pageSettings() {
    const s = Store.settings();
    return `
      <div class="page-head"><h2>⚙️ Paramètres</h2></div>
      <div class="two-col">
        <div class="setting-block">
          <h3>🏪 Informations boutique</h3>
          <div class="sg"><label>Nom de la boutique</label><input type="text" id="sName" value="${s.shopName||"FreshCorner Abidjan"}"></div>
          <div class="sg"><label>Téléphone / WhatsApp</label><input type="text" id="sPhone" value="${s.phone||"+225 07 00 00 00 00"}"></div>
          <div class="sg"><label>Adresse</label><input type="text" id="sAddr" value="${s.address||"Abidjan, Côte d'Ivoire"}"></div>
          <div class="sg"><label>Horaires</label><input type="text" id="sHours" value="${s.hours||"Lun–Sam · 7h–20h"}"></div>
          <div class="sg"><label>Texte bannière promo</label><input type="text" id="sPromo" value="${s.promoText||""}"></div>
          <button class="btn-save" onclick="Admin.saveShopSettings()">💾 Enregistrer</button>
        </div>

        <div class="setting-block">
          <h3>🔐 Identifiants de connexion</h3>
          <div class="warn-box"><strong>⚠️ Attention</strong>Notez vos nouveaux identifiants avant d'enregistrer.</div>
          <div class="sg"><label>Identifiant</label><input type="text" id="sUser" value="${s.adminUser||"admin"}"></div>
          <div class="sg"><label>Nouveau mot de passe</label><input type="password" id="sPass" placeholder="Laisser vide = inchangé"></div>
          <div class="sg"><label>Confirmer</label><input type="password" id="sPassC" placeholder="Répétez..."></div>
          <button class="btn-save" onclick="Admin.saveAuthSettings()">🔑 Mettre à jour</button>
        </div>

        <div class="setting-block">
          <h3>📊 Infos système</h3>
          ${[["Produits",Store.products().length+" enregistrés"],["Catégories",Store.cats().length+" configurées"],["Commandes",Store.orders().length+" au total"],["Réalisé par","TwinDev Agency 🚀"]]
            .map(([k,v])=>`<div class="sys-row"><span class="sys-key">${k}</span><strong class="${k==="Réalisé par"?"sys-val-o":""}">${v}</strong></div>`).join("")}
        </div>

        <div class="setting-block">
          <h3>🔄 Réinitialisation</h3>
          <p class="page-sub" style="margin-bottom:1.2rem">Restaure les produits et catégories par défaut. Vos modifications seront perdues.</p>
          <button class="btn-del btn-full" onclick="Admin.resetData()">🔄 Réinitialiser les données</button>
        </div>
      </div>`;
  },

  saveShopSettings() {
    const s = Store.settings();
    Object.assign(s, {
      shopName:  Utils.val("sName"),
      phone:     Utils.val("sPhone"),
      address:   Utils.val("sAddr"),
      hours:     Utils.val("sHours"),
      promoText: Utils.val("sPromo"),
    });
    Store.saveSettings(s);
    Utils.toast("✅ Paramètres enregistrés !");
  },

  saveAuthSettings() {
    const u  = Utils.val("sUser");
    const p  = document.getElementById("sPass")?.value || "";
    const pc = document.getElementById("sPassC")?.value || "";
    if (!u) { Utils.toast("⚠️ Identifiant requis", "err"); return; }
    if (p && p !== pc) { Utils.toast("⚠️ Les mots de passe ne correspondent pas", "err"); return; }
    const s = Store.settings();
    s.adminUser = u;
    if (p) s.adminPass = p;
    Store.saveSettings(s);
    Utils.toast("✅ Identifiants mis à jour !");
  },

  resetData() {
    if (!confirm("Réinitialiser toutes les données ?")) return;
    localStorage.removeItem("fc_products");
    localStorage.removeItem("fc_cats");
    this.goPage("dashboard", document.querySelector(".sb-item"));
    Utils.toast("🔄 Données réinitialisées");
  },
};