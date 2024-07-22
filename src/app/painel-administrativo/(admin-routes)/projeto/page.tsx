"use client";

import { useSearchParams } from "next/navigation";
import {
  CloseCalendarContainer,
  Container,
  FormContainer,
  MainContainer,
  SwitchContainer,
} from "./styles";
import { useAtom } from "jotai";
import { useEffect, useCallback } from "react";
import { checkedAtom } from "~/@atom/ProjectStates/checkedAtom";
import { isDatePickerOpenAtom } from "~/@atom/ProjectStates/isDatePickerOpenAtom";
import { stringRowAtom } from "~/@atom/ProjectStates/stringRowAtom";
import { rowsAndSelectedValuesAtom } from "~/@atom/ProjectStates/rowsAndSelectedValuesAtom";
import { rangesAtom } from "~/@atom/ProjectStates/rangesAtom";
import useClickUpFetch from "~/hooks/useClickUpFetch";
import { EndPointClickUpApiEnum } from "~/clickUpApi/EndPointClickUpApiEnum";
import { type Task } from "~/server/types/Clickup.type";
import { roboto } from "~/assets/fonts/fonts";
import Header from "~/components/surfaces/header";
import { ProjectProfileHeader } from "~/components/surfaces/ProjectProfileHeader";
import { CustomDateRangePicker } from "~/components/widgets/CustomDateRangePicker";
import ToogleSwitch from "~/components/widgets/ToggleSwitch";
import FormSelectInput from "~/components/forms/FormSelectInput";

type FieldsIdType = {
  chargeFieldId: string;
  projectFieldId: string;
  valueFieldId: string;
  hoursPerMonthCustomFieldId: string;
};

export default function Projeto() {
  const [checked, setChecked] = useAtom(checkedAtom);
  const [isDatePickerOpen, setIsDatePickerOpen] = useAtom(isDatePickerOpenAtom);
  const [, setStringRow] = useAtom(stringRowAtom);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const [, setRowsAndSelectedValues] = useAtom(rowsAndSelectedValuesAtom);
  const [, setRanges] = useAtom(rangesAtom);

  function openDatePicker() {
    setIsDatePickerOpen(true);
  }

  function inputDataMenuClick(row: string) {
    openDatePicker();
    setStringRow(row);
  }

  const handleCheckedChange = () => {
    setChecked(!checked);
  };

  const handleBlurCalendar = () => {
    setIsDatePickerOpen(false);
  };

  const { projectOptions, isFetchAllCustomFields } = useClickUpFetch(
    EndPointClickUpApiEnum.FIELD
  );

  const { data: getTaskResp } = useClickUpFetch<Task[]>(
    EndPointClickUpApiEnum.TASK
  );

  const updateRowsAndSelectedValues = useCallback(
    (tasksForProject: Task[]) => {
      let count = 0;
      tasksForProject.forEach((task, index) => {
        count = index;

        const cargoField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_cargos"
        );
        const horasField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_Horas_Mes"
        );
        const valorField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_Valor"
        );
        const taskStartDate = task.start_date
          ? new Date(parseInt(task.start_date))
          : new Date();
        const taskDueDate = task.due_date
          ? new Date(parseInt(task.due_date))
          : new Date();

        console.log(taskStartDate, `taskStartDate`);
        console.log(taskDueDate, `taskDueDate`);

        let cargoName = "";
        if (cargoField && Array.isArray(cargoField.type_config?.options)) {
          const option = cargoField.type_config.options.find(
            (opt) => opt.id === cargoField.value
          );
          cargoName = option ? option.name : "";
        }

        const cargoValue = cargoField ? `${cargoField.value}` : "";
        const horasValue = horasField ? `${horasField.value}` : "";
        const valorValue = valorField ? `${valorField.value}` : "";

        console.log(cargoName, `cargoName`);
        console.log(cargoValue, `cargoValue`);
        console.log(horasValue, `horasValue`);
        console.log(valorValue, `valorValue`);

        setRowsAndSelectedValues((prevState) => ({
          ...prevState,
          rows: [...prevState.rows, `row-${count}`],
          selectedValues: {
            ...prevState.selectedValues,
            [`firstTextValuerow-${count}-text`]: cargoName,
            [`firstTextValuerow-${count}-option`]: cargoValue,
            [`secondTextValuerow-${count}-text`]: horasValue,
            [`thirdTextValuerow-${count}-text`]: valorValue,
          },
        }));

        setRanges((prevState) => ({
          ...prevState,
          [`row-${count}`]: {
            endDate: taskDueDate,
            isSelected: true,
            key: `selection-row-${count}`,
            startDate: taskStartDate,
          },
        }));
      });

      const nextRow = `row-${count + 1}`;
      setRowsAndSelectedValues((prevState) => ({
        ...prevState,
        rows: [...prevState.rows, nextRow],
      }));
      setRanges((prevState) => ({
        ...prevState,
        [nextRow]: {
          endDate: undefined,
          isSelected: false,
          key: `selection-row-${nextRow}`,
          startDate: undefined,
        },
      }));
    },
    [setRanges, setRowsAndSelectedValues]
  );

  useEffect(() => {
    if (projectId && getTaskResp) {
      const tasksForProject = getTaskResp.filter((task) =>
        task.custom_fields.some((field) => {
          if (Array.isArray(field.value)) {
            return field.value.includes(projectId);
          }
          return false;
        })
      );
      console.log(tasksForProject, "tasksForProject");
      if (tasksForProject.length > 0) {
        updateRowsAndSelectedValues(tasksForProject);
      }
    }
  }, [projectId, getTaskResp, updateRowsAndSelectedValues]);

  return (
    <Container className={roboto.className}>
      <Header />
      {isFetchAllCustomFields && (
        <>
          <ProjectProfileHeader inputDataMenuClick={inputDataMenuClick} />

          <MainContainer>
            {isDatePickerOpen && <CustomDateRangePicker />}
            <FormContainer isDatePickerOpen={isDatePickerOpen}>
              <SwitchContainer>
                <span>Editar datas</span>
                <ToogleSwitch onChange={handleCheckedChange} />
              </SwitchContainer>
              <FormSelectInput inputDataMenuClick={inputDataMenuClick} />
            </FormContainer>
          </MainContainer>

          <CloseCalendarContainer
            isDatePickerOpen={isDatePickerOpen}
            onClick={handleBlurCalendar}
          ></CloseCalendarContainer>
        </>
      )}
    </Container>
  );
}
