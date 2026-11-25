export const socialLinks = [
  { name: "GitHub", href: "https://github.com/Faizan-902" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mohd-faizan-khan-95310b30a/",
  },
  { name: "Codeforces", href: "https://codeforces.com/profile/Mohd.Faizan" },
  { name: "LeetCode", href: "https://leetcode.com/u/Mohd_Faizan__/" },
];
export const projects = [
  {
    id: "01",
    name: "PulseCheck",
    category: "FULL STACK / OBSERVABILITY",
    description: "Know the moment something breaks.",
    detail:
      "API monitoring with persistent check history, incident tracking, and a PostgreSQL-backed worker. Built with database leases, SSRF protection, Argon2id authentication, and CSRF protection.",
    stack: ["React", "Node.js", "Express", "PostgreSQL"],
    github: "https://github.com/Faizan-902/PulseCheck",
    demo: "https://pulsecheck-seven.vercel.app/",
    kind: "pulse",
  },
  {
    id: "02",
    name: "SyncTone",
    category: "AI / AUDIO ENGINEERING · TEAM PROJECT",
    description: "Every character. A voice of their own.",
    detail:
      "Co-led a multi-voice audiobook project. Contributed backend flows for novel analysis, character detection, voice assignment, persistent storage, background workers, and TTS integration.",
    stack: ["React", "Node.js", "Python", "TTS"],
    github: "https://github.com/Faizan-902/SyncTone",
    demo: "https://synctone-five.vercel.app/",
    kind: "sync",
  },
  {
    id: "03",
    name: "InternIQ",
    category: "AGENTIC AI / EVALUATION · TEAM PROJECT",
    description: "Opportunity, with a little more intelligence.",
    detail:
      "Built the eligibility engine, transparent hybrid ranker, scam-signal detection, and grounded document verification for Team HumanBot’s internship assistant.",
    stack: ["Python", "LangGraph", "Pydantic", "SQLite"],
    github: "https://github.com/Faizan-902/InternIQ",
    kind: "intern",
  },
  {
    id: "04",
    name: "EnvGuard",
    category: "DEVELOPER TOOLS / PYTHON",
    description: "Catch configuration mistakes before production.",
    detail:
      "A Python CLI and SDK to validate, compare, and synchronize environment files. Supports typed validation, safe template generation, atomic writes, and deterministic CI exit codes.",
    stack: ["Python", "CLI", "CI/CD", "Testing"],
    github: "https://github.com/Faizan-902/envguard",
    kind: "env",
  },
];
export const skills = [
  { title: "Languages", items: ["Python", "JavaScript", "SQL"] },
  { title: "Frontend", items: ["HTML", "CSS", "React"] },
  { title: "Backend", items: ["Node.js", "Express.js"] },
  { title: "Data", items: ["PostgreSQL", "Prisma ORM", "DBMS"] },
  {
    title: "Fundamentals",
    items: [
      "Data Structures & Algorithms",
      "Problem-solving",
      "Code optimization",
    ],
  },
  { title: "Tools", items: ["Git & GitHub", "Docker", "n8n · introductory"] },
];
