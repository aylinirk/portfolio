module.exports = {
  locale: "en",
  lang: "en",
  homeUrl: "/",
  otherLocale: "de",
  otherLocalePath: "/de/",
  strings: {
    navWork: "Work",
    navAbout: "About",
    navLearning: "Learning",
    navContact: "Contact",
    menu: "Open menu",
    ariaNav: "Main navigation",
    ariaLang: "Language",
    ariaMenu: "Mobile navigation",
    portraitAlt: "Portrait of Aylin Stäuble",
    statsLabel: "Key figures",
    view: "View",
    nameWords: "Aylin *Stäuble*",
    workWords: "Selected *Work*",
    learnWords: "Always *learning*",
    contactWords: "Let’s *talk*",
    workEyebrow: "Case studies",
    scrollHint: "Keep scrolling →",
    seqKicker: "My motto",
    learnEyebrow: "Learning & Growth",
    contactEyebrow: "Get in touch",
    contactSub: "I’m studying Communication Design HF with a focus on Interaction Design. I’m open to junior roles, internships and joint projects.",
    badgeCompleted: "Completed",
    badgeInProgress: "In progress",
    badgePlanned: "Planned",
    back: "← Back to portfolio",
    labelRole: "Role",
    labelScope: "Scope",
    labelTools: "Tools",
    labelYear: "Year",
    labelOutcomes: "Outcomes",
    labelPrinciples: "Design principles",
    labelProcess: "Process",
    labelReflection: "Reflection",
    labelNextSteps: "Next steps",
    learnings: "What I take away",
    userQuotes: "What users said",
    testUser: "Test user",
    nextProjectLabel: "Next project",
    qo: "“",
    qc: "”",
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
