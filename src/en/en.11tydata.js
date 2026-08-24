module.exports = {
  locale: "en",
  lang: "en",
  homeUrl: "/",
  otherLocale: "de",
  otherLocalePath: "/de/",
  strings: {
    // Navigation
    navWork: "Work",
    navAbout: "About",
    navContact: "Contact",
    // Sections
    sectionWork: "Selected Work",
    sectionLearning: "Learning & Growth",
    sectionAbout: "About",
    sectionContact: "Get in touch",
    // Cards
    viewCaseStudy: "View case study →",
    // Contact
    contactHeading: "Let's talk",
    contactSub: "Studying the HF Interaction Design programme — open to junior roles, internships, and collaborative projects.",
    contactLinkedIn: "LinkedIn ↗",
    // Learning
    learningCalloutLabel: "Currently",
    learningCalloutText: "Professional bachelor in Interaction Design — since 2026",
    badgeCompleted: "Completed",
    badgeInProgress: "In Progress",
    badgePlanned: "Planned",
    // Case study nav
    backToWork: "← Back to work",
    labelRole: "Role",
    labelScope: "Scope",
    labelTools: "Tools",
    labelYear: "Year",
    nextProjectLabel: "Next project",
    // Case study section labels
    labelBrief: "Brief",
    labelProblem: "Problem",
    labelPrinciples: "Design Principles",
    labelProcess: "Process",
    labelDecisions: "Key UX Decisions",
    labelValidation: "Validation",
    labelOutcomes: "Outcomes",
    labelReflection: "Reflection",
    labelNextSteps: "Next Steps",
  },
  eleventyComputed: {
    permalink: data => {
      // Strip the /en prefix so EN files output to site root
      // /en/index        → /index.html
      // /en/work/concap  → /work/concap/index.html
      const fp = data.page.filePathStem;
      const stripped = fp.replace(/^\/en/, "");
      if (!stripped || stripped === "/index") return "/index.html";
      return stripped + "/index.html";
    }
  }
};
