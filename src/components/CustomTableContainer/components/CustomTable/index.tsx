import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import {
  Tag,
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  CircularLoader,
  NoticeBox,
  Pagination,
} from "@dhis2/ui";
import { keys, values, capitalize, map, camelCase, chunk } from "lodash";

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

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const getTotalPages = (customSize?: number) =>
    Math.ceil((data ?? []).length / (customSize ?? pageSize));

  const getPaginatedData = (): any[] => {
    let currentPage = page;
    const totalPages = getTotalPages();

    if (totalPages < currentPage) {
      currentPage = (data ?? []).length;
    } else if (totalPages < 1) {
      currentPage = 1;
    }
    return chunk(data, pageSize)[page - 1];
  };

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
          <>
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
                  {getTableDataRows(getPaginatedData()).map(
                    (dataRow, index) => (
                      <TableRow key={`row-${index}`}>
                        {dataRow.map((tableDataItem, index) => (
                          <TableCell key={`row-${index}-cell-${index}`}>
                            {tableDataItem}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </div>
            <div style={{ width: "100%", marginTop: "8px" }}>
              <Pagination
                onPageChange={(pageNumber: number) => setPage(pageNumber)}
                onPageSizeChange={(size: number) => {
                  if (getTotalPages(size) < page) {
                    setPage(1);
                  }
                  setPageSize(size);
                }}
                page={page}
                pageCount={getTotalPages()}
                pageSize={pageSize}
                total={data.length}
              />
            </div>
          </>
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
