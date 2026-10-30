const markdownIt = require("markdown-it");
const md = markdownIt({ html: false, breaks: true, linkify: false });

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Watch triggers
  eleventyConfig.addWatchTarget("src/assets/");

  // Collections — work items per locale
  eleventyConfig.addCollection("work_en", api =>
    api
      .getFilteredByGlob("src/en/work/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );
  eleventyConfig.addCollection("work_de", api =>
    api
      .getFilteredByGlob("src/de/work/*.md")
      .sort((a, b) => (a.data.order || 99) - (b.data.order || 99))
  );

  // Filter: render a markdown string from front matter data
  eleventyConfig.addFilter("md", content => {
    if (!content) return "";
    return md.render(String(content));
  });

  // Filter: sanitize CSS gradient for safe inline style injection
  const SAFE_GRADIENT = /^(linear|radial|conic)-gradient\([\w\s%,.#()\/]+\)$/i;
  eleventyConfig.addFilter("safeGradient", value => {
    if (!value) return "";
    return SAFE_GRADIENT.test(value.trim()) ? value.trim() : "";
  });

  const escapeHtml = value =>
    String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Filter: word-by-word headline spans. "*word*" sets the serif accent, "+" joins two parts without a space.
  eleventyConfig.addFilter("wordSpans", (text, animate) => {
    const parts = [];
    String(text || "").split(" ").filter(Boolean).forEach(word => {
      const pieces = word.split("+");
      pieces.forEach((piece, i) => parts.push({ piece, join: i < pieces.length - 1 }));
    });
    return parts.map(({ piece, join }, i) => {
      const cls = ["w", piece.includes("*") ? "em" : "", join ? "join" : ""].filter(Boolean).join(" ");
      const style = animate ? ` style="--i: ${i}"` : ' style="transform: none; opacity: 1; filter: none"';
      const wrap = animate ? ' aria-hidden="true"' : ' style="overflow: visible"';
      return `<span class="${cls}"${wrap}><span class="wi"${style}>${escapeHtml(piece.replace(/\*/g, ""))}</span></span>`;
    }).join("");
  });

  // Filter: spans for the scroll-highlighted paragraphs
  eleventyConfig.addFilter("hlSpans", text =>
    String(text || "").split(" ").filter(Boolean).map(word =>
      `<span class="hlw${word.includes("*") ? " em" : ""}">${escapeHtml(word.replace(/\*/g, ""))}</span>`
    ).join(" ")
  );

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md"],
  };
};
