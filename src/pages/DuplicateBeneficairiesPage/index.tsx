import React from "react";
import CustomTableContainer from "../../components/CustomTableContainer";
import DataSelectionContainer from "../../components/DataSelectionContainer";
import classes from "./DuplicateBeneficiariesPage.module.css";

export function DuplicateBeneficiariesPage(): React.ReactElement {
  return (
    <>
      <DataSelectionContainer
        onChangeSelection={() => console.log("selection changed")}
      />
      <CustomTableContainer />
    </>
  );
}
