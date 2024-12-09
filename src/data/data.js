export const DEFAULT_CONFIGURATION = {
  tableHeaders: ["Amount", "Currency", "Delete row"],
  maxRowsAmounts: {
    min: 1,
    max: 5,
  },
  currencyPlaceholder: "Please provide cash amount",
};

export const DEFAULT_CONTEXT_CONFIG = {
  provision: 0,
  maxCurrencyCalculationRows: 5,
  currencyExchangeCourses: [
    {
      label: "USD",
      exchangeValue: 1,
    },
    {
      label: "EUR",
      exchangeValue: 0.84,
    },
    {
      label: "GBP",
      exchangeValue: 0.72,
    },
    {
      label: "PLN",
      exchangeValue: 3.86,
    },
    {
      label: "CHF",
      exchangeValue: 0.91,
    },
  ],
};

export const DEFAULT_FIELD_VALUE = {
  prop1: {
    amount: 0,
    currency: "PLN",
  },
  currencySummary: {
    amount: 0,
    currency: "PLN",
  },
};
