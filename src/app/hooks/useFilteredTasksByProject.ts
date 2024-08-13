import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { loadingAtom } from "~/@atom/LoadingState/loadingAtom";
import { EndPointClickUpApiEnum } from "~/clickUpApi/EndPointClickUpApiEnum";
import { api } from "~/trpc/react";
import { type CustomField, type Task } from "../types/clickUpApi";
import { type ProjectOptionType } from "~/server/types/Clickup.type";

type FetchResponseType = {
  customFieldData?: CustomField[];
  tasksData?: Task[];
};

type FilteredTasksByProject = {
  project: ProjectOptionType;
  tasks: Task[] | undefined;
  dates:
    | {
        minStartDate: number | null;
        maxEndDate: number | null;
      }
    | undefined;
};

export function useFilteredTasksByProject() {
  const [filteredTasksByProject, setFilteredTasksByProject] =
    useState<FilteredTasksByProject[]>();
  const [, setLoading] = useAtom(loadingAtom);
  const [isNocustomFieldProject, setIsNocustomFieldProject] =
    useState<boolean>(false);

  const getTasks = api.clickup.getTasks.useQuery({
    endPoint: EndPointClickUpApiEnum.enum.task,
  });

  const getCustomField = api.clickup.getCustomFields.useQuery({
    endPoint: EndPointClickUpApiEnum.enum.field,
  });
  const customFieldData = getCustomField.data;
  const tasksData = getTasks.data;

  const handleFetchResponse = useCallback(
    function handleFetchResponse({
      customFieldData,
      tasksData,
    }: FetchResponseType) {
      setLoading(true);
      const isNoDatas =
        !customFieldData ||
        customFieldData.length === 0 ||
        !tasksData ||
        tasksData.length === 0;

      if (isNoDatas) {
        return {
          filteredTasksByProject: [],
        };
      }
      const projectCustomField = customFieldData?.find(
        (field: CustomField) => field.name === "PixelCraft_projeto"
      );

      if (!projectCustomField) {
        setIsNocustomFieldProject(true);
        setLoading(false);
        return { filteredTasksByProject: [] };
      }

      const projectOptionsResp = projectCustomField?.type_config.options || [];

      const projectsWithTasks = projectOptionsResp?.filter(
        (project: ProjectOptionType) =>
          tasksData?.some((task) =>
            task.custom_fields.some(
              (field) =>
                Array.isArray(field.value) && field.value.includes(project.id)
            )
          )
      );

      const filteredTasksByProject = projectsWithTasks?.map((project) => {
        const tasksForProject = tasksData?.filter((task) =>
          task.custom_fields.some((field) => {
            if (Array.isArray(field.value)) {
              return field.value.includes(project.id);
            }
            return false;
          })
        );

        const dates = tasksForProject?.reduce(
          (acc, task) => {
            const startDate = task.start_date
              ? parseInt(task.start_date)
              : null;
            const endDate = task.due_date ? parseInt(task.due_date) : null;

            if (
              startDate &&
              (!acc.minStartDate || startDate < acc.minStartDate)
            ) {
              acc.minStartDate = startDate;
            }
            if (endDate && (!acc.maxEndDate || endDate > acc.maxEndDate)) {
              acc.maxEndDate = endDate;
            }

            return acc;
          },
          {
            minStartDate: null as number | null,
            maxEndDate: null as number | null,
          }
        );

        return { project, tasks: tasksForProject, dates };
      });

      setFilteredTasksByProject(filteredTasksByProject);
      setLoading(false);
    },
    [setLoading]
  );

  const fetch = useCallback(async () => {
    handleFetchResponse({ customFieldData, tasksData });
  }, [customFieldData, handleFetchResponse, tasksData]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    filteredTasksByProject,
    isNocustomFieldProject,
  };
}
