import React from "react";
import i18n from "@dhis2/d2-i18n";
import {
  TableBody,
  TableHead,
  Pagination,
  ButtonStrip,
  Button,
  DataTable,
  DataTableRow,
  DataTableColumnHeader,
  DataTableCell,
} from "@dhis2/ui";
import { keys, values, capitalize, map, camelCase, chunk } from "lodash";

import classes from "./CustomTable.module.css";

export default function CustomTable({
  data,
  tableTitle,
  page,
  pageSize,
  totalPages,
  onChangePage,
  onChangePageSize,
  onDownloadData,
}: {
  data: any[];
  tableTitle: string;
  page: number;
  pageSize: number;
  totalPages: number;
  onChangePage: (page: number) => void;
  onChangePageSize: (page: number) => void;
  onDownloadData: () => void;
}): React.ReactElement {
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

  return (
    <>
      <div className={classes["table-actions"]}>
        <ButtonStrip end>
          <Button
            name="Data download button"
            onClick={() => onDownloadData()}
            value="default"
          >
            {i18n.t("Download")}
          </Button>
        </ButtonStrip>
      </div>
      <div className={classes["table-container"]}>
        <DataTable>
          <TableHead className={classes["table-head"]}>
            <DataTableRow>
              {getTableHeaders(data).map((header: string) => (
                <DataTableColumnHeader
                  className={classes["table-value"]}
                  dataTest={`${getHeaderKey(header)}-column`}
                  key={`${getHeaderKey(header)}-column-header`}
                >
                  {header}
                </DataTableColumnHeader>
              ))}
            </DataTableRow>
          </TableHead>
          <TableBody className={classes["table-body"]}>
            {getTableDataRows(data).map((dataRow, index) => (
              <DataTableRow
                className={classes["table-row"]}
                key={`row-${index}`}
              >
                {dataRow.map((tableDataItem, index) => (
                  <DataTableCell
                    className={classes["table-value"]}
                    key={`row-${index}-cell-${index}`}
                  >
                    {tableDataItem}
                  </DataTableCell>
                ))}
              </DataTableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
      <div style={{ width: "100%", marginTop: "8px" }}>
        <Pagination
          onPageChange={(pageNumber: number) => onChangePage(pageNumber)}
          onPageSizeChange={(size: number) => onChangePageSize(size)}
          page={page}
          pageCount={totalPages}
          pageSize={pageSize}
          total={data.length}
        />
      </div>
    </>
  );
}
