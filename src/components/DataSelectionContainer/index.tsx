import React from "react";
import { Card, Box } from "@dhis2/ui";
import DataSelection from "./components/DataSelection";
import classes from "./DataSelectionContainer.module.css";

export default function DataSelectionContainer(): React.ReactElement {
  return (
    <div className={classes["container"]}>
      <Box>
        <Card>
          <div className={classes["selection-container-contents"]}>
            <div className={classes["selection-item"]}>
              <DataSelection
                onSelectionChange={() => console.log("Selecting Ou")}
                label="Select Organisation Unit"
              />
            </div>
            <div className={classes["selection-item"]}>
              <DataSelection
                onSelectionChange={() => console.log("Selecting Period")}
                label="Select Period"
                value="This Month"
              />
            </div>
          </div>
        </Card>
      </Box>
    </div>
  );
}
