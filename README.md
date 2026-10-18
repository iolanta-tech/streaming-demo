# JSON-LD & Streaming

A local Shower presentation for the JSON-LD Community Group, using the Ribbon
layout from `../alpha-centauri-demo`.

## Run

Requires Node.js and Python 3 with Jinja2. Set up the Python build environment once:

```sh
python3 -m venv .venv
. .venv/bin/activate
python -m pip install Jinja2
npm ci
make serve
```

Open <http://127.0.0.1:8766/index.html?full#title>.
The generated slides include all assets and can be presented offline.

## Edit

Edit `templates/index.html.jinja` and `slides/styles.css`, then run `./j`
(or `make render` / `npm run build`). `slides/index.html` is generated; direct
edits are overwritten. The shared `streaming_example` macro produces the normal
and crossed-out slides from one definition. Code and Mermaid sources live in
`examples/` and are embedded during generation. Reload after building.

Run the file-reading API example with:

```sh
npm run example
```

Expected output: `20`. It reads `examples/temperature.jsonld` through
`jsonld-streaming-parser` and prints the temperature value.

The opening slides cover RDF Messages, Streaming JSON-LD, JSON stream framing,
and the RDF Messages draft's NDJSON-LD profile. Source links and context are
included in each slide's hidden speaker notes.

Examples consistently use temperature readings. Visible LF symbols annotate
record boundaries in the slides; the canonical files retain actual LF bytes.

## YAML API example

With `ruamel.yaml==0.19.1` installed, run:

```sh
python3 examples/read-yaml.py
```

`load()` rejects the multi-document fixture; `load_all()` yields documents.
The final API example is explicitly hypothetical and is not runnable.

The remaining slides compare current extraction behavior, blank-node identity,
context scope, and empty messages, then introduce CG discussion questions.

## Running example

`examples/running-example.json` is the canonical pair of bedroom observations.
`generate-examples.mjs`, invoked by the renderer, derives all format and scope
examples from it. Variants explicitly add identifiers, move the context, or
insert an empty message; they retain every other field.

`examples/streaming-api-proposal.webidl` is a proposed extension, not an
implemented API. Streaming-operation cards describe per-document counterparts.

## Verify

```sh
npm run build
npm run verify
```

Python verification uses `ruamel.yaml`, `PyYAML`, and `PyLD`. The library table
was checked with ruamel.yaml 0.19.1, PyYAML 6.0.1, and js-yaml 5.5.0.
The WebIDL proposal is syntax-checked with imported types supplied as stubs.

## Vocabulary references

The running example uses [Observation](https://schema.org/Observation),
[name](https://schema.org/name), [observationAbout](https://schema.org/observationAbout),
[observationDate](https://schema.org/observationDate), [value](https://schema.org/value),
and [unitText](https://schema.org/unitText). Their definitions and applicability
were checked against Schema.org on 18 October 2026: names and units are text,
readings are numbers, observationAbout identifies the observed entity, and
observationDate accepts Date or DateTime. Observation inherits value and unitText
from QuantitativeValue and name from Thing. JSON-LD expansion checks alone do
not establish vocabulary validity.

The GitHub mark is from [Primer Octicons](https://github.com/primer/octicons),
under the MIT license retained in `slides/octicons-LICENSE`.

Language icons are from [Devicon](https://github.com/devicons/devicon), with the license retained in `slides/devicon-LICENSE`.

The retained Mermaid diagrams have editable sources in
`examples/*.mmd`. `npm run build` embeds them and vendors Mermaid Tiny locally
so the diagrams also work from a file URL. Its license is retained in
`slides/mermaid-LICENSE`. Existing expansion and the proposed streaming extension
are presented separately, with Web IDL verified together.

The proposed `expandStream()` input accepts a URL or a document array. Each outer
array item is expanded independently; an item may itself be an array of objects
or null. `[]` supplies no documents, `[null]` yields one empty result, and
`[[A, B]]` yields one result from expanding the array-valued document `[A, B]`.
The checks exercise existing expansion operations and the IDL; this method is
not implemented by the demo.
