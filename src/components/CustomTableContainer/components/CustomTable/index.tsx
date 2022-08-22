import React from "react";
import i18n from "@dhis2/d2-i18n";
import { Tag } from "@dhis2/ui";
import { SelectionDimension } from "../../../DataSelectionContainer/interfaces";
import { useDuplicateBeneficiaries } from "../../../../hooks/duplicateBeneficiaries";

export default function CustomTable(
  selectionDimension: SelectionDimension
): React.ReactElement {
  const { data, loading, error } = useDuplicateBeneficiaries(
    selectionDimension?.program?.id ?? "",
    selectionDimension?.orgUnit?.orgUnits ?? []
  );

  return (
    <div>
      <Tag
        children={`${selectionDimension.program?.displayName} ${i18n.t(
          "Duplicate Beneficiaries in"
        )} ${selectionDimension.orgUnit?.orgUnits
          ?.map((ou: any) => ou.displayName)
          .join(", ")}`}
        maxWidth="90%"
      />

      {loading && <div>loading</div>}
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
