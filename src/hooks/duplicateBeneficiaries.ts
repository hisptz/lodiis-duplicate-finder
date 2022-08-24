import { useDataEngine } from "@dhis2/app-runtime";
import { OrganisationUnit } from "@hisptz/dhis2-utils";
import { useEffect, useState } from "react";
import { map, flattenDeep } from "lodash";
import { mapLimit } from "async-es";

import {
  DUPLICATE_BENEFICIARIES_PAGES_QUERY,
  TRACKED_ENTITY_INSTANCE_QUERY,
} from "../constants";
import { TrackedEntityInstance } from "../interfaces";
import { teiPageSize } from "../constants/pagination.constants";
import { evaluateDuplicateBeneficiaries } from "../helpers/duplicateBeneficiariesHelper";

export function useDuplicateBeneficiaries(
  programId: string,
  organisationUnits: OrganisationUnit[]
) {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const engine = useDataEngine();

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

  useEffect(() => {
    async function fetchData() {
      var duplicateTrackedEntityInstances: any[] = [];
      try {
        setLoading(true);
        engine
          .query(DUPLICATE_BENEFICIARIES_PAGES_QUERY, {
            variables: {
              program: programId,
              ou,
            },
          })
          .then(
            async (data: any) => {
              const { pager } = (data.query as any) ?? {};
              var teiLists = await mapLimit(
                getTrackedEntityInstancePages(pager.total ?? 0),
                5,
                async (page: number) => {
                  return getTrackedEntityInstances(page);
                }
              );
              teiLists = flattenDeep(teiLists);
              duplicateTrackedEntityInstances =
                evaluateDuplicateBeneficiaries(teiLists);
              setData(duplicateTrackedEntityInstances);
            },
            (error: any) => {
              setError(error);
            }
          );
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [programId, organisationUnits]);

  return { data, error, loading };
}
