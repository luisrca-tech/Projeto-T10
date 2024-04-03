"use client";

import React, { useEffect, useState } from "react";
import Creatable from "react-select/creatable";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import ArrowRight from "../../../../public/arrowright.svg";
import ArrowDown from "../../../../public/arrowdown.svg";
import Image from "next/image";
import { Container, customStyles } from "./styles";
import {
  OptionType,
  SelectInputProps,
  SelectInputTextProps,
  SelectInputTextSchema,
} from "./SelectUtils";
import { roboto } from "@/app/fonts";

export function SelectInputWithDropdown({
  placeholder,
  type,
  options,
  hasPrefix,
}: SelectInputProps & SelectInputTextProps) {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [customOptions, setCustomOptions] = useState(options);

  const { register } = useForm<SelectInputProps & SelectInputTextProps>({
    resolver: zodResolver(SelectInputTextSchema),
  });

  // // Carrega as opções salvas do localStorage ao montar o componente
  // useEffect(() => {
  //   const savedOptions = localStorage.getItem("customOptions");
  //   if (savedOptions) {
  //     setCustomOptions(JSON.parse(savedOptions));
  //   }
  // }, []);

  const handleChangeMenu = (newIsOpen: boolean) => {
    setIsMenuOpen(newIsOpen);
  };

  const handleChange = (selectedOption: OptionType | null) => {
    if (!selectedOption) return;

    setSelectedOptions([selectedOption]);
  };

  const handleInputChange = (newValue: string, actionMeta: any) => {
    if (type === "number" && isNaN(Number(newValue))) {
      return ""; // Limpa o valor se não for número
    } else if (type === "text" && !isNaN(Number(newValue))) {
      return ""; // Limpa o valor se for número e o tipo for texto
    }

    setInputValue(newValue);
    return newValue;
  };

  const customCreateLabel = (inputValue: string) => `Criar ${inputValue}`;

  const handleAddNewOption = (inputValue: string) => {
    let newOption: OptionType;

    if (placeholder === "Horas" && hasPrefix) {
      newOption = { value: inputValue, label: `${inputValue}h` };
    } else if (placeholder === "Valor" && hasPrefix) {
      newOption = { value: inputValue, label: `R$ ${inputValue},00` };
    } else {
      newOption = { value: inputValue, label: inputValue };
    }

    setInputValue(inputValue);

    setCustomOptions((prevOptions) => [...prevOptions, newOption]);

    setSelectedOptions([newOption]);

    // // Salvando a nova opção em localStorage
    // const savedOptions = localStorage.getItem("customOptions");
    // const options = savedOptions ? JSON.parse(savedOptions) : [];
    // const updatedOptions = [...options, newOption];
    // localStorage.setItem("customOptions", JSON.stringify(updatedOptions));
  };

  return (
    <Container className={roboto.className}>
      <Creatable
        className={roboto.className}
        {...register("query")}
        value={selectedOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={customOptions}
        onCreateOption={handleAddNewOption}
        placeholder={placeholder}
        styles={customStyles}
        menuIsOpen={isMenuOpen}
        isClearable={false}
        formatCreateLabel={customCreateLabel}
        onMenuOpen={() => handleChangeMenu(true)}
        onMenuClose={() => handleChangeMenu(false)}
        components={{
          DropdownIndicator: ({ selectProps }) => (
            <div>
              {selectProps.menuIsOpen ? (
                <Image
                  src={ArrowDown}
                  alt=""
                  style={{
                    margin: "0 0.5rem",
                  }}
                />
              ) : (
                <Image
                  src={ArrowRight}
                  alt=""
                  style={{
                    margin: "0 0.5rem",
                  }}
                />
              )}
            </div>
          ),
        }}
        noOptionsMessage={() => "Nenhuma opção disponível"}
      />
    </Container>
  );
}
