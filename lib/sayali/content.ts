/** Live resume: public/Sayli_Kulkarni_resume (2).pdf */

export const resume = {
  path: "/Sayli_Kulkarni_resume%20(2).pdf",
  label: "Download resume",
  filename: "Sayli_Kulkarni_resume (2).pdf",
} as const;

export const profile = {
  name: "Sayli Kulkarni",
  shortName: "SAYLI",
  phone: "7558236448",
  phoneHref: "tel:+917558236448",
  email: "KSAYLI235@GMAIL.COM",
  emailHref: "mailto:KSAYLI235@GMAIL.COM",
  github: "Sayli-02",
  githubHref: "https://github.com/Sayli-02",
  linkedin: "sayli-kulkarni",
  linkedinHref:
    "https://www.linkedin.com/in/sayli-kulkarni-b7a34535a",
  role: "B.Tech AI & ML · Full Stack & AI Automation",
  education: {
    school: "Dwarkadas J. Sanghvi College of Engineering (DJSCE)",
    place: "Mumbai, Maharashtra",
    degree: "B.Tech. in Artificial Intelligence & Machine Learning",
  },
  skills: {
    languages: ["Java", "C", "Python", "SQL"],
    frameworks: ["Firebase", "Flutter (Basics)", "Django"],
    ai: ["n8n", "Vapi.ai", "Twilio", "Cursor AI", "Make.com", "Custom GPTs"],
    data: ["Numpy", "Pandas", "Matplotlib", "Seaborn"],
    other: ["Meta Ads", "Canva", "Vercel", "Git"],
  },
} as const;

export const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#experience", label: "Experience" },
  { href: "/#projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
] as const;

export const about = {
  eyebrow: "About me",
  headline: "AI/ML engineer building useful systems end to end.",
  lead:
    "I’m Sayli Kulkarni — a B.Tech Artificial Intelligence & Machine Learning student at DJSCE, working across full-stack development, AI automation, and applied ML products.",
  paragraphs: [
    "I ship CRM and property platforms, automate workflows with tools like n8n and Vapi, and build ML apps with explainability and real evaluation — not demos that die in a notebook.",
    "As Projects Head at DJS CODEAI, I lead club builds and collaborate with industry partners while keeping my own product and research craft sharp.",
  ],
} as const;

export const experience = {
  eyebrow: "Work experience",
  headline: "Where I’ve been building.",
  items: [
    {
      period: "Sep 2026 – Nov 2026",
      title: "Full Stack Development and AI Automation Intern",
      org: "Parmar Properties",
      points: [
        "Developing the company’s CRM as part of full-stack development and AI automation work.",
        "Developing the company’s property listing website.",
      ],
    },
    {
      period: "Aug 2026 – Present",
      title: "Projects Head",
      org: "DJS CODEAI – AI & ML Club, DJSCE",
      points: [
        "Leading projects for the AI & ML club and coordinating student builds.",
      ],
    },
    {
      period: "Sep 2025 – Aug 2026",
      title: "Member · Events & Projects Team",
      org: "DJS CODEAI – AI & ML Club, DJSCE",
      points: [
        "Member of the Events and Projects Team.",
        "Project associate with the CODEAI tech team for Aspira Diagnostics.",
      ],
    },
  ],
} as const;

export const projectsPage = {
  eyebrow: "Projects",
  headline: "Applied ML, fraud systems, and product CRMs.",
  lead: "Selected builds from my resume — live demos linked where available.",
  items: [
    {
      id: "aarogya",
      title: "AarogyaDrishti AI",
      meta: "AI/ML · Health · Ongoing",
      blurb:
        "AI/ML app for predicting heart disease, CKD, and hypertension risk, with SHAP-based explainability for transparent predictions. XGBoost, Random Forest, SVM, SMOTE, and careful preprocessing.",
      tags: ["XGBoost", "SHAP", "SMOTE", "Streamlit"],
      href: "https://aarogyadrishti-ai.streamlit.app/",
    },
    {
      id: "fraud",
      title: "Credit Card Fraud Detection",
      meta: "ML · Fintech · Ongoing",
      blurb:
        "Fraud detection web app on 2M+ transactions using Python, Streamlit, and XGBoost. 94.5% recall on unseen data with time and location features, interactive dashboards, and live prediction.",
      tags: ["Python", "XGBoost", "Streamlit", "Feature eng."],
      href: "https://credit-card-fraud-detection-3hhmaytzqvhdl8frasznuh.streamlit.app/",
    },
    {
      id: "lensflow",
      title: "Photography CRM (LensFlow)",
      meta: "Full-stack · CRM · Ongoing",
      blurb:
        "Full-stack CRM for a photography and album business — centralizes Instagram, WhatsApp, website, and referral leads. Lead management, pipeline, follow-ups, client tracking, and analytics; PostgreSQL APIs in progress.",
      tags: ["CRM", "Frontend", "PostgreSQL"],
      href: "https://lensflow-mock-crm.vercel.app/",
    },
  ],
} as const;

export const contact = {
  eyebrow: "Contact",
  headline: "Let’s connect.",
  lead: "Here’s how to reach me — open to roles, internships, and collaborations.",
} as const;

/** Shown inside the laptop after the dive (no fashion reels). */
export const mlScreen = {
  title: "// model lab",
  metrics: [
    { label: "Recall", value: "94.5%" },
    { label: "CGPA peak", value: "9.05" },
    { label: "Projects", value: "03+" },
  ],
} as const;
