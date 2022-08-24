import { OrganisationUnit, OrgUnitSelection } from "@hisptz/dhis2-utils";
import { truncate, map } from "lodash";

export function getOrgUnitStringLabel(
  orgUnitSelection: OrgUnitSelection
): string {
  var label = "";
  const { orgUnits } = orgUnitSelection;
  if (orgUnits) {
    var ouNames: string[] = map(
      orgUnits,
      (ou: OrganisationUnit) => ou.displayName ?? ""
    );
    label = ouNames.join(", ");
  }
  return truncate(label, { length: 40 });
}
