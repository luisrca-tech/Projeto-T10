"use client";

import FormSelectInput from "@/app/components/FormSelectInput";
import {
  Container,
  InputsData,
  InputsDataContainer,
  SwitchContainer,
} from "./styles";
import { ProjectProfileHeader } from "@/app/components/ProjectProfileHeader";
import { roboto } from "@/app/fonts";
import { useState } from "react";
import ToggleSwitch from "@/app/components/ToggleSwitch";
import CustomDatePicker from "@/app/components/DateRangePicker";

export default function Projeto() {
  const [checked, setChecked] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <Container className={roboto.className}>
      <ProjectProfileHeader
        checked={checked}
        value="Nome do Projeto..."
        toggleDatePicker={toggleDatePicker}
      />

      {isDatePickerOpen && <CustomDatePicker />}
      <SwitchContainer>
        <span>Editar datas</span>
        <ToggleSwitch onChange={handleChange} />
      </SwitchContainer>
      <FormSelectInput checked={checked} />
    </Container>
  );
}
