document.fonts.ready.then(async () => {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    htmlLabels: false,
    theme: "base",
    themeVariables: {
      fontFamily: "PT Sans, sans-serif", fontSize: "22px",
      primaryColor: "#f4f8fc", primaryBorderColor: "#4b86c2", lineColor: "#555"
    },
    flowchart: {htmlLabels: false, useMaxWidth: true, nodeSpacing: 20, rankSpacing: 35}
  });

  // Measure at the slide's intrinsic scale, then restore Shower's presentation scale.
  const diagrams = [...document.querySelectorAll("body > .slide .mermaid")];
  const elements = [document.body, ...new Set(diagrams.map(diagram => diagram.closest(".slide")))];
  const saved = elements.map(element => ({element,
    transform: element.style.getPropertyValue("transform"),
    priority: element.style.getPropertyPriority("transform")
  }));
  const visibility = document.body.style.getPropertyValue("visibility");
  const visibilityPriority = document.body.style.getPropertyPriority("visibility");
  for (const {element} of saved) element.style.setProperty("transform", "none", "important");
  document.body.style.setProperty("visibility", "hidden", "important");
  try {
    await mermaid.run({nodes: diagrams});
    for (const diagram of diagrams) {
      // Replace the reserved glyph with the same local GitHub mark used in footers.
      for (const label of diagram.querySelectorAll("svg tspan.text-inner-tspan")) {
        if (!label.textContent.startsWith("●")) continue;
        const text = label.closest("text");
        const position = label.getStartPositionOfChar(0);
        const bounds = label.getBBox();
        const mark = document.createElementNS("http://www.w3.org/2000/svg", "image");
        mark.setAttribute("href", "github-mark.svg");
        mark.setAttribute("x", position.x);
        mark.setAttribute("y", bounds.y + (bounds.height - 20) / 2);
        mark.setAttribute("width", "20");
        mark.setAttribute("height", "20");
        mark.setAttribute("aria-label", "GitHub");
        if (text.hasAttribute("transform")) mark.setAttribute("transform", text.getAttribute("transform"));
        text.parentNode.insertBefore(mark, text);
        label.textContent = label.textContent.replace("●", "\u2003");
      }
      for (const anchor of diagram.querySelectorAll("svg a")) {
        const href = anchor.getAttribute("href") || anchor.getAttribute("xlink:href");
        if (href) anchor.setAttribute("href", href);
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
        anchor.addEventListener("click", event => event.stopPropagation());
      }
    }
    document.documentElement.dataset.diagramsReady = "true";
  } finally {
    for (const {element, transform, priority} of saved) {
      if (transform) element.style.setProperty("transform", transform, priority);
      else element.style.removeProperty("transform");
    }
    if (visibility) document.body.style.setProperty("visibility", visibility, visibilityPriority);
    else document.body.style.removeProperty("visibility");
  }
}).catch(error => {
  document.documentElement.dataset.diagramsError = error.message;
  console.error(error);
});
