import {
  find,
  filter,
  map,
  flattenDeep,
  keys,
  sortBy,
  reverse,
  groupBy,
  omitBy,
} from "lodash";
import {
  DUPLICATION_ATTRIBUTES_CONSTANT,
  DUPLICATION_IDENTIFICATION_KEYS,
} from "../constants/trackedEntity.constants";
import {
  Attribute,
  Enrollment,
  Event,
  TrackedEntityInstance,
} from "../interfaces";

const DUPLICATE_KEY_ATTRIBUTE = "Duplication Key";

function getBeneficiaryAge(dob: string) {
  var ageDifMs = Date.now() - new Date(dob).getTime();
  var ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

function getFormattedDate(date: any): string {
  let dateObject = new Date(date);
  if (isNaN(dateObject.getDate())) {
    dateObject = new Date();
  }
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  return (
    year +
    (month > 9 ? `-${month}` : `-0${month}`) +
    (day > 9 ? `-${day}` : `-0${day}`)
  );
}

function getAttributeValueById(attributes: any[], attributeId: string) {
  const attributeObj = find(
    attributes,
    (attributeObject: Attribute) => attributeObject.attribute === attributeId
  );
  return attributeObj && attributeObj.value ? attributeObj.value : "";
}

function getLastServiceFromAnalyticData(enrollments: any[]) {
  let lastService = {};
  const sortedServices = reverse(
    sortBy(
      flattenDeep(
        map(enrollments || [], (enrollmentObj: Enrollment) =>
          map(enrollmentObj.events || [], (eventObj: Event) => {
            return {
              ...eventObj,
              eventDate: getFormattedDate(eventObj.eventDate),
            };
          })
        )
      ),
      ["eventDate"]
    )
  );
  if (sortedServices.length > 0) {
    lastService = { ...lastService, ...sortedServices[0] };
  }
  return lastService;
}

function getDuplicationKey(attributes: Attribute[], orgUnitName: string) {
  let duplicationKey = "";
  for (const attributeId of DUPLICATION_IDENTIFICATION_KEYS) {
    if (attributeId === "beneficiary_age") {
      const dob = getAttributeValueById(attributes, "qZP982qpSPS");
      duplicationKey += getBeneficiaryAge(dob);
    } else if (attributeId === "org_unit") {
      const ou = orgUnitName;
      duplicationKey += ou;
    } else {
      duplicationKey += getAttributeValueById(attributes, attributeId);
    }
  }
  return duplicationKey.toUpperCase().split(" ").join("").trim();
}

function getBeneficiaryDetails(
  attributes: Attribute[],
  enrollments: Enrollment[]
) {
  const beneficiaryData: any = {};
  for (const attributeReference of DUPLICATION_ATTRIBUTES_CONSTANT) {
    let value = "";
    if (attributeReference.id === "beneficiary_age") {
      const dob = getAttributeValueById(attributes, "qZP982qpSPS");
      var age = getBeneficiaryAge(dob);
      value = `${age}`;
    } else if (attributeReference.id === "enrollmentDate") {
      const enrollmentDates = filter(
        flattenDeep(
          map(
            enrollments || [],
            (enrollmentObj: Enrollment) => enrollmentObj.enrollmentDate || ""
          )
        ),
        (date: any) => date !== ""
      );
      if (enrollmentDates.length > 0) {
        value = getFormattedDate(enrollmentDates[0]);
      }
    } else if (attributeReference.id === "org_unit") {
      value = enrollments.length > 0 ? enrollments[0].orgUnitName : "";
    } else if (attributeReference.id === "number_of_services") {
      const eventsCount = flattenDeep(
        map(
          enrollments || [],
          (enrollmentObj: Enrollment) => enrollmentObj.events || []
        )
      ).length;
      value = `${eventsCount}`;
    } else if (attributeReference.id === "last_service_date") {
      const lastService: any = getLastServiceFromAnalyticData(
        enrollments || []
      );
      value =
        lastService && keys(lastService).length > 0
          ? lastService["eventDate"] || value
          : value;
    } else {
      value = getAttributeValueById(attributes, attributeReference.id);
    }
    beneficiaryData[attributeReference.label] =
      beneficiaryData[attributeReference.label] ?? value;
  }
  return beneficiaryData;
}

export function getSanitizedBeneficiariesList(
  trackedEntityInstances: TrackedEntityInstance[]
): any[] {
  const sanitizedBeneficiaries: any[] = [];
  for (var trackedEntityInstance of trackedEntityInstances) {
    const dhis2Reference = trackedEntityInstance.trackedEntityInstance;
    const ou =
      trackedEntityInstance.enrollments.length > 0
        ? trackedEntityInstance.enrollments[0].orgUnitName
        : "";
    const duplicationKey = getDuplicationKey(
      trackedEntityInstance.attributes,
      ou
    );

    const beneficiaryData = getBeneficiaryDetails(
      trackedEntityInstance.attributes,
      trackedEntityInstance.enrollments
    );
    sanitizedBeneficiaries.push({
      ...beneficiaryData,
      ...{
        "DHIS2 Reference": dhis2Reference,
        [DUPLICATE_KEY_ATTRIBUTE]: duplicationKey,
      },
    });
  }
  return sanitizedBeneficiaries;
}

export function evaluateDuplicateBeneficiaries(beneficiaries: any[]): any[] {
  const duplicateBeneficiaries: any[] = [];
  const groupedBeneficiaries = omitBy(
    groupBy(beneficiaries, DUPLICATE_KEY_ATTRIBUTE),
    (value: any[], key: string) => value.length < 2
  );
  for (const key of keys(groupedBeneficiaries)) {
    const BeneficiaryList = groupedBeneficiaries[key];
    if (BeneficiaryList.length > 1) {
      duplicateBeneficiaries.push(BeneficiaryList);
    }
  }
  return flattenDeep(duplicateBeneficiaries);
}
