/* ---------------------------------------------------------
   LIBRE BANK — prototipo interactivo sin dependencias.
   Este proyecto es educativo: no procesa ni mueve dinero real.
   --------------------------------------------------------- */

const $ = (selector, root = document) => root.querySelector(selector);
const root = $("#view-root");
const toast = $("#toast");

const state = {
  screen: "home",
  history: [],
  direction: "forward",
  activeTab: "home",
  currency: "ARS",
  showBalance: true,
  search: "",
  recipient: null,
  destinationAccount: null,
  amountDigits: "",
  sourceAccount: 0,
  processing: false,
  successPromoDismissed: false,
};

const contacts = [
  { id: "sofia", name: "Sofía Almirón", alias: "Sofi.Almiron", initials: "SA", bank: "Mercado Pago", color: "#e6f3ed", recent: true },
  { id: "mateo", name: "Mateo Benítez", alias: "Mateo.Benitez", initials: "MB", bank: "Banco del Sur", color: "#eaf0f7", recent: true },
  { id: "valentina", name: "Valentina Ríos", alias: "Vale.Rios", initials: "VR", bank: "Mercado Pago", color: "#f6eee5", recent: true },
  { id: "tomas", name: "Zaira Abril Mudry", alias: "NaviMemesina43", initials: "TP", bank: "Cooperativa Federal", color: "#f1edf7", recent: false },
  { id: "camila", name: "Alberto Gimenez Britez", alias: "Alberto.05", initials: "CA", bank: "Banco del Sur", color: "#edf2e8", recent: false },
];

const destinationAccounts = [
  { id: "digital", name: "Mercado Pago", detail: "Alias: Alberto.05", institution: " ", mark: "MP" },
  { id: "savings", name: "Naranja Digital Compañia Financiera S.A.", detail: "Alias: alberto.32mp", institution: " ", mark: "NX" },
];

const sourceAccounts = [
  { id: "main", name: "Cuenta principal", number: "•••• 2048", balance: 78630.63, label: "DISPONIBLE" },
  { id: "savings", name: "Fondo de estudio", number: "•••• 7712", balance: 125400.00, label: "AHORRO" },
];

const currencyBalances = {
  ARS: { label: "Pesos", amount: 78630.63, change: "Rinde 18,5%" },
  USD: { label: "Dólares", amount: 125.40, change: "Objetivo: USD 500" },
  GOALS: { label: "Reservas", amount: 2, change: "2 reservas en curso" },
  YIELD: { label: "Rendimiento", amount: 8.4, change: "Progreso educativo" },
};

const iconPaths = {
  search: '<circle cx="11" cy="11" r="7.2"/><path d="m16.5 16.5 4 4"/>',
  camera: '<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.2"/>',
  moreVertical: '<circle cx="12" cy="5" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 3.8M6.2 6.2C3.5 8.1 2 12 2 12s3.6 7 10 7c1.2 0 2.3-.2 3.3-.6"/>',
  arrowLeft: '<path d="m15 18-6-6 6-6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.4.8l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.4-.8l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.6l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.4-.8l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.4.8l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.6Z" transform="translate(-1 -1) scale(1.05)"/>',
  wallet: '<rect x="3" y="5" width="18" height="15" rx="2"/><path d="M3 9h18M16 14h2"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="12" r="2"/><path d="M14 10h4M14 14h4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20M8 7h8"/>',
  chart: '<path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-7"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  spark: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8Z"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  close: '<path d="m18 6-12 12M6 6l12 12"/>',
  backspace: '<path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1Z"/><path d="m12 9 6 6m0-6-6 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.7 6.6-4.4m-6.6 8 6.6 4.1"/>',
};

function icon(name, extra = "") {
  return `<svg class="${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.grid}</svg>`;
}

