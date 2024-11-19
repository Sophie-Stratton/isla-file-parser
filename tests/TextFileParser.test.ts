import { TextFileParser } from "../src/parsers/TextFileParser";

// Really we should be mocking out the Patient class so we can test the TextFileParser independently.

test('text file parser correctly parses file', async () => {
    const textFileParser = new TextFileParser("./tests/samples/sample_file.txt");
    const patient = await textFileParser.parse();
    const json = patient.toJSON();
    expect(json["fullName"]).toStrictEqual({ lastName: 'Smith', firstName: 'John', middleName: 'A' })
    expect(json["dateOfBirth"]).toStrictEqual("1980-01-01");
    expect(json["primaryCondition"]).toStrictEqual("Common Cold");
});

test('text file parser fails to parse badly formatted file (missing segment)', async () => {
    const textFileParser = new TextFileParser("./tests/samples/missing.txt");
    try {
        await textFileParser.parse();
    } catch (err) {
        expect(err.message).toMatch("Unexpected number of segments");
    }
    expect.assertions(1);
});

test('text file parser fails to parse badly formatted file (too many segments)', async () => {
    const textFileParser = new TextFileParser("./tests/samples/toomany.txt");
    try {
        await textFileParser.parse();
    } catch (err) {
        expect(err.message).toMatch("Unexpected number of segments");
    }
    expect.assertions(1);
});

test('text file parser fails to parse nonexistent file', async () => {
    const textFileParser = new TextFileParser("./tests/samples/nonexistent.txt");
    try {
        await textFileParser.parse();
    } catch (err) {
        expect(err.message).toMatch("ENOENT: no such file or directory, open './tests/samples/nonexistent.txt'");
    }
    expect.assertions(1);
});

test('text file skips date parsing on incorrect date format', async () => {
    const textFileParser = new TextFileParser("./tests/samples/bad_date.txt");
    const patient = await textFileParser.parse();
    const json = patient.toJSON();
    expect(json["fullName"]).toStrictEqual({ lastName: 'Smith', firstName: 'John', middleName: 'A' })
    expect(json["dateOfBirth"]).toStrictEqual(undefined);
    expect(json["primaryCondition"]).toStrictEqual("Common Cold");
});