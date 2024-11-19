export class Patient {
    firstName: string;
    middleName: string
    lastName: string
    dateOfBirth: Date;
    diagnosis: string;

    constructor() {
    }

    addName(fullName: string) {
        // Verify and then add.
        const names = fullName.split(" ");
        const numberNames = names.length;
        if (numberNames < 2) {
            console.log(`Unexpected names length. Got ${numberNames} names (from full name ${fullName}), expected 2 or 3.`);
            console.log("Not continuing, as we can't uniquely identify the patient.");
            // Don't continue if we don't have a first name and a last name, as we won't be able to uniquely identify the patient.
            // Possible future extension - create a "field" type which includes whether that piece of information is required.
            throw new Error("Too few names provided.");
        }
        if (numberNames > 3) {
            console.log(`Unexpected names length. Got ${numberNames} names (from full name ${fullName}), expected 2 or 3.`);
            console.log("Continuing with the first 3 names (last name, first name and middle name), but there may be errors.")
        }
        this.lastName = names[0];
        this.firstName = names[1];
        this.middleName = (names.length > 2) ? names[2] : undefined;
    }

    addDateOfBirth(date: Date) {
        this.dateOfBirth = date;
    }

    addDiagnosis(diagnosis: string) {
        if (diagnosis.length === 0) {
            console.log("Found an empty diagnosis on patient. Continuing.");
        }
        this.diagnosis = (diagnosis.length !== 0) ? diagnosis : undefined;
    }

    toJSON() {
        let returnJson = {
            "fullName": {
                "lastName": this.lastName,
                "firstName": this.firstName
            }
        };
        if (this.middleName !== undefined) {
            returnJson["fullName"]["middleName"] = this.middleName;
        }
        if (this.dateOfBirth !== undefined) {
            returnJson["dateOfBirth"] = this.dateOfBirth.toISOString().split("T")[0];
        }
        if (this.diagnosis !== undefined) {
            returnJson["primaryCondition"] = this.diagnosis;
        }

        return returnJson;
    }
}

export default Patient;