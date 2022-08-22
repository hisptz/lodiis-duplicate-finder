import React from "react";
import i18n from "@dhis2/d2-i18n";
import { Tag } from "@dhis2/ui";
import { SelectionDimension } from "../DataSelectionContainer/interfaces";
import classes from "./CustomTableContainer.module.css";

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
            <Tag maxWidth="90%">
              {selectionDimension.program.displayName}{" "}
              {i18n.t("Duplicate Beneficiaries in")}{" "}
              {selectionDimension.orgUnit.orgUnits
                ?.map((ou) => ou.displayName)
                .join(", ")}
            </Tag>
          </div>
        </div>
      ) : (
        <div>{i18n.t("Select Program and Organisation unit above")}</div>
      )}
    </div>
  );
}
