import React, { useState, useCallback } from "react";
import ForgeReconciler, { Textfield } from "@forge/react";
import { CustomFieldEdit } from "@forge/react/jira";
import { view } from "@forge/bridge";
import {
  Button,
  Cell,
  Head,
  Option,
  Row,
  Select,
  Table,
  Text,
  TextField,
  useProductContext,
} from "@forge/ui";
import { requestJira } from "../utils/utils";
import {
  DEFAULT_CONFIGURATION,
  DEFAULT_CONTEXT_CONFIG,
  DEFAULT_FIELD_VALUE,
} from "../data/data";

const Edit = () => {
  // getting the field value from the currnet context environment
  const {
    extensionContext: { fieldValue, fieldId },
  } = useProductContext();

  // get the custom field context from the above field value result
  const [customFieldContext] = useState(requestJira(fieldId));
  const [arrayFields, setArrayFields] = useState(
    Object.values(fieldValue || DEFAULT_FIELD_VALUE).slice(0, -1)
  );
  let [{ configuration }] = customFieldContext;

  // check if there is a configuration or not
  if (!configuration) {
    configuration = DEFAULT_CONTEXT_CONFIG;
  }
  const { currencyExchangeCourses, maxCurrencyCalculationRows } = configuration;
  const currencies = currencyExchangeCourses.map((e) => e.label);

  const onSubmit = (formValue) => {
    const copy = JSON.parse(JSON.stringify(formValue));
    const outcome = setOutcomeProps(maxCurrencyCalculationRows, copy);
    const calculatedCurrency = currencyConversion(
      outcome,
      currencyExchangeCourses
    );
    return calculatedCurrency;
  };
  // adding a row to a table
  const addRow = () => {
    arrayFields.push({
      amount: undefined,
      currency: undefined,
    });
    setArrayFields(arrayFields);
  };

  const deleteRow = (index) => {
    let copy = arrayFields;
    copy.filter((arr, i) => i != index);
    setArrayFields(copy);
  };
  return (
    <CustomFieldEdit onSubmit={onSubmit}>
      <Text>
        Available fields: {arrayFields.length}/{maxCurrencyCalculationRows}
      </Text>
      <Button
        text="Add row"
        disabled={arrayFields.length >= maxCurrencyCalculationRows}
        onClick={() => addRow()}
      />

      <Table>
        <Head>
          {DEFAULT_CONFIGURATION.tableHeaders.map((e) => (
            <Cell>
              <Text>{e}</Text>
            </Cell>
          ))}
        </Head>
        {arrayFields.map((e, i) => (
          <Row>
            <Cell>
              <TextField
                isRequired={true}
                type="number"
                name={`prop${i + 1}.amount`}
                placeholder="Provide cash amount"
                defaultValue={e.amount}
              />
            </Cell>
            <Cell>
              <Select isRequired={true} name={`prop${i + 1}.currency`}>
                {currencies.map((element) => (
                  <Option
                    label={element}
                    value={element}
                    defaultSelected={element === e.currency}
                  />
                ))}
              </Select>
            </Cell>
            <Cell>
              <Button
                appearance="danger"
                text="Delete"
                onClick={() => deleteRow(i)}
              />
            </Cell>
          </Row>
        ))}
      </Table>

      <Select
        isRequired={true}
        label="Choose summary currency"
        name="currencySummary"
      >
        {currencies.map((e) => (
          <Option
            defaultSelected={userSummCurrency === e}
            label={e}
            value={e}
          />
        ))}
      </Select>
    </CustomFieldEdit>
  );
};

export default Edit;
