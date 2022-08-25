import React, { useState } from "react";
import CustomTableContainer from "./components/DuplicateBeneficiariesContainer";
import DataSelectionContainer from "./components/DataSelectionContainer";
import { SelectionDimension } from "./components/DataSelectionContainer/interfaces";

export function DuplicateBeneficiariesPage(): React.ReactElement {
  const [dataSelection, setDataSelection] = useState<
    SelectionDimension | undefined
  >();
  return (
    <>
      <DataSelectionContainer
        selections={dataSelection}
        onChangeSelection={(selections) => setDataSelection(selections)}
      />
      <CustomTableContainer {...dataSelection} />
    </>
  );
}