function money(value, decimals = 2) {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function currentAmount() {
  return Number((state.amountDigits || "0").replace(",", "."));
}

function amountDisplay() {
  const value = state.amountDigits || "0";
  const [integer, decimal] = value.split(",");
  const formattedInteger = Number(integer || 0).toLocaleString("es-AR");
  return decimal !== undefined ? `${formattedInteger},${decimal}` : formattedInteger;
}

function updateAmountScreen() {
  const display = $(".amount-number", root);
  const displayContainer = $(".amount-display", root);
  if (!display || !displayContainer) return;

  display.textContent = amountDisplay();
  displayContainer.classList.toggle("is-placeholder", state.amountDigits.length === 0);

  const amount = currentAmount();
  const continueButton = $(".amount-continue", root);
  if (continueButton) {
    continueButton.disabled = amount <= 0 || amount > sourceAccounts[state.sourceAccount].balance;
  }
  root.querySelectorAll(".quick-amount").forEach((button) => {
    button.classList.toggle("active", amount === Number(button.dataset.value));
  });
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}

function brandLockup() {
  return `<div class="brand-lockup"><img class="brand-mark" src="logo-libre-bank.png" alt=""><div><p class="brand-name">Libre Bank</p><p class="brand-caption">Aprendé.</p></div></div>`;
}

function bottomNav() {
  const items = [
    ["home", "Inicio", "wallet"],
    ["learn", "Tarjeta", "book"],
    ["practice", "Qr", "spark"],
    ["progress", "Servicios", "chart"],
    ["more", "Más", "grid"],
  ];
  return `<nav class="bottom-nav" aria-label="Navegación principal">
    ${items.map(([key, label, glyph]) => key === "practice"
      ? `<button class="nav-item practice" data-action="start-practice" aria-label="Practicar"><span class="practice-orb">${icon(glyph)}</span><span>${label}</span></button>`
      : `<button class="nav-item ${state.activeTab === key ? "active" : ""}" data-action="nav" data-tab="${key}" ${state.activeTab === key ? 'aria-current="page"' : ""}>${icon(glyph)}<span>${label}</span></button>`).join("")}
  </nav>`;
}

function homeTemplate() {
  const balance = currencyBalances[state.currency];
  const isMoneyBalance = state.currency === "ARS" || state.currency === "USD";
  const balanceCurrency = state.currency === "USD" ? "US$" : "$";
  const balanceWhole = money(Math.trunc(balance.amount), 0);
  const balanceCents = String(Math.round((balance.amount % 1) * 100)).padStart(2, "0");
  const balanceValue = state.currency === "GOALS"
    ? `${balance.amount} reservas`
    : state.currency === "YIELD"
      ? `${money(balance.amount, 1)}%`
      : "";
  const tabs = [["ARS", "Pesos"], ["USD", "Dólares"], ["GOALS", "Reservas"], ["YIELD", "Inversiones"]];
  const balanceNote = state.currency === "ARS"
    ? `<span class="balance-note-arrow" aria-hidden="true">↑</span>${balance.change}`
    : balance.change;

  return `<section class="view with-nav">
    <header class="home-hero">
      <div class="home-topline">
        <div class="home-greeting"><img class="home-logo" src="logo-libre-bank.png" alt=""><h1 class="greeting">Hola, Enzo</h1></div>
        <div class="header-tools">
          <button class="icon-button" data-action="search" aria-label="Buscar">${icon("search")}</button>
          <button class="icon-button" data-action="notifications" aria-label="Notificaciones">${icon("bell")}</button>
        </div>
      </div>
      <div class="currency-tabs" role="tablist" aria-label="Resumen">
        ${tabs.map(([id, label]) => `<button class="currency-tab ${state.currency === id ? "active" : ""}" role="tab" aria-selected="${state.currency === id}" data-action="currency" data-currency="${id}">${id === "YIELD" ? '<span class="currency-tab-dot" aria-hidden="true"></span>' : ""}${label}</button>`).join("")}
      </div>
      <section class="balance-card" aria-label="Resumen de cuenta">
        <div class="balance-top">
          <div class="balance-main">
            <p class="balance-value">${state.showBalance ? isMoneyBalance ? `<span>${balanceCurrency} ${balanceWhole}</span><sup class="balance-cents">${balanceCents}</sup>` : balanceValue : "••••••"}</p>
            <button class="balance-visibility" data-action="toggle-balance" aria-label="${state.showBalance ? "Ocultar" : "Mostrar"} saldo">${icon(state.showBalance ? "eye" : "eyeOff")}</button>
          </div>
          <button class="balance-details" data-action="toast" data-message="Detalle de saldo disponible" aria-label="Ver detalle del saldo">${icon("chevron")}</button>
        </div>
        <p class="balance-note">${balanceNote}</p>
        <div class="balance-actions">
          <button class="balance-action" data-action="learn"><span>${icon("wallet")}</span><span>Ingresar</span></button>
          <button class="balance-action" data-action="start-practice"><span>${icon("send")}</span><span>Transferir</span></button>
          <button class="balance-action" data-action="profile"><span>${icon("id")}</span><span>Tus alias</span></button>
        </div>
      </section>
    </header>

    <section class="section home-section">
      <div class="home-section-heading"><h2>Créditos</h2><button class="text-link" data-action="toast" data-message="Sección de créditos demostrativa.">Consultar ${icon("arrowRight")}</button></div>
      <button class="credit-summary" data-action="toast" data-message="El detalle de tus créditos es demostrativo.">Consultá el detalle de tus créditos</button>
    </section>

    <section class="section">
      <div class="section-heading"><h2>Tu recorrido</h2><button class="text-link" data-action="nav" data-tab="progress">Ver progreso ${icon("arrowRight")}</button></div>
      <div class="progress-card">
        <div class="progress-copy"><span class="eyebrow">Módulo en curso</span><h3>Finanzas personales</h3><p>Vas por la unidad 4 de 6. Seguí a tu ritmo.</p></div>
        <div class="progress-ring" aria-label="68 por ciento completado"></div>
      </div>
    </section>

    <section class="section benefits-section" aria-labelledby="benefits-title">
      <div class="benefits-heading">
        <h2 id="benefits-title">Beneficios</h2>
        <button class="text-link" data-action="toast" data-message="Sección de beneficios demostrativa.">Conocer todos ${icon("arrowRight")}</button>
      </div>
      <div class="benefits-carousel" aria-label="Beneficios disponibles">
        <article class="benefit-card benefit-card-cabify">
          <div class="benefit-copy">
            <p>50% OFF<br>en Cabify</p>
            <button data-action="toast" data-message="Beneficio de Cabify demostrativo.">Usar beneficio ${icon("arrowRight")}</button>
          </div>
          <div class="benefit-photo">
            <img src="beneficios.png" alt="Pasajera en un auto">
            <span class="benefit-brand">cabify</span>
          </div>
        </article>
        <article class="benefit-card benefit-card-ypf">
          <div class="benefit-copy">
            <span class="benefit-tag">Todos los lunes</span>
            <p>10% de reintegro en YPF</p>
            <button data-action="toast" data-message="Beneficio de YPF demostrativo.">Usar beneficio ${icon("arrowRight")}</button>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-heading"><h2>Actividad reciente</h2><button class="text-link" data-action="toast" data-message="Todavía no hay movimientos reales.">Ver todo ${icon("arrowRight")}</button></div>
      <div class="activity-list">
        <div class="activity-row"><div class="activity-icon">${icon("book")}</div><div class="activity-main"><strong>Unidad completada</strong><span>Presupuesto mensual · Hoy</span></div><span class="activity-amount">+1 tema</span></div>
        <div class="activity-row"><div class="activity-icon">${icon("send")}</div><div class="activity-main"><strong>Ejercicio de envío</strong><span>Simulación · Ayer</span></div><span class="activity-amount">$ 2.500</span></div>
      </div>
    </section>
    ${bottomNav()}
  </section>`;
}

function toolbar(backLabel = "Volver") {
  return `<div class="flow-toolbar"><button class="icon-button back-button" data-action="back" aria-label="${backLabel}">${icon("arrowLeft")}</button><div class="toolbar-actions"><button class="icon-button" data-action="toast" data-message="Calendario de prácticas">${icon("calendar")}</button><button class="icon-button" data-action="toast" data-message="Preferencias de la simulación">${icon("settings")}</button></div></div>`;
}

function contactRow(contact) {
  return `<button class="contact-row" data-action="select-recipient" data-id="${contact.id}">
    <span class="contact-avatar">${contact.initials}</span>
    <span class="contact-copy"><strong>${contact.name}</strong><span>Alias: ${contact.alias}</span></span>
    <span class="contact-options" aria-hidden="true">${icon("moreVertical")}</span>
  </button>`;
}

function transferTemplate() {
  const filtered = contacts.filter((contact) => `${contact.name} ${contact.alias} ${contact.bank}`.toLowerCase().includes(state.search.toLowerCase()));
  const suggested = filtered.filter((contact) => !contact.recent);
  const recent = filtered.filter((contact) => contact.recent);
  return `<section class="view flow-view transfer-view">
    ${toolbar()}
    <div class="transfer-heading">
      <h1 class="flow-title">Transferir</h1>
      <div class="currency-switch"><span class="active">ARS $</span><span>USD</span></div>
    </div>
    <label class="search-field">${icon("search")}<input id="recipient-search" type="search" autocomplete="off" placeholder="Alias, CBU/CVU, celular o nombre" value="${escapeHTML(state.search)}" aria-label="Buscar destinatario">${icon("camera")}</label>
    ${suggested.length ? `<h2 class="list-label">Sugeridos</h2><div class="contact-list">${suggested.map(contactRow).join("")}</div>` : ""}
    ${recent.length ? `<h2 class="list-label">Recientes</h2><div class="contact-list">${recent.map(contactRow).join("")}</div>` : ""}
    ${!filtered.length ? `<div class="empty-state">No encontramos coincidencias. Probá con otro nombre o alias.</div>` : ""}
  </section>`;
}

function accountTemplate() {
  const recipient = state.recipient;
  return `<section class="view flow-view account-view">
    <div class="flow-toolbar"><button class="icon-button back-button" data-action="back" aria-label="Volver">${icon("arrowLeft")}</button></div>
    <h1 class="flow-title">Elegí la cuenta</h1>
    <div class="account-recipient"><strong>${recipient.name}</strong><span>CUIT: 20-22710277-3</span></div>
    <div class="account-list">
      ${destinationAccounts.map((account) => `<button class="account-row" data-action="select-account" data-id="${account.id}"><span class="account-mark">${account.mark}</span><span class="account-copy"><strong>${account.name}</strong><span>${account.institution} · ${account.detail}</span></span>${icon("chevron", "chevron")}</button>`).join("")}
    </div>
  </section>`;
}

function amountTemplate() {
  const amount = currentAmount();
  const quickAmounts = [5900, 10000, 11150];
  const keypadKeys = [
    ["1", ""], ["2", "ABC"], ["3", "DEF"],
    ["4", "GHI"], ["5", "JKL"], ["6", "MNO"],
    ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"],
    [",", ""], ["0", ""], ["backspace", ""],
  ];
  return `<section class="view flow-view amount-view">
    <div class="flow-toolbar"><button class="icon-button back-button" data-action="back" aria-label="Volver">${icon("arrowLeft")}</button><span></span></div>
    <div class="amount-heading"><h1 class="flow-title">Ingresá el monto</h1></div>
    <div class="amount-recipient">
      <span class="amount-recipient-avatar"><img src="logo-libre-bank.png" alt=""></span>
      <div class="amount-recipient-copy"><strong>${state.recipient.name}</strong><span>Alias: ${state.recipient.alias}</span><button class="inline-action" data-action="toast" data-message="Motivo: Varios">Motivo: Varios ${icon("arrowRight")}</button></div>
    </div>
    <div class="amount-display ${state.amountDigits ? "" : "is-placeholder"}" aria-live="polite"><span class="amount-currency">$</span><span class="amount-number">${amountDisplay()}</span><span class="amount-caret"></span></div>
    <div class="available-balance"><span>Disponible: <strong>${state.showBalance ? `$ ${money(sourceAccounts[state.sourceAccount].balance)}` : "••••••"}</strong></span><button class="balance-visibility" data-action="toggle-balance" aria-label="${state.showBalance ? "Ocultar" : "Mostrar"} saldo">${icon(state.showBalance ? "eye" : "eyeOff")}</button></div>
    <div class="quick-amounts">${quickAmounts.map((value) => `<button class="quick-amount ${amount === value ? "active" : ""}" data-action="quick-amount" data-value="${value}">$ ${value.toLocaleString("es-AR")}</button>`).join("")}</div>
    <button class="primary-button amount-continue" data-action="continue" ${amount <= 0 || amount > sourceAccounts[state.sourceAccount].balance ? "disabled" : ""} >Continuar</button>
    
  </section>
  <div class="keypad" role="group" aria-label="Teclado numérico">
    <div class="keypad-grid">${keypadKeys.map(([key, letters]) => key === "backspace"
      ? `<button class="keypad-key utility" data-action="key" data-key="backspace" aria-label="Borrar último dígito">${icon("backspace")}</button>`
      : `<button class="keypad-key ${key === "," ? "utility" : ""}" data-action="key" data-key="${key}">${key}${letters ? `<small>${letters}</small>` : ""}</button>`).join("")}</div>
  </div>`;
}

function reviewTemplate() {
  const recipient = state.recipient;
  const amount = currentAmount();
  return `<section class="view flow-view review-view">
    <div class="flow-toolbar review-toolbar"><button class="icon-button back-button" data-action="back" aria-label="Volver">${icon("arrowLeft")}</button></div>
    <div class="review-recipient">
      <span class="review-recipient-logo"><img src="logo-libre-bank.png" alt=""></span>
      <div><strong>${recipient.name}</strong><span>Alias: ${recipient.alias}</span></div>
    </div>
    <div class="review-summary-spacer" aria-hidden="true"></div>
    <div class="total-card"><span>Total</span><strong>$ ${money(amount, amount % 1 ? 2 : 0)}</strong></div>
    <div class="source-carousel">
      ${sourceAccounts.map((source, index) => `<button class="source-card ${index === state.sourceAccount ? "selected" : ""} ${index ? "secondary-source" : ""}" data-action="source-account" data-index="${index}" aria-label="Seleccionar ${source.name}, saldo ${state.showBalance ? `$ ${money(source.balance)}` : "oculto"}" aria-pressed="${index === state.sourceAccount}">
        <span class="source-card-top"><span class="source-card-logo"><img src="logo-libre-bank.png" alt=""></span><span class="source-card-balance">${state.showBalance ? `$ ${money(source.balance)}` : "••••••"}${icon(state.showBalance ? "eye" : "eyeOff")}</span></span>
        <span class="source-card-watermark" aria-hidden="true"><span>MERCADO</span><span>PAGO</span></span>
        <span class="source-card-chip">DINERO DISPONIBLE</span>
        <span class="source-card-footer">Sin comisión</span>
      </button>`).join("")}
    </div>
    <div class="source-pagination" aria-hidden="true">${sourceAccounts.map((source, index) => `<span class="source-pagination-dot ${index === state.sourceAccount ? "active" : ""}"></span>`).join("")}</div>
    <button class="primary-button review-continue" data-action="confirm">Transferir</button>
  </section>`;
}

function successTemplate() {
  const recipient = state.recipient;
  const amount = currentAmount();
  return `<section class="view success-view">
    <div class="success-close"><button class="icon-button" data-action="home" aria-label="Cerrar">${icon("close")}</button></div>
    <div class="success-content">
      <div class="success-mark">${icon("check")}</div>
      <h1>Transferiste $ ${money(amount, amount % 1 ? 2 : 0)}</h1>
      <div class="success-details">
        <span class="success-recipient-logo"><img src="logo-libre-bank.png" alt=""></span>
        <div><strong>${recipient.name}</strong><span>Alias: ${recipient.alias}</span><span>${state.destinationAccount.name}</span></div>
      </div>
      ${state.successPromoDismissed ? "" : `<aside class="success-promo">
        <div class="success-promo-copy">
          <span class="success-promo-label">Seguro de Cuenta</span>
          <p>Recuperá tu dinero si se dañan o te roban tus compras con Mercado Pago</p>
          <button class="success-promo-link" data-action="toast" data-message="Información educativa sobre Seguro de Cuenta.">Conocer ${icon("arrowRight")}</button>
        </div>
        <div class="success-promo-art" aria-hidden="true"><span class="success-shield">${icon("check")}</span></div>
        <button class="success-promo-close" data-action="dismiss-success-promo" aria-label="Cerrar promoción">${icon("close")}</button>
      </aside>`}
    </div>
    <div class="success-spacer"></div>
    <div class="success-actions">
      <button class="primary-button" data-action="receipt">${icon("share")} Compartir comprobante</button>
      <button class="secondary-button" data-action="new-transfer">Hacer otra transferencia</button>
    </div>
  </section>`;
}

function loadingTemplate() {
  return `<section class="view loading-view" aria-label="Cargando"><div class="flow-toolbar"><span class="skeleton" style="width:43px;height:43px;border-radius:14px"></span><span class="skeleton" style="width:82px;height:35px"></span></div><div class="skeleton skeleton-line" style="width:52%;height:25px;margin-top:15px"></div><div class="skeleton skeleton-line" style="width:78%;margin-top:10px"></div><div class="skeleton skeleton-block" style="margin-top:28px"></div><div class="skeleton skeleton-block"></div><div class="skeleton skeleton-block"></div><div class="loading-spinner" role="status" aria-label="Preparando"></div></section>`;
}

function secondaryTemplate(page) {
  const config = {
    learn: { title: "Aprender", subtitle: "Contenido breve para tomar mejores decisiones." },
    progress: { title: "Tu progreso", subtitle: "Un recorrido a tu ritmo, paso a paso." },
    more: { title: "Más opciones", subtitle: "Tu espacio personal de Libre Bank." },
  }[page];
  const cards = page === "progress"
    ? `<article class="lesson-card"><span class="eyebrow">68% completado</span><h3>Finanzas personales</h3><p>Cuatro de seis unidades completadas. Tu siguiente tema es ahorro y objetivos.</p></article><article class="lesson-card"><span class="eyebrow">Objetivo semanal</span><h3>Dos sesiones de aprendizaje</h3><p>Ya completaste una. Te queda una para cerrar la semana.</p></article>`
    : page === "more"
      ? `<article class="lesson-card"><span class="lesson-number">01</span><h3>Perfil de aprendizaje</h3><p>Preferencias, datos de demostración y configuración.</p></article><article class="lesson-card"><span class="lesson-number">02</span><h3>Seguridad y privacidad</h3><p>Buenas prácticas para cuidar tus cuentas y tus datos.</p></article>`
      : `<article class="lesson-card"><span class="lesson-number">01</span><h3>Presupuesto mensual</h3><p>Aprendé a separar gastos fijos, variables y objetivos.</p><button class="text-link" data-action="lesson" data-lesson="gastos">Abrir unidad ${icon("arrowRight")}</button></article><article class="lesson-card"><span class="lesson-number">02</span><h3>Hábitos de ahorro</h3><p>Convertí un objetivo grande en pasos posibles de sostener.</p><button class="text-link" data-action="lesson" data-lesson="ahorro">Abrir unidad ${icon("arrowRight")}</button></article><article class="lesson-card"><span class="lesson-number">03</span><h3>Seguridad digital</h3><p>Identificá mensajes engañosos y protegé tus accesos.</p><button class="text-link" data-action="lesson" data-lesson="seguridad">Abrir unidad ${icon("arrowRight")}</button></article>`;
  return `<section class="view with-nav simple-page">${brandLockup()}<span class="eyebrow">Libre Bank</span><h1>${config.title}</h1><p class="flow-description">${config.subtitle}</p>${cards}${bottomNav()}</section>`;
}

function lessonTemplate(lessonId) {
  const lessons = {
    gastos: ["Ordená tus gastos", "Separá primero los compromisos fijos, después los gastos variables y, por último, el dinero destinado a objetivos. El registro sirve para detectar patrones, no para juzgar cada compra."],
    ahorro: ["Construí una meta posible", "Definí para qué estás ahorrando, cuánto necesitás y en qué plazo. Dividir el objetivo en aportes pequeños hace más fácil medir el avance."],
    seguridad: ["Cuidá tus datos", "No compartas contraseñas ni códigos de verificación. Desconfiá de mensajes urgentes que pidan entrar a enlaces o instalar aplicaciones."],
  };
  const [title, content] = lessons[lessonId] || lessons.gastos;
  return `<section class="view simple-page">${toolbar()}<span class="eyebrow">Microlección · 5 minutos</span><h1>${title}</h1><article class="lesson-card"><p>${content}</p></article><div style="margin-top:22px"><button class="primary-button" data-action="lesson-done">Marcar como leída ${icon("check")}</button></div></section>`;
}

function render({ keepFocus = false } = {}) {
  const templates = {
    home: homeTemplate,
    transfer: transferTemplate,
    account: accountTemplate,
    amount: amountTemplate,
    review: reviewTemplate,
    success: successTemplate,
    loading: loadingTemplate,
    learn: () => secondaryTemplate("learn"),
    progress: () => secondaryTemplate("progress"),
    more: () => secondaryTemplate("more"),
  };
  root.innerHTML = state.screen.startsWith("lesson:")
    ? lessonTemplate(state.screen.split(":")[1])
    : (templates[state.screen] || homeTemplate)();
  const view = $(".view", root);
  if (view && state.direction === "back") view.classList.add("is-back");
  if (state.screen === "review") {
    const selectedSource = $(".source-card.selected", root);
    if (selectedSource) selectedSource.scrollIntoView({ block: "nearest", inline: "center" });
  }
  if (state.screen === "transfer" && keepFocus) {
    const input = $("#recipient-search", root);
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }
}

function navigate(screen, { replace = false, direction = "forward" } = {}) {
  if (!replace && state.screen !== screen) state.history.push(state.screen);
  state.direction = direction;
  state.screen = screen;
  render();
}

function goBack() {
  const previous = state.history.pop() || "home";
  state.direction = "back";
  state.screen = previous;
  render();
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function startRecipientSelection(id) {
  state.recipient = contacts.find((contact) => contact.id === id) || contacts[0];
  state.search = "";
  navigate("loading");
  // Pausa breve para representar la consulta de cuentas sin simular una red real.
  setTimeout(() => navigate("account", { replace: true }), 520);
}

function startAmountScreen(id) {
  state.destinationAccount = destinationAccounts.find((account) => account.id === id) || destinationAccounts[0];
  state.amountDigits = "";
  state.sourceAccount = 0;
  navigate("amount");
}

function appendKey(key) {
  const digits = state.amountDigits;
  if (key === "backspace") {
    state.amountDigits = digits.slice(0, -1);
  } else if (key === ",") {
    if (!digits.includes(",")) state.amountDigits = `${digits || "0"},`;
  } else if (/^\d$/.test(key)) {
    const [integer, decimal] = digits.split(",");
    if (decimal !== undefined) {
      if (decimal.length < 2) state.amountDigits = `${integer},${decimal}${key}`;
    } else if (digits.length < 9) {
      state.amountDigits = `${digits}${key}`.replace(/^0+(?=\d)/, "");
    }
  }
  updateAmountScreen();
}

function showReview() {
  if (currentAmount() <= 0) return;
  if (currentAmount() > sourceAccounts[state.sourceAccount].balance) {
    showToast("El importe supera el saldo disponible de práctica.");
    return;
  }
  navigate("loading");
  setTimeout(() => navigate("review", { replace: true }), 480);
}

function confirmPractice() {
  if (state.processing) return;
  state.processing = true;
  state.successPromoDismissed = false;
  const button = $("[data-action='confirm']", root);
  if (button) {
    button.disabled = true;
    button.textContent = "Transfiriendo";
  }
  setTimeout(() => {
    state.processing = false;
    navigate("success", { replace: true });
  }, 920);
}

function openNavigation(tab) {
  state.activeTab = tab;
  state.history = [];
  state.direction = "forward";
  state.screen = tab;
  render();
}

root.addEventListener("input", (event) => {
  if (event.target.id === "recipient-search") {
    const start = event.target.selectionStart;
    state.search = event.target.value;
    render();
    const updated = $("#recipient-search", root);
    if (updated) { updated.focus(); updated.setSelectionRange(start, start); }
  }
});

root.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case "start-practice":
      state.activeTab = "home";
      state.search = "";
      navigate("transfer");
      break;
    case "nav":
      openNavigation(target.dataset.tab);
      break;
    case "learn":
      openNavigation("learn");
      break;
    case "profile":
      openNavigation("more");
      break;
    case "search":
      state.activeTab = "home";
      state.search = "";
      navigate("transfer");
      break;
    case "notifications":
      showToast("No tenés novedades por ahora.");
      break;
    case "currency":
      state.currency = target.dataset.currency;
      render();
      break;
    case "toggle-balance":
      state.showBalance = !state.showBalance;
      render();
      break;
    case "select-recipient":
      startRecipientSelection(target.dataset.id);
      break;
    case "select-account":
      startAmountScreen(target.dataset.id);
      break;
    case "key":
      appendKey(target.dataset.key);
      break;
    case "quick-amount":
      state.amountDigits = String(target.dataset.value);
      updateAmountScreen();
      break;
    case "continue":
      showReview();
      break;
    case "source-account":
      state.sourceAccount = Number(target.dataset.index);
      render();
      break;
    case "confirm":
      confirmPractice();
      break;
    case "back":
      goBack();
      break;
    case "home":
      state.history = [];
      state.activeTab = "home";
      navigate("home", { replace: true, direction: "back" });
      break;
    case "new-transfer":
      state.history = [];
      state.activeTab = "home";
      state.search = "";
      state.recipient = null;
      state.destinationAccount = null;
      state.amountDigits = "";
      state.sourceAccount = 0;
      navigate("transfer", { replace: true });
      break;
    case "dismiss-success-promo":
      state.successPromoDismissed = true;
      render();
      break;
    case "receipt": {
      const text = `Libre Bank · Resumen educativo\nImporte simulado: $ ${money(currentAmount(), currentAmount() % 1 ? 2 : 0)}\nDestino: ${state.recipient.name}\nOrigen: ${sourceAccounts[state.sourceAccount].name}\nNo se movió dinero real.`;
      if (typeof navigator.share === "function") {
        try {
          await navigator.share({ title: "Comprobante educativo", text });
          showToast("Comprobante compartido.");
          break;
        } catch (error) {
          if (error && error.name === "AbortError") break;
        }
      }
      try {
        await navigator.clipboard.writeText(text);
        showToast("Resumen copiado.");
      } catch {
        showToast("No se pudo compartir ni copiar el comprobante.");
      }
      break;
    }
    case "lesson":
      navigate(`lesson:${target.dataset.lesson}`);
      break;
    case "lesson-done":
      state.history = ["learn"];
      state.screen = "learn";
      state.direction = "back";
      render();
      showToast("Lección marcada como leída.");
      break;
    case "toast":
      showToast(target.dataset.message || "Opción demostrativa.");
      break;
  }
});

// Navegación inicial: toda la experiencia se ejecuta en el navegador.
render();
