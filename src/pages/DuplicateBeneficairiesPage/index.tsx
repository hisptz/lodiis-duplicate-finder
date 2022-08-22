import React, { useState } from "react";
import CustomTableContainer from "../../components/CustomTableContainer";
import DataSelectionContainer from "../../components/DataSelectionContainer";
import { SelectionDimension } from "../../components/DataSelectionContainer/interfaces";
import classes from "./DuplicateBeneficiariesPage.module.css";

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
