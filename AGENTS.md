# Presentation examples

- Use ONE running example throughout this deck. Its canonical data is
  `examples/running-example.json`: the same bedroom, room name, timestamps,
  readings, units, and vocabulary in every format and API example.
- Generate JSON-LD, YAML-LD, NDJSON-LD, and parser inputs from that canonical
  source. Equivalent renderings must contain exactly the same information.
- Introduce only changes needed to demonstrate the current concept, label the
  change explicitly, and derive that variant from the canonical example.
  Do not invent a different room or remove unrelated fields to simplify a slide.
- Keep sources at the bottom right on every slide, outside titles. Right-align
  all source and implementation references, including links below examples.
- Format every GitHub repository source/reference link on every slide as the
  GitHub icon followed by the exact `owner/repo`, including footer references.
  Audit the whole deck when applying this convention. Keep library names in
  comparison tables.
- Format every GitHub PR and issue link as the GitHub icon plus `org/repo#id`,
  linked to its full URL. Apply this globally, including footers, notes, and
  diagram references; put descriptions outside the link.
- Keep an explicit specification link beside an implementation reference.
- Keep code highlighting and meaningful output comments; verify executable
  snippets and rendered slides.

- Use Mermaid for diagrams; retain editable `.mmd` sources.
- Point PR dependency arrows from the base PR to the stacked PR. Verify the
  current branch relationship and label grammar dependencies separately.
- Split dense code across slides instead of shrinking it to fit.
- Remove captions that merely narrate the visible example.
