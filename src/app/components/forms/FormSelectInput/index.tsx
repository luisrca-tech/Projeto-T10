"use client";
import { useState } from "react";
import { Container, InputsDataContainer, Footer } from "./styles";

import { FormHeader } from "./components/FormHeader";
import RowAndScrollDownContainer from "./components/RowAndScrollDownContainer";
import {
  FormSelectInputProps,
  RowsAndSelectedValueProps,
} from "@/app/types/componentsTypes/type";
import { BudgetContainer } from "./components/FooterSumContainer";

export default function FormSelectInput({
  checked,
  setRanges,
  setRowCount,
  rowCount,
  setStringRow,
  ranges,
  inputDataMenuClick,
}: FormSelectInputProps) {
  const [rowsAndSelectedValues, setRowsAndSelectedValues] =
    useState<RowsAndSelectedValueProps>({
      rows: ["row-0"],
      selectedValues: {},
    });

  return (
    <Container>
      <FormHeader checked={checked} />

      <InputsDataContainer>
        {rowsAndSelectedValues.rows
          .slice()
          .reverse()
          .map((row) => (
            <RowAndScrollDownContainer
              row={row}
              setStringRow={setStringRow}
              key={row}
              rowCount={rowCount}
              ranges={ranges}
              checked={checked}
              setRanges={setRanges}
              setRowCount={setRowCount}
              rowsAndSelectedValues={rowsAndSelectedValues}
              setRowsAndSelectedValues={setRowsAndSelectedValues}
              inputDataMenuClick={inputDataMenuClick}
            />
          ))}
      </InputsDataContainer>
      <Footer>
        <BudgetContainer rowsAndSelectedValues={rowsAndSelectedValues} />
      </Footer>
    </Container>
  );
}