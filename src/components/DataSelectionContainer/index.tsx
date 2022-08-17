import React from "react";
import i18n from "@dhis2/d2-i18n";
import DataSelection from "./components/DataSelection";

export default function DataSelectionContainer(): React.ReactElement {
  return (
    <div>
      <p>Data Selection Container</p>
      <div>
        <DataSelection />
      </div>
    </div>
  );
}
