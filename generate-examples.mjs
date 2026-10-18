import { readFileSync, writeFileSync } from "node:fs";
const base = new URL("./examples/", import.meta.url);
const { context, observations } = JSON.parse(readFileSync(new URL("running-example.json", base)));
const document = value => ({ "@context": context, ...value });
const documents = observations.map(document);
const write = (name, text) => writeFileSync(new URL(name, base), text + "\n");
const json = value => JSON.stringify(value);
const yamlDocument = value => Object.entries(value).map(([key, item]) => {
  const encodedKey = key.startsWith("@") ? json(key) : key;
  return `${encodedKey}: ${typeof item === "object" ? json(item) : typeof item === "string" ? json(item) : item}`;
}).join("\n");
const stream = values => values.map(yamlDocument).join("\n---\n");
const displayJson = value => "{\n" + Object.entries(value).map(([key, item]) => {
  if (key === "@context") return `  "@context":\n    ${json(item)}`;
  if (key === "observationAbout") return `  "observationAbout": {\n    "name": ${json(item.name)}\n  }`;
  if (key === "observationDate") return `  "observationDate":\n    ${json(item)}`;
  return `  ${json(key)}: ${json(item)}`;
}).join(",\n") + "\n}";
documents.forEach((value, index) => write(`message-${index ? "two" : "one"}.jsonld`, displayJson(value)));
write("readings.yamlld", stream(documents));
write("explicit-null-readings.yamlld", [yamlDocument(documents[0]), "null", yamlDocument(documents[1])].join("\n---\n"));
write("empty-document-readings.yamlld", yamlDocument(documents[0]) + "\n---\n---\n" + yamlDocument(documents[1]));
write("temperature.jsonld", JSON.stringify(documents[0], null, 2));
write("messages.ndjsonld", [{"@context":context}, ...observations].map(value => json(value).replace(/,(?=")/g, ", ")).join("\n"));
write("messages-with-null.ndjsonld", [{"@context":context}, observations[0], null, observations[1]].map(value => json(value).replace(/,(?=")/g, ", ")).join("\n"));
const blank = documents.map(value => ({...value, "@id":"_:reading"}));
blank.forEach((value, index) => write(`blank-${index ? "two" : "one"}.jsonld`, displayJson(value)));
write("blank-nodes.yamlld", stream(blank));
write("context-scope.yamlld", stream([{ "@context": context }, ...observations]));
write("empty-message.yamlld", [documents[0], {}, documents[1]].map(json).join("\n---\n"));

write("empty-document.yamlld", "---\n...");
write("null-message.yamlld", [json(documents[0]), "", json(documents[1])].join("\n---\n"));
