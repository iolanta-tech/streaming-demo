#!/usr/bin/env python3
"""Build the deck from its Jinja2 source and generated examples."""
from pathlib import Path
import subprocess
import sys
from jinja2 import Environment, FileSystemLoader, StrictUndefined

root = Path(__file__).resolve().parent
if sys.argv[1:] == ["--template-only"]:
    environment = Environment(loader=FileSystemLoader(root / "templates"),
                              undefined=StrictUndefined, autoescape=True,
                              keep_trailing_newline=True)
    (root / "slides/index.html").write_text(environment.get_template("index.html.jinja").render())
else:
    subprocess.run(["node", str(root / "render.mjs")], cwd=root, check=True)
