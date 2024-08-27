"use client";

import { useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { isDatePickerOpenAtom } from "~/@atom/ProjectStates/isDatePickerOpenAtom";
import { useTasksOfProject } from "~/hooks/useTasksOfProject";
import { showToast } from "~/utils/functions/showToast";
import FormSelectInput from "../../forms/FormSelectInput";
import { CustomDateRangePicker } from "../../widgets/CustomDateRangePicker";
import ToggleSwitch from "../../widgets/ToggleSwitch";
import { ProjectProfileHeader } from "../ProjectProfileHeader";
import { CloseCalendarContainer } from "./CloseCalendarContainer";
import { Container,MainContainer,FormContainer } from "./styles"
import { type Task } from "~/app/types/clickUpApi";
import { v4 as uuidv4 } from "uuid";
import { rowsAndSelectedValuesAtom } from "~/@atom/ProjectStates/rowsAndSelectedValuesAtom";
import { rangesAtom } from "~/@atom/ProjectStates/rangesAtom";

export function ProjectDetailsContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const router = useRouter();
  const [isDatePickerOpen] = useAtom(isDatePickerOpenAtom);
  const { tasksOfProject, isFetchAllCustomFields, missingFields } =
    useTasksOfProject();
  const [rowsAndSelectedValues, setRowsAndSelectedValues] = useAtom(
    rowsAndSelectedValuesAtom
  );
  const [, setRanges] = useAtom(rangesAtom);
  const [isInitialized, setIsInitialized] = useState(false);
  const canInitializeRowsAndRanges =
    !projectId &&
    rowsAndSelectedValues.rows.length === 0 &&
    isFetchAllCustomFields;

  const initializeRowsAndRanges = useCallback(() => {
    if (canInitializeRowsAndRanges) {
      const rowKey = uuidv4();
      const newRow = `row-${rowKey}`;

      setRowsAndSelectedValues((prevState) => ({
        ...prevState,
        rows: [...prevState.rows, newRow],
        selectedValues: {
          ...prevState.selectedValues,
          [`firstTextValue${newRow}-text`]: "",
          [`secondTextValue${newRow}-text`]: "",
          [`thirdTextValue${newRow}-text`]: "",
        },
      }));

      setRanges((prevState) => ({
        ...prevState,
        [newRow]: {
          startDate: undefined,
          endDate: undefined,
          key: `selection-row-${rowKey}`,
          isSelected: false,
        },
      }));
    }
  }, [canInitializeRowsAndRanges, setRowsAndSelectedValues, setRanges]);

  const updateRowsAndSelectedValues = useCallback(
    (tasksOfProject: Task[]) => {
      const newRows: string[] = [];
      const newSelectedValues: Record<string, any> = {};
      const newRanges: Record<string, any> = {};
      let chargeName = "";
      const rowKey = uuidv4();
      const newRow = `row-${rowKey}`;

      tasksOfProject.forEach((task) => {
        const chargeField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_cargos"
        );
        const hoursPMonthField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_Horas_Mes"
        );
        const workValueField = task.custom_fields.find(
          (field) => field.name === "PixelCraft_Valor"
        );

        const taskStartDate = task.start_date
          ? new Date(parseInt(task.start_date))
          : new Date();
        const taskDueDate = task.due_date
          ? new Date(parseInt(task.due_date))
          : new Date();

        const chargeOptions = chargeField?.type_config?.options;
        const chargeValue = chargeField?.value;

        if (chargeOptions && chargeValue) {
          const option = chargeOptions.find((opt) =>
            chargeValue.includes(opt.id)
          );
          chargeName = option ? option.name : "";
        }

        const cargoValue = chargeField ? `${chargeField.value}` : "";
        const horasValue = hoursPMonthField ? `${hoursPMonthField.value}` : "";
        const valorValue = workValueField ? `${workValueField.value}` : "";

        newRows.push(newRow);

        newSelectedValues[`firstTextValue${newRow}-text`] = chargeName;
        newSelectedValues[`firstTextValue${newRow}-option`] = cargoValue;
        newSelectedValues[`secondTextValue${newRow}-text`] = horasValue;
        newSelectedValues[`thirdTextValue${newRow}-text`] = valorValue;

        newRanges[newRow] = {
          endDate: taskDueDate,
          isSelected: true,
          key: `selection-row-${rowKey}`,
          startDate: taskStartDate,
        };
      });

      setRowsAndSelectedValues((prevState) => ({
        ...prevState,
        rows: [...prevState.rows, ...newRows],
        selectedValues: {
          ...prevState.selectedValues,
          ...newSelectedValues,
        },
      }));

      setRanges((prevState) => ({
        ...prevState,
        ...newRanges,
      }));
    },
    [setRowsAndSelectedValues, setRanges]
  );

  useEffect(() => {
    if (missingFields) {
      showToast(
        "error",
        "Erro ao carregar projeto",
        `${missingFields} não existem na lista.`
      );
      router.push("/painel-administrativo/projetos");
    }
  }, [missingFields, router]);

  useEffect(() => {
    if (!isInitialized && isFetchAllCustomFields) {
      initializeRowsAndRanges();
      setIsInitialized(true);
    }
  }, [isInitialized, isFetchAllCustomFields, initializeRowsAndRanges]);

  useEffect(() => {
    if (projectId && tasksOfProject) {
      updateRowsAndSelectedValues(tasksOfProject);
    }
  }, [projectId, tasksOfProject, updateRowsAndSelectedValues]);

  return (
    <Container>
      {isFetchAllCustomFields && (
        <>
          <ProjectProfileHeader />
          <MainContainer>
            {isDatePickerOpen && <CustomDateRangePicker />}
            <FormContainer isDatePickerOpen={isDatePickerOpen}>
              <ToggleSwitch />
              <FormSelectInput />
            </FormContainer>
          </MainContainer>
          <CloseCalendarContainer />
        </>
      )}
    </Container>
  );
}