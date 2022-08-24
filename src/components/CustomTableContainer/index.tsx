import React from "react";
import i18n from "@dhis2/d2-i18n";

import { SelectionDimension } from "../DataSelectionContainer/interfaces";
import classes from "./CustomTableContainer.module.css";
import CustomTable from "./components/CustomTable";

export default function CustomTableContainer(
  selectionDimension: SelectionDimension | undefined
): React.ReactElement {
  return (
    <div className={classes["container"]}>
      {selectionDimension &&
      selectionDimension.orgUnit &&
      selectionDimension.program ? (
        <div>
          <div className={classes["center"]}>
            <CustomTable {...selectionDimension}></CustomTable>
          </div>
        </div>
      ) : (
        <div className={classes["center"]}>
          {i18n.t(
            "Select Program and Organisation unit above to evaluate duplicates"
          )}
        </div>
      )}
    </div>
  );
}
