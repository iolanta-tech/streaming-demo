import { createReadStream } from "node:fs";
import { JsonLdParser } from "jsonld-streaming-parser";

const input = new URL("./temperature.jsonld", import.meta.url);
const quads = createReadStream(input).pipe(
  new JsonLdParser({ streamingProfile: true })
);
for await (const quad of quads) {
  if (quad.predicate.value === "https://schema.org/value") {
    console.log(quad.object.value); // 20
  }
}
