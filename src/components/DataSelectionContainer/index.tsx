import React, { useState } from "react";
import { Card, Box } from "@dhis2/ui";
import DataSelection from "./components/DataSelection";
import classes from "./DataSelectionContainer.module.css";
import { DataSelectionContainerProps } from "./interfaces";
import { OrgUnitSelectorModal, PeriodSelectorModal } from "@hisptz/react-ui";
import { isEmpty } from "lodash";
import { OrgUnitSelection } from "@hisptz/dhis2-utils";
import { DataSelectionHelpers } from "../../pages/helpers/DataSelectionHelpers";

const orgUnitModalProps: Record<string, any> = {
  searchable: true,
};
const periodModalProps: Record<string, any> = {
  singleSelection: true,
  enableDateRange: true,
  excludeRelativePeriods: true,
  excludedPeriodTypes: ["Weekly"],
};

export default function DataSelectionContainer({
  onChangeSelection,
  selections,
}: DataSelectionContainerProps): React.ReactElement {
  const [ModalOpen, setModalOpen] = useState<string | undefined>();
  const { orgUnit: orgUnitSelection, periods: periodSelection } =
    selections ?? {};

  const onCloseModal = () => setModalOpen(undefined);

  const onModalSelectionChange =
    (setter: (value: any) => any) => (value: any) => {
      setter(value);
      onCloseModal();
    };

  const onPeriodChange = (period: any) => {
    if (!isEmpty(period)) {
      onChangeSelection({ ...selections, periods: period });
    }
  };

  const onOrgUnitChange = (orgUnit: OrgUnitSelection) => {
    if (!isEmpty(orgUnit.orgUnits)) {
      onChangeSelection({ ...selections, orgUnit });
    }
  };

  const onDataSelectionChange = (selection: string) => setModalOpen(selection);

  return (
    <div>
      <div className={classes["container"]}>
        <Box>
          <Card>
            <div className={classes["selection-container-contents"]}>
              <div className={classes["selection-item"]}>
                <DataSelection
                  onChangeSelection={() => onDataSelectionChange("orgUnit")}
                  label="Select Organisation Unit"
                  value={DataSelectionHelpers.getOrgUnitStringLabel(
                    selections?.orgUnit ?? {}
                  )}
                />
              </div>
              <div className={classes["selection-item"]}>
                <DataSelection
                  onChangeSelection={() => onDataSelectionChange("period")}
                  label="Select Period"
                  value={DataSelectionHelpers.getPeriodStringLabel(
                    selections?.periods ?? []
                  )}
                />
              </div>
            </div>
          </Card>
        </Box>
      </div>

      {ModalOpen === "period" && (
        <PeriodSelectorModal
          {...periodModalProps}
          position="middle"
          selectedPeriods={periodSelection}
          onClose={onCloseModal}
          hide={ModalOpen !== "period"}
          onUpdate={onModalSelectionChange(onPeriodChange)}
        />
      )}
      {ModalOpen === "orgUnit" && (
        <OrgUnitSelectorModal
          {...orgUnitModalProps}
          position="middle"
          value={orgUnitSelection as any}
          onClose={onCloseModal}
          hide={ModalOpen !== "orgUnit"}
          onUpdate={onModalSelectionChange(onOrgUnitChange)}
        />
      )}
    </div>
  );
}
