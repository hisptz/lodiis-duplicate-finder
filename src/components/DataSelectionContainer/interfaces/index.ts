import { OrgUnitSelection } from "@hisptz/dhis2-utils";

export interface DataSelectionProps {
  onChangeSelection: () => void;
  label: string;
  value?: string;
}

export interface DataSelectionContainerProps {
  onChangeSelection: (selection?: SelectionDimension) => void;
  selections?: SelectionDimension;
}

export interface SelectionDimension {
  orgUnit?: OrgUnitSelection;
  periods?: any[];
}
