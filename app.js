// Configuración y Datos Demo
const config = {
    spinnerDelay: 1500 // Tiempo simulado de carga en ms
};

let appState = {
    currentBalance: 422767.64, // Enzo's base balance
    transferFlowBalance: 422967.64, // Zaira flow start balance
    selectedRecipientName: 'Zaira Abril Mudry',
    currentAmount: 0
};

// Referencias DOM
const screens = document.querySelectorAll('.screen');
const spinner = document.getElementById('spinner-overlay');
const homeBalanceDisplay = document.getElementById('home-balance-value');
const amountAvailableDisplay = document.getElementById('available-balance-value');
const amountValueDisplay = document.getElementById('amount-value');
const btnAmountContinue = document.getElementById('btn-amount-continue');
const paymentAvailableDisplay = document.getElementById('payment-available-value');
const currentAmountDisplays = document.querySelectorAll('.current-amount-value');

// Funciones de utilidad
const formatCurrency = (amount) => {
    return amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const showSpinner = (callback) => {
    spinner.classList.add('active');
    setTimeout(() => {
        spinner.classList.remove('active');
        if (callback) callback();
    }, config.spinnerDelay);
};

const setActiveScreen = (screenId) => {
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
};

// Lógica de Flujo

// Inicio
const startTransferFlow = () => {
    showSpinner(() => setActiveScreen('screen-contacts'));
};

// Selección de Contacto
const selectRecipient = (name, avatarText, alias) => {
    // En este demo, siempre seleccionamos Zaira para el flujo coherente
    appState.selectedRecipientName = name;
    showSpinner(() => {
        setActiveScreen('screen-amount');
        updateAmountScreenUI();
    });
};

// Pantalla de Monto
const updateAmountScreenUI = () => {
    amountAvailableDisplay.innerText = formatCurrency(appState.transferFlowBalance);
    amountValueDisplay.innerText = "0";
    appState.currentAmount = 0;
    btnAmountContinue.classList.add('btn-disabled');
};

const setQuickAmount = (amount) => {
    appState.currentAmount = amount;
    amountValueDisplay.innerText = formatCurrency(amount);
    btnAmountContinue.classList.remove('btn-disabled');
    // Simple haptic feedback simulation
    if ('vibrate' in navigator) navigator.vibrate(20);
};

const goToPaymentMethod = () => {
    showSpinner(() => {
        setActiveScreen('screen-payment-method');
        updatePaymentScreenUI();
    });
};

// Pantalla de Pago
const updatePaymentScreenUI = () => {
    paymentAvailableDisplay.innerText = formatCurrency(appState.transferFlowBalance);
    currentAmountDisplays.forEach(d => d.innerText = formatCurrency(appState.currentAmount));
};

const confirmPayment = () => {
    showSpinner(() => setActiveScreen('screen-success'));
};

// Pantalla de Éxito
const resetApp = () => {
    // Actualizamos el saldo base de Enzo para la home
    appState.currentBalance = appState.transferFlowBalance - appState.currentAmount;
    if (homeBalanceDisplay) {
        homeBalanceDisplay.innerText = formatCurrency(appState.currentBalance);
    }
    // reset current amount so next flow starts clean
    appState.currentAmount = 0;

    showSpinner(() => goToContacts());
};

// Navegación Básica
const goHome = () => setActiveScreen('screen-home');
const goToContacts = () => setActiveScreen('screen-contacts');
const goToAmount = () => setActiveScreen('screen-amount');

// Inicialización
// Exponer funciones para handlers inline (onclick="...")
window.startTransferFlow = startTransferFlow;
window.selectRecipient = selectRecipient;
window.setQuickAmount = setQuickAmount;
window.goToPaymentMethod = goToPaymentMethod;
window.confirmPayment = confirmPayment;
window.resetApp = resetApp;
window.goHome = goHome;
window.goToContacts = goToContacts;
window.goToAmount = goToAmount;

// Inicialización
goHome();
