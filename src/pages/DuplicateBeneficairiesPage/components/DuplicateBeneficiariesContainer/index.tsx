import React from "react";
import i18n from "@dhis2/d2-i18n";

import { SelectionDimension } from "../DataSelectionContainer/interfaces";
import TableContainer from "./components/TableContainer";
import classes from "./DuplicateBeneficiariesContainer.module.css";

export default function DuplicateBeneficiariesContainer(
  selectionDimension: SelectionDimension | undefined
): React.ReactElement {
  return (
    <div className={classes["container"]}>
      {selectionDimension &&
      selectionDimension.orgUnit &&
      selectionDimension.program ? (
        <div>
          <div className={classes["center"]}>
            <TableContainer {...selectionDimension}></TableContainer>
          </div>
        </div>
      ) : (
        <div className={classes["message"]}>
          {i18n.t(
            "Select Program and Organisation unit above to evaluate duplicates"
          )}
        </div>
      )}
    </div>
  );
}
