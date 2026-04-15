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
    // Hero
    heroCta: "View Work",
    heroTagline: "UI/UX Designer focused on human-centered digital products.",
    // Cards
    viewCaseStudy: "View case study →",
    // Contact
    contactHeading: "Let's talk",
    contactSub: "Open to full-time UX design roles",
    contactLinkedIn: "LinkedIn ↗",
    // Learning
    learningCalloutLabel: "Coming up",
    learningCalloutText: "Professional bachelor in Interaction Design — starting 2026",
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
    // About
    aboutQuote: "I believe good design removes thinking before it adds features.",
    skills: ["Figma", "Prototyping", "User Research", "Interaction Design", "Webflow"]
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
