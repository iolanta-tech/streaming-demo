from pathlib import Path
from types import GeneratorType
import json
import yaml as pyyaml
from ruamel.yaml import YAML
from ruamel.yaml.composer import ComposerError
from pyld import jsonld

root = Path(__file__).parent / "examples"
canonical = json.loads((root / "running-example.json").read_text())
expected = [{"@context": canonical["context"], **item} for item in canonical["observations"]]
def stream(name):
    return list(YAML(typ="safe").load_all((root / name).read_text()))
assert stream("readings.yamlld") == expected
assert stream("explicit-null-readings.yamlld") == [expected[0], None, expected[1]]
assert stream("empty-document-readings.yamlld") == [expected[0], None, expected[1]]
assert "\n---\n---\n" in (root / "empty-document-readings.yamlld").read_text()
for index, name in enumerate(["message-one.jsonld", "message-two.jsonld"]):
    assert json.loads((root / name).read_text()) == expected[index]
ndjson = [json.loads(line) for line in (root / "messages.ndjsonld").read_text().splitlines()]
assert ndjson[0] == {"@context": canonical["context"]}
assert [{"@context": ndjson[0]["@context"], **item} for item in ndjson[1:]] == expected
null_records = [json.loads(line) for line in (root / "messages-with-null.ndjsonld").read_text().splitlines()]
assert null_records == [{"@context": canonical["context"]}, canonical["observations"][0], None, canonical["observations"][1]]
blank = stream("blank-nodes.yamlld")
assert blank == [{**item, "@id": "_:reading"} for item in expected]
flattened = jsonld.flatten(blank)
observations = [item for item in flattened if "https://schema.org/Observation" in item.get("@type", [])]
assert len(observations) == 1
assert {item["@value"] for item in observations[0]["https://schema.org/value"]} == {20, 21}
assert sum(len([node for node in jsonld.flatten(item) if "https://schema.org/Observation" in node.get("@type", [])]) for item in blank) == 2
context = stream("context-scope.yamlld")
assert context == [{"@context": canonical["context"]}, *canonical["observations"]]
expanded = jsonld.expand(context, {"base": "https://example.org/readings.yamlld"})
assert len(expanded) == 2
assert all(set(node) == {"@type"} and node["@type"] == ["https://example.org/Observation"] for node in expanded)
empty = stream("empty-message.yamlld")
assert empty == [expected[0], {}, expected[1]]
assert len(jsonld.expand(empty)) == 2
assert [len(jsonld.expand(item)) for item in empty] == [1, 0, 1]
text = (root / "readings.yamlld").read_text()
for name, single, multiple in [
    ("ruamel.yaml", lambda text: YAML(typ="safe").load(text), lambda text: YAML(typ="safe").load_all(text)),
    ("PyYAML", pyyaml.safe_load, pyyaml.safe_load_all),
]:
    assert single((root / "message-one.jsonld").read_text()) == expected[0]
    try:
        single(text)
        raise AssertionError(name + " accepted multiple documents")
    except (ComposerError, pyyaml.composer.ComposerError):
        pass
    result = multiple(text)
    assert isinstance(result, GeneratorType)
    assert list(result) == expected
print("Canonical JSON-LD/YAML/NDJSON equivalence, labeled variants, scope semantics, and Python API table verified.")

assert stream("empty-document.yamlld") == [None]
null_stream = stream("null-message.yamlld")
assert null_stream == [expected[0], None, expected[1]]
processor = jsonld.JsonLdProcessor()
options = {"processingMode": "json-ld-1.1", "base": ""}
constructed = None
expanded_null = processor._expand(processor._get_initial_context(options), None, constructed, options)
assert expanded_null is None
# The specification's public expansion procedure normalizes null to [].
normalized = [] if expanded_null is None else expanded_null
assert jsonld.to_rdf(normalized, {"format": "application/n-quads"}) == ""
try:
    direct = jsonld.expand(None)
except jsonld.JsonLdError as error:
    print("Installed PyLD rejects direct None before expansion:", error.code)
else:
    assert direct == []
assert len(jsonld.expand(null_stream)) == 2
assert len(jsonld.expand(null_stream[0])) == 1
assert len(jsonld.expand(null_stream[2])) == 1
print("Empty YAML document constructs null; expansion algorithm returns null; specified normalization gives []; RDF conversion gives zero quads.")

# Probe the proposed array boundary contract using existing expansion operations.
separate = [jsonld.expand(document) for document in expected]
assert [len(result) for result in separate] == [1, 1]
nested_document = jsonld.expand(expected)
assert len(nested_document) == 2  # One result containing both expanded objects.
assert [len(result) for result in [nested_document, normalized, separate[0]]] == [2, 0, 1]
print("Array-input proposal: separate document expansion, nested document array, and empty result boundaries checked; expandStream itself is not implemented.")
