import React, { useState, useEffect } from "react";
import { DEFAULT_CONTEXT_CONFIG, DEFAULT_CONFIGURATION } from "../data/data";
import {
  CustomFieldContextConfig,
  Head,
  TextField,
  useProductContext,
} from "@forge/ui";
import { validateMaxRowAmount } from "../utils/utils";
const ContextConfig = () => {
  const {
    extensionContext: { configuration = { ...DEFAULT_CONTEXT_CONFIG } },
  } = useProductContext();

  const {
    maxRowsAmounts: { min, max },
  } = DEFAULT_CONFIGURATION;

  const onSubmit = (formData) => {
    console.log(formData);
    formData.maxCurrencyCalculationRows = validateMaxRowAmount(
      +formData.maxCurrencyCalculationRows,
      min,
      max
    );
    const formDataCurrencyExchangeCourses =
      configuration.currencyExchangeCourses.map((e) => ({
        label: e.label,
        exchangeValue: +formData[e.label],
      }));

    return {
      configuration: {
        provision: +formData.provision,
        maxCurrencyCalculationRows: +formData.maxCurrencyCalculationRows,
        currencyExchangeCourses: formDataCurrencyExchangeCourses,
      },
    };
  };
  return (
    <CustomFieldContextConfig>
      <TextField
        type="number"
        name="provision"
        label="Bank Provision (%)"
        defaultValue={configuration.provision}
      />
      <TextField
        type="number"
        name="maxCurrencyCalculationRows"
        label="Maximum amount of Currency"
      />
      <Table>
        <Head>
          <Cell>
            <Text>Value compared to USD</Text>
          </Cell>
        </Head>
        {configuration.currencyExchangeCourses.map((e) => (
          <Row>
            <Cell>
              <TextField
                name={e.label}
                label={e.label}
                placeholder={e.currencyValue}
                defaultValue={e.exchangeValue}
              />
            </Cell>
          </Row>
        ))}
      </Table>
    </CustomFieldContextConfig>
  );
};

export default ContextConfig;
