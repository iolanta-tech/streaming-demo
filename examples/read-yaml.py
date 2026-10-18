from pathlib import Path
from ruamel.yaml import YAML
from ruamel.yaml.composer import ComposerError

source = Path(__file__).with_name("readings.yamlld")
try:
    YAML(typ="safe").load(source)
except ComposerError:
    print("load: more than one document")

with source.open() as stream:
    documents = YAML(typ="safe").load_all(stream)
    print(next(documents)["value"])  # 20
    for document in documents:
        print(document["value"])    # 21
