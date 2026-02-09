// Tasas de cambio simuladas (en un caso real, se obtendrían de una API)
const exchangeRates = {
  USD: 1.0,
  EUR: 0.925,
  GBP: 0.792,
  JPY: 147.5,
  CAD: 1.358,
  AUD: 1.542,
  CHF: 0.885,
  CNY: 7.28,
  MXN: 17.25,
  BRL: 4.98,
  ARS: 350.5,
  COP: 3950.0,
  CLP: 890.0,
  PEN: 3.75,
};

// Banderas para cada moneda
const currencyFlags = {
  USD: "🇺🇸",
  EUR: "🇪🇺",
  GBP: "🇬🇧",
  JPY: "🇯🇵",
  CAD: "🇨🇦",
  AUD: "🇦🇺",
  CHF: "🇨🇭",
  CNY: "🇨🇳",
  MXN: "🇲🇽",
  BRL: "🇧🇷",
  ARS: "🇦🇷",
  COP: "🇨🇴",
  CLP: "🇨🇱",
  PEN: "🇵🇪",
};

// Nombres completos de las monedas
const currencyNames = {
  USD: "Dólar Estadounidense",
  EUR: "Euro",
  GBP: "Libra Esterlina",
  JPY: "Yen Japonés",
  CAD: "Dólar Canadiense",
  AUD: "Dólar Australiano",
  CHF: "Franco Suizo",
  CNY: "Yuan Chino",
  MXN: "Peso Mexicano",
  BRL: "Real Brasileño",
  ARS: "Peso Argentino",
  COP: "Peso Colombiano",
  CLP: "Peso Chileno",
  PEN: "Sol Peruano",
};

// Conversiones favoritas predefinidas
const favoriteConversions = [
  { from: "USD", to: "EUR" },
  { from: "EUR", to: "USD" },
  { from: "USD", to: "MXN" },
  { from: "EUR", to: "GBP" },
  { from: "USD", to: "JPY" },
  { from: "MXN", to: "USD" },
];

// Elementos del DOM
const amountInput = document.getElementById("amount");
const fromCurrencySelect = document.getElementById("from-currency");
const toCurrencySelect = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const fromCode = document.getElementById("from-code");
const toCode = document.getElementById("to-code");
const resultElement = document.getElementById("result");
const conversionDetails = document.getElementById("conversion-details");
const rateInfo = document.getElementById("rate-info");
const convertButton = document.getElementById("convert-button");
const resetButton = document.getElementById("reset-button");
const swapButton = document.getElementById("swap-button");
const favoritesGrid = document.getElementById("favorites-grid");
const lastUpdateElement = document.getElementById("last-update");

// Función para formatear números con separadores de miles
function formatNumber(number) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

// Función para convertir moneda
function convertCurrency() {
  const amount = parseFloat(amountInput.value) || 0;
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  // Obtener tasas de cambio
  const fromRate = exchangeRates[fromCurrency];
  const toRate = exchangeRates[toCurrency];

  // Realizar conversión
  const result = (amount / fromRate) * toRate;

  // Actualizar interfaz
  resultElement.textContent = `${formatNumber(result)} ${currencyFlags[toCurrency]}${toCurrency}`;
  conversionDetails.textContent = `${formatNumber(amount)} ${fromCurrency} = ${formatNumber(result)} ${toCurrency}`;

  // Actualizar información de tasa
  const rateFromTo = (1 / fromRate) * toRate;
  const rateToFrom = (1 / toRate) * fromRate;
  rateInfo.textContent = `1 ${fromCurrency} = ${formatNumber(rateFromTo)} ${toCurrency} | 1 ${toCurrency} = ${formatNumber(rateToFrom)} ${fromCurrency}`;

  // Actualizar banderas y códigos
  fromFlag.textContent = currencyFlags[fromCurrency];
  toFlag.textContent = currencyFlags[toCurrency];
  fromCode.textContent = fromCurrency;
  toCode.textContent = toCurrency;

  // Actualizar fecha de última actualización
  const now = new Date();
  lastUpdateElement.textContent = `Última actualización: Hoy a las ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  // Actualizar conversiones favoritas
  updateFavoriteConversions();
}

// Función para intercambiar monedas
function swapCurrencies() {
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  fromCurrencySelect.value = toCurrency;
  toCurrencySelect.value = fromCurrency;

  convertCurrency();
}

// Función para reiniciar valores
function resetConverter() {
  amountInput.value = "100";
  fromCurrencySelect.value = "USD";
  toCurrencySelect.value = "EUR";
  convertCurrency();
}

// Función para actualizar conversiones favoritas
function updateFavoriteConversions() {
  favoritesGrid.innerHTML = "";

  favoriteConversions.forEach((conversion) => {
    const fromCurrency = conversion.from;
    const toCurrency = conversion.to;

    // Calcular la tasa de conversión
    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const rate = (1 / fromRate) * toRate;

    // Crear elemento de conversión favorita
    const favoriteItem = document.createElement("div");
    favoriteItem.className = "favorite-item";
    favoriteItem.innerHTML = `
                <div class="favorite-flag">${currencyFlags[fromCurrency]} → ${currencyFlags[toCurrency]}</div>
                <div class="favorite-code">${fromCurrency} → ${toCurrency}</div>
                <div class="favorite-rate">1 ${fromCurrency} = ${formatNumber(rate)} ${toCurrency}</div>
            `;

    // Al hacer clic, establecer esta conversión
    favoriteItem.addEventListener("click", () => {
      fromCurrencySelect.value = fromCurrency;
      toCurrencySelect.value = toCurrency;
      convertCurrency();
    });

    favoritesGrid.appendChild(favoriteItem);
  });
}

// Event listeners
amountInput.addEventListener("input", convertCurrency);
fromCurrencySelect.addEventListener("change", convertCurrency);
toCurrencySelect.addEventListener("change", convertCurrency);
convertButton.addEventListener("click", convertCurrency);
resetButton.addEventListener("click", resetConverter);
swapButton.addEventListener("click", swapCurrencies);

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
  convertCurrency();

  // Simular actualización de tasas cada 30 segundos
  setInterval(() => {
    // En una aplicación real, aquí se haría una llamada a una API
    console.log("Actualizando tasas de cambio...");

    // Simular pequeñas variaciones en las tasas
    Object.keys(exchangeRates).forEach((currency) => {
      if (currency !== "USD") {
        // Variación aleatoria de +/- 0.5%
        const variation = (Math.random() - 0.5) * 0.01;
        exchangeRates[currency] *= 1 + variation;
      }
    });

    convertCurrency();
  }, 30000); // 30 segundos
});
