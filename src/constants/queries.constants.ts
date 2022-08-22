import { map } from "lodash";
import { teiPageSize } from "./pagination.constants";

const excludedPrograms = (): string[] =>
  map(["uzE2gHz6neQ"], (program: string) => `id:ne:${program}`);

export const PROGRAMS_QUERY = {
  programsQuery: {
    resource: "programs",
    params: {
      fields: ["id", "displayName"],
      filter: [...excludedPrograms(), "programType:eq:WITH_REGISTRATION"],
      paging: false,
    },
  },
};

export const DUPLICATE_BENEFICIARIES_PAGES_QUERY = {
  query: {
    resource: "trackedEntityInstances",
    params: ({ ou, program }: any) => ({
      ou,
      program,
      ouMode: "DESCENDANTS",
      totalPages: true,
      pageSize: 1,
      page: 1,
      fields: ["trackedEntityInstance"],
    }),
  },
};

export const TRACKED_ENTITY_INSTANCE_QUERY = {
  query: {
    resource: "trackedEntityInstances",
    params: ({ program, page, ou }: any) => ({
      program,
      ou,
      totalPages: false,
      page: page ?? 1,
      pageSize: teiPageSize,
      ouMode: "DESCENDANTS",
      fields: [
        "trackedEntityInstance",
        "orgUnit",
        "created",
        "attributes[attribute,value]",
        "enrollments[enrollmentDate,orgUnitName,events[event,eventDate]]",
      ],
    }),
  },
};
