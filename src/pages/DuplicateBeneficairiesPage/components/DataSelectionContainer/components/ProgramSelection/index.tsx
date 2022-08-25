import React, { useState } from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Button,
  CircularLoader,
  Cover,
  Center,
  Radio,
} from "@dhis2/ui";
import { find } from "lodash";
import { PROGRAMS_QUERY } from "../../../../../../constants/queries.constants";
import { Program } from "../../interfaces";

const getSelectedProgram = (
  programId: string | undefined,
  programs: Program[]
): Program | null | undefined => {
  return programId
    ? find(programs, (program: Program) => program.id == programId)
    : null;
};

export default function ProgramSelection({
  hide,
  onClose,
  value,
  onUpdate,
  ...props
}: {
  value?: string;
  onUpdate: (value: Program | null | undefined) => void;
  hide: boolean;
  onClose: () => void;
  [key: string]: any;
}): React.ReactElement {
  const [selectedProgram, setSelectedProgram] = useState(value);
  const { loading, error, data } = useDataQuery(PROGRAMS_QUERY);

  const onSelectProgram = (id: string) => setSelectedProgram(id);

  return (
    <Modal hide={hide} onClose={onClose} {...props}>
      <ModalTitle>{i18n.t("Select Program")}</ModalTitle>
      <ModalContent>
        {loading && (
          <Cover>
            <Center>
              <CircularLoader small />
            </Center>
          </Cover>
        )}
        {error && <span>{`ERROR: ${error.message}`}</span>}
        {data && (
          <div>
            {((data?.programsQuery as any).programs ?? []).map(
              (program: any) => (
                <div key={program.id}>
                  <Radio
                    checked={selectedProgram == program.id}
                    label={program.displayName}
                    name={program.id}
                    onChange={() => {
                      onSelectProgram(program.id);
                    }}
                    value={program.id}
                  />
                </div>
              )
            )}
          </div>
        )}
      </ModalContent>
      <ModalActions>
        <ButtonStrip end>
          <Button onClick={() => onClose()} secondary>
            Cancel
          </Button>
          <Button
            onClick={() =>
              onUpdate(
                getSelectedProgram(
                  selectedProgram,
                  (data?.programsQuery as any).programs ?? []
                )
              )
            }
            primary
          >
            Update
          </Button>
        </ButtonStrip>
      </ModalActions>
    </Modal>
  );
}
