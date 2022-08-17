import { OrganisationUnit, OrgUnitSelection } from "@hisptz/dhis2-utils";
import { truncate, map } from "lodash";

export class DataSelectionHelpers {
  static getPeriodStringLabel(periodSelection: any[]): string {
    var label = "";
    if (periodSelection) {
      var periodNames: string[] = map(periodSelection, (pe: any) => {
        var periodName =
          pe.type == "RANGE"
            ? `${pe.startDate ?? ""} to  ${pe.endDate ?? ""}`
            : (pe.name as string) ?? "";
        return periodName;
      });
      label = periodNames.join(", ");
    }
    return truncate(label, { length: 40 });
  }

  static getOrgUnitStringLabel(orgUnitSelection: OrgUnitSelection): string {
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
}
