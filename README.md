# isla-file-parser

## Future structure

### Extensibility

I had two main focuses for the extensibility of this work:

1. Handling multiple file types. This would involve creating a new FileParser. At that point, it would make sense to:

   - Define the interface a parser is expected to implement.
   - Create an abstract parent class which specific parsers inherit from.
   - Create a way of distinguishing between file types (some piece of metadata on the file seems most sensible for this).

2. Making it easy to add new fields. This would involve:
   - adding a new entry in the `FIELDS_TO_EXTRACT` Map, matching the type `FieldToExtract`
   - defining a method to extract that data and a method on the `Patient` class to set the values

### Structural changes required

To extend this to be a full application the key changes would be:

- File parsing - currently this app is run from the command line (with `tsc` then `node dist/app.js tests/samples/missing.txt`), and processes one file then exits.
  This would need to be changed, and would probably involve making the app run continuously, reading from a queue (e.g. a Google Pub/Sub queue) and processing the files.
  That would form the API for this app.
- Writing output - currently the app prints output to stdout.
  It's likely that we'd want to write to a database - to do this I'd create a new module responsible for the interface with the database.

### Maintainability and diagnosability

There are a few things missing from this from a maintainability/diagnosability perspective:

- Logging - I've used `console.log` statements rather than setting up any proper logging (in part because it was easier, in part because I don't know how to log in Javascript/Typescript yet!). Ideally logs would contain minimal PII (or would be scrubbed of PII) so that they can be written to a centralised logging server.
- Metrics - Aggregated metrics could be emitted (either using Prometheus or OpenTelemetry) and visualised (e.g. using Grafana) to make it possible to monitor the solution. These would give insight in to, for example, when processing of a file fails, when we hit a certain error.
- Alerting - Suitable alert rules should be set up, e.g. alerting if the queue length grows beyond a certain limit, or if all files being processed start to fail.
- Versioning - The current setup doesn't provide any way for the file format to change. We should assume that the file format will need to change at some point, and so it seems to sensible to version the file format in some way.
- Unique identifiers for patients - None of the data currently processed uniquely identifies a patient. It'd be sensible to move to use a unique patient identifier to establish whether a patient is already stored in the database.

### Scalability

A key consideration is the running environment of this app - if we expect to need to scale, it seems sensible to run in a public cloud (e.g. Azure, GCP).
A few options are:

- Container instances - we could build this in to a Docker container and run as a stand-alone container.
- App service - either by building in to a Docker container or running directly (I'm not sure about Typescript but I know that Azure App Service supports running .NET applications directly)
- Kubernetes - this has a little more overhead, but might be worth it if we expect to run other containerised workloads which need to interact with eachother.
