export interface Attribute {
  attribute: string;
  value: string;
}
export interface Event {
  event: string;
  eventDate: string;
}
export interface Enrollment {
  enrollmentDate: string;
  orgUnitName: string;
  events: Event[];
}
export interface TrackedEntityInstance {
  trackedEntityInstance: string;
  orgUnit: string;
  created: string;
  attributes: Attribute[];
  enrollments: Enrollment[];
}
