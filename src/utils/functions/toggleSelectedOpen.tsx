import { useAtom } from "jotai";
import { selectedItemIndexAtom } from "~/@atom/ProjectStates/selectedItemIndexAtom";

export function useToggleSelectOpen(index: string) {
  const [selectedItemIndex, setSelectedItemIndex] = useAtom(
    selectedItemIndexAtom
  );

  return () => {
    setSelectedItemIndex(selectedItemIndex === index ? null : index);
  };
}