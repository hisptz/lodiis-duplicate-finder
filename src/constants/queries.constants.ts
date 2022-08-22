import { map } from "lodash";

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
