const fs = require('fs').promises;
import { Patient } from '../models/Patient';

type FieldToExtract = {
    fieldName: string;
    fieldPosition: number;
    parsingFunction: Function;
}

export class TextFileParser {
    filename: string;
    filepath: string;

    // Where to find each variable is a property of the type of file type we're parsing.
    static FIELDS_TO_EXTRACT: Map<string, FieldToExtract[]> = new Map([
        [
            "PRS", [
                { fieldName: "fullName", fieldPosition: 4, parsingFunction: TextFileParser.parseName },
                { fieldName: "dateOfBirth", fieldPosition: 8, parsingFunction: TextFileParser.parseDateOfBirth }
            ]
        ],
        [
            "DET", [
                { fieldName: "diagnosis", fieldPosition: 4, parsingFunction: TextFileParser.parseDiagnosis }
            ]
        ]
    ])

    constructor(filepath: string) {
        // The use of "/" here probably means this won't work on Windows.
        // If running on Windows becomes a requirement, we can make this platform agnostic in future.
        this.filename = filepath.split("/").at(-1);
        this.filepath = filepath;
        this.processContents = this.processContents.bind(this);
    }

    async parse(): Promise<Patient> {
        try {
            const data = await fs.readFile(this.filepath);
            return this.processContents(data);
        }
        catch (err) {
            console.log(`Failed to process file ${this.filename}.`);
            throw err
        }
    };

    processContents(data: Buffer): Patient {
        // This isn't going to handle long files well, as we're (unnecessarily) loading *all* the text in to memory.
        // Leave at is for simplicity/ speed, but if we expect to handle really long files this should be improved!
        const segments = data.toString().split("\n");

        // For each segment we want to extract information from (defined in FIELDS_TO_EXTRACT), parse it and store off the relevant fields.
        let patient = new Patient();
        for (const segmentToExtract of TextFileParser.FIELDS_TO_EXTRACT.keys()) {
            // Extract the correct line/ segment from the file. Check there's only 1 segment.
            const relevantSegments = segments.filter(line => line.startsWith(segmentToExtract));
            if (relevantSegments.length != 1) {
                console.log(`Found ${relevantSegments.length} segments for field ${segmentToExtract}. Stopping processing of file ${this.filename}`);
                throw new Error("Unexpected number of segments");
            }
            const relevantSegment = relevantSegments[0].trim();

            // Extract fields we care about, defined in FIELDS_TO_EXTRACT.
            const fields = relevantSegment.split("|");
            for (const fieldToExtract of TextFileParser.FIELDS_TO_EXTRACT.get(segmentToExtract)) {
                const rawField = fields[fieldToExtract.fieldPosition];
                fieldToExtract.parsingFunction(rawField, patient);
            }
        }
        return patient;
    }

    // Methods below here may apply to multiple file types. If suitable should be extracted to a helper/ utils module so they can be re-used.
    static parseName(fullName: string, patient: Patient) {
        patient.addName(fullName.replaceAll("^", " "));
    }

    static parseDateOfBirth(dateOfBirth: string, patient: Patient) {
        if (dateOfBirth.length !== 8) {
            console.log(`Got unexpected date format (string was of length ${dateOfBirth.length})`);
            console.log("Continuing, without setting date of birth.");
        } else {
            const date = new Date(`${dateOfBirth.slice(0, 4)}-${dateOfBirth.slice(4, 6)}-${dateOfBirth.slice(6)}`);
            patient.addDateOfBirth(date);
        }
    }

    static parseDiagnosis(diagnosis: string, patient: Patient) {
        patient.addDiagnosis(diagnosis);
    }
}