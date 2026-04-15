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

  // Filter: badge CSS modifier from status value (stored in English)
  eleventyConfig.addFilter("badgeClass", status => {
    const map = {
      Completed: "badge--done",
      "In Progress": "badge--progress",
      Planned: "badge--planned",
    };
    return map[status] || "badge--planned";
  });

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
    templateFormats: ["njk", "md", "html"],
  };
};
