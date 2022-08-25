import React from "react";
import { Chip } from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import { DataSelectionProps } from "../../interfaces";
import classes from "./DataSelection.module.css";

export default function DataSelection({
  value,
  label,
  onChangeSelection,
}: DataSelectionProps): React.ReactElement {
  return (
    <div className={classes["selection-container"]}>
      <div className={classes["selection-label"]}>{i18n.t(label)}</div>
      <div
        onClick={onChangeSelection}
        className={classes["selection-value-container"]}
      >
        <div className={classes["column"]}></div>
        <div className={classes["selection-value"]}>
          {value ? <Chip>{value}</Chip> : <span></span>}
        </div>
      </div>
    </div>
  );
}
