export function extractTemplateHtml(template: HTMLTemplateElement) {
  let html = '';

  for (const child of Array.from(template.content.children)) {
    html += child.outerHTML;
  }

  return html;
}
