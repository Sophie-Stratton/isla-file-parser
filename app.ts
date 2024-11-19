import { TextFileParser } from "./src/parsers/TextFileParser";

async function main() {
    const textFile = new TextFileParser(process.argv[2]);
    const patient = await textFile.parse();
    console.log(patient.toJSON());
}

main();