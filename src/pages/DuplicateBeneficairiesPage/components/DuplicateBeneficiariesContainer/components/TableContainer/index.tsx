import React, { useState } from "react";
import i18n from "@dhis2/d2-i18n";
import { Tag, CircularLoader, NoticeBox } from "@dhis2/ui";
import { chunk } from "lodash";

import { SelectionDimension } from "../../../DataSelectionContainer/interfaces";
import { useDuplicateBeneficiaries } from "../../../../hooks/duplicateBeneficiaries";
import CustomTable from "../CustomTable";
import classes from "./TableContainer.module.css";

async function onDownload(data: any, fileName: string) {
  const excel = await import("xlsx");
  const workbook = excel.utils.book_new();
  const worksheet = excel.utils.json_to_sheet(data);
  excel.utils.book_append_sheet(workbook, worksheet, "Duplicate Beneficiaries");
  excel.writeFile(workbook, `${fileName}.xlsx`);
}

export default function TableContainer(
  selectionDimension: SelectionDimension
): React.ReactElement {
  const tableTitle = `${selectionDimension.program?.displayName} ${i18n.t(
    "Duplicate Beneficiaries in"
  )} ${selectionDimension.orgUnit?.orgUnits
    ?.map((ou: any) => ou.displayName)
    .join(", ")}`;

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

  const tableParams = {
    data: getPaginatedData(),
    tableTitle: tableTitle,
    page: page,
    pageSize: pageSize,
    totalPages: getTotalPages(),
    onChangePage: (pageNumber: number) => setPage(pageNumber),
    onChangePageSize: (size: number) => {
      if (getTotalPages(size) < page) {
        setPage(1);
      }
      setPageSize(size);
    },
    onDownloadData: () => onDownload(data, tableTitle),
  };

  return (
    <div className={classes["center"]}>
      <Tag children={tableTitle} maxWidth="90%" />
      <div
        style={{
          marginTop: "16px",
        }}
      >
        {loading == true ? (
          <>
            <div className="w-100">
              <div
                className={classes["centered-message"]}
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
          </>
        ) : data && data.length > 0 ? (
          <CustomTable {...tableParams}></CustomTable>
        ) : data && data.length == 0 ? (
          <div className={classes["centered-message"]}>
            {i18n.t("There are no duplicates found for the current selections")}
          </div>
        ) : error ? (
          <div style={{ textAlign: "start" }}>
            <NoticeBox error title={i18n.t("Failed to load beneficiaries")}>
              {error.toString()}
            </NoticeBox>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
