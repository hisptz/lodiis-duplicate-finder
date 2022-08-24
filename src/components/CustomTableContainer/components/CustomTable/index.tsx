import React from "react";
import i18n from "@dhis2/d2-i18n";
import {
  Tag,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
  CircularLoader,
  NoticeBox,
} from "@dhis2/ui";
import { keys, values, capitalize, map, camelCase } from "lodash";

import { SelectionDimension } from "../../../DataSelectionContainer/interfaces";
import { useDuplicateBeneficiaries } from "../../../../hooks/duplicateBeneficiaries";
import classes from "./CustomTable.module.css";

function getTableHeaders(data: any[]): string[] {
  return data.length > 0
    ? map(keys(data[0]), (header: string) => capitalize(header))
    : [];
}

function getTableDataRows(data: any[]): Array<String[]> {
  return map(data, (dataRow: any) => values(dataRow));
}

function getHeaderKey(header: string): string {
  return camelCase(header);
}

export default function CustomTable(
  selectionDimension: SelectionDimension
): React.ReactElement {
  const { data, loading, error, progressMessage, downloadProgress } =
    useDuplicateBeneficiaries(
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

      <div
        style={{
          marginTop: "16px",
        }}
      >
        {loading == true ? (
          <>
            <div>
              <div className="w-100">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <div>
                    <CircularLoader small />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    {progressMessage && (
                      <span>
                        {progressMessage}{" "}
                        {downloadProgress && downloadProgress > 0 && (
                          <span>{downloadProgress}%</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : data && data.length > 0 ? (
          <div className={classes["table-container"]}>
            <Table>
              <TableHead>
                <TableRowHead fixed>
                  {getTableHeaders(data).map((header: string) => (
                    <TableCellHead
                      className={classes["table-header"]}
                      dataTest={`${getHeaderKey(header)}-column`}
                      key={`${getHeaderKey(header)}-column-header`}
                    >
                      {header}
                    </TableCellHead>
                  ))}
                </TableRowHead>
              </TableHead>
              <TableBody>
                {getTableDataRows(data).map((dataRow, index) => (
                  <TableRow key={`row-${index}`}>
                    {dataRow.map((tableDataItem, index) => (
                      <TableCell key={`row-${index}-cell-${index}`}>
                        {tableDataItem}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : data && data.length == 0 ? (
          <div>
            {i18n.t("There are no duplicates found for the current selections")}
          </div>
        ) : error ? (
          <div className="w-100">
            <NoticeBox error title={i18n.t("Failed to load beneficiaries")}>
              {error}
            </NoticeBox>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
