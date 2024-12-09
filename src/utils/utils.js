import api, { route } from "@forge/api";
import { invoke } from "@forge/bridge";

// confirming whether the amount of rows validate the maximum amount of rows
export const validateMaxRowAmount = (maxCurrencyCalculationRows, min, max) => {
  if (maxCurrencyCalculationRows < min) return min;
  if (maxCurrencyCalculationRows > max) return max;
  return maxCurrencyCalculationRows;
};

// requesting the configuration of the current custom field context from jira using jira api with the parameter "fieldId"
export const requestJira = async (fieldId) => {
  let transformedResponseJson;
  const response = await invoke("getCustomFieldContext", fieldId);
  if (!response.isSuccess) {
    console.log(response.responseData);
    console.error("Server Data fetching Error");
    return response.responseData;
  }

  transformedResponseJson = response.responseData;
  console.log("Transformed Response Data ", transformedResponseJson);
  return transformedResponseJson;
};

export const setOutcomeProps = (index, targetObject) => {
  const outcome = {};
  for (let i = 1; i <= index; i++) {
    if (
      targetObject[`prop${i}`] &&
      targetObject[`prop${i}`].amount &&
      targetObject[`prop${i}`].currency
    ) {
      outcome[`prop${i}`] = {
        amount: +targetObject[`prop${i}`].amount,
        currency:
          targetObject[`prop${i}`].currency.value ||
          targetObject[`prop${i}`].currency,
      };
    }
  }
  outcome[`currencySummary`] = {
    currency: targetObject[`currencySummary`],
    amount: 0,
  };
  return outcome;
};

export const currencyConversion = (fieldValue, currencyExchangeCourses) => {
  const fieldValueArray = formValueObjectTransform(fieldValue).slice(0, -1);

  const fieldValueAmountSumm = fieldValueArray.reduce(
    (accumulator, currentValue) => {
      const { amount, currency } = currentValue;
      const filteredCurrencyExchangeCourse = findChoosenCurrency(
        currency,
        currencyExchangeCourses
      );
      return (accumulator +=
        amount / filteredCurrencyExchangeCourse.exchangeValue);
    },
    0
  );

  const USDSumm = USDtoUserChoiceConversion(
    fieldValueAmountSumm,
    fieldValue.currencySummary.currency,
    currencyExchangeCourses
  );
  fieldValue.currencySummary.amount = USDSumm.toFixed(2);

  return fieldValue;
};

export const formValueObjectTransform = (formValues) => {
  return Object.values(formValues);
};

const findChoosenCurrency = (selectItemLabel, currencyExchangeCourses) =>
  currencyExchangeCourses.find((element) => element.label === selectItemLabel);

const USDtoUserChoiceConversion = (
  amount,
  userSummaryDisplayCurrency,
  currencyExchangeCourses
) => {
  const exchangeRate = findChoosenCurrency(
    userSummaryDisplayCurrency,
    currencyExchangeCourses
  );
  return amount * exchangeRate.exchangeValue;
};
