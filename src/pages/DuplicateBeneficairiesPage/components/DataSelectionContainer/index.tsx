import React, { useState } from "react";
import { Card, Box } from "@dhis2/ui";
import DataSelection from "./components/DataSelection";
import classes from "./DataSelectionContainer.module.css";
import { DataSelectionContainerProps, Program } from "./interfaces";
import { OrgUnitSelectorModal } from "@hisptz/react-ui";
import { isEmpty } from "lodash";
import { OrgUnitSelection } from "@hisptz/dhis2-utils";
import ProgramSelection from "./components/ProgramSelection";
import { getOrgUnitStringLabel } from "../../helpers/dataSelectionsHelpers";

const orgUnitModalProps: Record<string, any> = {
  searchable: true,
};

export default function DataSelectionContainer({
  onChangeSelection,
  selections,
}: DataSelectionContainerProps): React.ReactElement {
  const [ModalOpen, setModalOpen] = useState<string | undefined>();
  const { orgUnit: orgUnitSelection, program: programSelection } =
    selections ?? {};

  const onCloseModal = () => setModalOpen(undefined);

  const onModalSelectionChange =
    (setter: (value: any) => any) => (value: any) => {
      setter(value);
      onCloseModal();
    };

  const onProgramChange = (program: Program) => {
    if (!isEmpty(program)) {
      onChangeSelection({ ...selections, program });
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
                  onChangeSelection={() => onDataSelectionChange("program")}
                  label="Select Program"
                  value={selections?.program?.displayName ?? ""}
                />
              </div>
              <div className={classes["selection-item"]}>
                <DataSelection
                  onChangeSelection={() => onDataSelectionChange("orgUnit")}
                  label="Select Organisation Unit"
                  value={getOrgUnitStringLabel(selections?.orgUnit ?? {})}
                />
              </div>
            </div>
          </Card>
        </Box>
      </div>

      {/* Selection modals */}
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
      {ModalOpen === "program" && (
        <ProgramSelection
          position="middle"
          value={programSelection?.id}
          onClose={onCloseModal}
          hide={ModalOpen !== "program"}
          onUpdate={onModalSelectionChange(onProgramChange)}
        />
      )}
    </div>
  );
}
