"use client";

import { Container, CustomFormSelect, Option } from "./styles";
import React, { type ChangeEvent, useState } from "react";
import ArrowRight from "/public/images/arrowright.svg";
import ArrowDown from "/public/images/arrowdown.svg";
import Image, { type StaticImageData } from "next/image";

interface SelectComponentProps {
  id: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  hasValue: boolean;
}

export function SelectComponent({
  id,
  value,
  onChange,
  hasValue,
}: SelectComponentProps) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  function handleImageClick() {
    setIsSelectOpen(!isSelectOpen);
  }

  return (
    <Container>
      <CustomFormSelect
        onClick={handleImageClick}
        value={value}
        onChange={onChange}
        id={id}
      >
        <Option>Front-end</Option>
        <Option>Back-end</Option>
        <Option selected hidden></Option>
      </CustomFormSelect>
      <div style={{ display: !isSelectOpen && hasValue ? "none" : "block" }}>
        {isSelectOpen ? (
          <Image
            src={ArrowDown as StaticImageData}
            alt="Seta para baixo (aberto)"
          />
        ) : (
          <Image
            src={ArrowRight as StaticImageData}
            alt="Seta para direita (fechado)"
          />
        )}
      </div>
    </Container>
  );
}