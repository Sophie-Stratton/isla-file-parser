import Patient from "../src/models/Patient";

test("passing a badly formatted name (too short) causes an error", () => {
  const patient = new Patient();
  expect(() => {
    patient.addName("JohnASmith");
  }).toThrow();
});

test("passing a badly formatted name (too long) doesn't cause an error", () => {
  const patient = new Patient();
  patient.addName("Smith John A J");
  patient.addDateOfBirth(new Date("2024-11-19"));
  patient.addDiagnosis("Common Cold");
  const json = patient.toJSON();
  expect(json["fullName"]).toStrictEqual({
    lastName: "Smith",
    firstName: "John",
    middleName: "A",
  });
});

test("not setting a middle name results in no middle name being set", () => {
  const patient = new Patient();
  patient.addName("Smith John");
  patient.addDateOfBirth(new Date("2024-11-19"));
  patient.addDiagnosis("Common Cold");
  const json = patient.toJSON();
  expect(json["fullName"]).toStrictEqual({
    lastName: "Smith",
    firstName: "John",
  });
});

test("fields are set properly", () => {
  const patient = new Patient();
  patient.addName("Smith John A");
  patient.addDateOfBirth(new Date("2024-11-19"));
  patient.addDiagnosis("Common Cold");
  const json = patient.toJSON();
  expect(json["fullName"]).toStrictEqual({
    lastName: "Smith",
    firstName: "John",
    middleName: "A",
  });
  expect(json["dateOfBirth"]).toStrictEqual("2024-11-19");
  expect(json["primaryCondition"]).toStrictEqual("Common Cold");
});

test("passing an empty diagnosis succeeds", () => {
  const patient = new Patient();
  patient.addName("Smith John A");
  patient.addDateOfBirth(new Date("2024-11-19"));
  patient.addDiagnosis("");
  const json = patient.toJSON();
  expect(json["diagnosis"]).toBe(undefined);
});

test("passing a empty diagnosis succeeds", () => {
  const patient = new Patient();
  patient.addName("Smith John A");
  patient.addDateOfBirth(new Date("2024-11-19"));
  patient.addDiagnosis("");
  const json = patient.toJSON();
  expect(json["diagnosis"]).toBe(undefined);
});
