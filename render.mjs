import "./generate-examples.mjs";
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import hljs from "highlight.js";
import { execFileSync } from "node:child_process";
execFileSync("python3", [new URL("./j", import.meta.url).pathname, "--template-only"], {stdio: "inherit"});
hljs.registerLanguage("webidl", () => ({
  keywords: {
    keyword: "partial interface static optional async_iterable typedef dictionary",
    built_in: "Promise sequence USVString JsonLdInput JsonLdOptions JsonLdRecord JsonLdDocument JsonLdStreamInput ExpandedDocumentStream"
  },
  contains: [hljs.C_LINE_COMMENT_MODE, {className: "meta", begin: /\[/, end: /\]/}]
}));

const source = new URL("./", import.meta.url);
const htmlPath = new URL("slides/index.html", source);
const html = readFileSync(htmlPath, "utf8").replace(
  /(<pre\b[^>]*data-diagram="([^"]+)"[^>]*>)[\s\S]*?(<\/pre>)/g,
  (_, opening, path, closing) => opening + readFileSync(new URL(path, source), "utf8").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;") + closing
).replace(
  /(<code\b[^>]*data-source="([^"]+)"[^>]*>)[\s\S]*?(<\/code>)/g,
  (_, opening, path, closing) => {
    const code = readFileSync(new URL(path, source), "utf8").trimEnd();
    const language = path.endsWith(".mjs") ? "javascript"
      : path.endsWith(".py") ? "python"
      : path.endsWith(".yamlld") ? "yaml"
      : path.endsWith(".webidl") ? "webidl" : "json";
    const highlighted = path.endsWith(".ndjsonld")
      ? code.split("\n").map(line =>
          hljs.highlight(line, { language }).value.replace(
            /(<span class="hljs-string">)([\s\S]*?)(<\/span>)/g,
            (_, opening, value, closing) => opening + value.replace(
              /\\n/g, '<span class="json-escape">$&</span>'
            ) + closing
          ) +
          '<span class="line-feed" role="img" aria-label="Line feed byte">␊</span>'
        ).join("\n")
      : hljs.highlight(code, { language }).value;
    const marked = path.endsWith(".ndjsonld") ? highlighted : highlighted.replace(
      /(<span class="hljs-string">)([\s\S]*?)(<\/span>)/g,
      (_, start, value, end) => start + value.replace(/\\n/g, '<span class="json-escape">$&</span>') + end
    );
    return opening + marked + closing;
  }
);
writeFileSync(htmlPath, html);
copyFileSync(new URL("node_modules/highlight.js/styles/github.css", source),
  new URL("slides/highlight.css", source));
copyFileSync(new URL("node_modules/highlight.js/LICENSE", source),
  new URL("slides/highlight-LICENSE", source));

copyFileSync(new URL("node_modules/@mermaid-js/tiny/dist/mermaid.tiny.js", source), new URL("slides/mermaid.tiny.js", source));
copyFileSync(new URL("node_modules/@mermaid-js/tiny/LICENSE", source), new URL("slides/mermaid-LICENSE", source));
