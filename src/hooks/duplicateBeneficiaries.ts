import { useDataEngine } from "@dhis2/app-runtime";
import { OrganisationUnit } from "@hisptz/dhis2-utils";
import { useEffect, useState } from "react";
import { map, flattenDeep } from "lodash";
import { mapLimit } from "async-es";
import i18n from "@dhis2/d2-i18n";

import {
  DUPLICATE_BENEFICIARIES_PAGES_QUERY,
  TRACKED_ENTITY_INSTANCE_QUERY,
} from "../constants";
import { TrackedEntityInstance } from "../interfaces";
import { teiPageSize } from "../constants/pagination.constants";
import {
  evaluateDuplicateBeneficiaries,
  getSanitizedBeneficiariesList,
} from "../helpers/duplicateBeneficiariesHelper";

export function useDuplicateBeneficiaries(
  programId: string,
  organisationUnits: OrganisationUnit[]
) {
  const [data, setData] = useState<any[] | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const engine = useDataEngine();
  const controller = new AbortController();

  var ou = map(
    organisationUnits,
    (organisationUnit: OrganisationUnit) => organisationUnit.id
  ).join(";");

  const getTrackedEntityInstancePages = (totalItems: number): number[] => {
    var pages: number[] = [];
    for (var page = 1; page <= Math.ceil(totalItems / teiPageSize); page++) {
      pages = [...pages, page];
    }
    return pages;
  };

  const getCurrentProgress = (
    totalItems: number,
    currentPage: number
  ): number =>
    Math.ceil(
      (currentPage / (Math.ceil(totalItems / teiPageSize) ?? (1 as number))) *
        100
    );

  const getTrackedEntityInstances = async (
    page: number
  ): Promise<TrackedEntityInstance[]> => {
    var trackedEntityInstances: TrackedEntityInstance[] = [];
    try {
      const data = await engine.query(TRACKED_ENTITY_INSTANCE_QUERY, {
        variables: {
          ou,
          program: programId,
          page,
        },
        signal: controller.signal,
      });
      trackedEntityInstances = data
        ? [
            ...trackedEntityInstances,
            ...((data?.query as any)
              .trackedEntityInstances as TrackedEntityInstance[]),
          ]
        : [];
    } catch (error) {
      setError(error);
    }

    return trackedEntityInstances;
  };

  const resetBeneficiaryList = () => {
    setLoading(false);
    setDownloadProgress(null);
    setProgressMessage(null);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setData(null);
      var duplicateTrackedEntityInstances: any[] = [];
      try {
        setProgressMessage(i18n.t("Discovering online beneficiaries..."));
        await engine
          .query(DUPLICATE_BENEFICIARIES_PAGES_QUERY, {
            variables: {
              program: programId,
              ou,
            },
          })
          .then(
            async (data: any) => {
              setProgressMessage(i18n.t("Downloading online beneficiaries..."));
              const { pager } = (data.query as any) ?? {};
              let receivedPages = 0;
              const totalPages = getTrackedEntityInstancePages(
                pager.total ?? 0
              );
              var onlineBeneficiaries = await mapLimit(
                totalPages,
                5,
                async (page: number) => {
                  return getTrackedEntityInstances(page).then(
                    (trackedEntityInstances: TrackedEntityInstance[]) => {
                      ++receivedPages;
                      setDownloadProgress(
                        getCurrentProgress(pager.total, receivedPages)
                      );
                      var sanitizedBeneficiaries: any[] =
                        getSanitizedBeneficiariesList(trackedEntityInstances);
                      return sanitizedBeneficiaries;
                    }
                  );
                }
              );
              onlineBeneficiaries = flattenDeep(onlineBeneficiaries);
              setProgressMessage(
                i18n.t("Evaluating duplicate beneficiaries...")
              );
              duplicateTrackedEntityInstances =
                evaluateDuplicateBeneficiaries(onlineBeneficiaries);
              setData(duplicateTrackedEntityInstances);
            },
            (error: any) => {
              setError(error);
            }
          );
      } catch (error: any) {
        setError(error);
      } finally {
        resetBeneficiaryList();
      }
    }

    setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      controller.abort();
    };
  }, [programId, organisationUnits]);

  return { data, error, loading, progressMessage, downloadProgress };
}
