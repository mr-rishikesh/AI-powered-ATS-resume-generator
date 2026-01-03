export function renderResumeToLatex(
  template: string,
  resume: any
): string {
  let tex = template;

  /* ================= HEADER ================= */

  tex = tex.replace("<<Full Name>>", escapeLatex(resume.NAME ?? ""));
  tex = tex.replaceAll("<<email@example.com>>", escapeLatex(resume.CONTACT?.Email ?? ""));
  tex = tex.replace("<<Phone Number>>", escapeLatex(resume.CONTACT?.Phone ?? ""));
  tex = tex.replace("<<github_url>>", escapeLatex(resume.CONTACT?.GitHub ?? ""));
  tex = tex.replace("<<linkedin_url>>", escapeLatex(resume.CONTACT?.LinkedIn ?? ""));
  tex = tex.replace("<<portfolio_url>>", escapeLatex(resume.CONTACT?.["Other Links"] ?? ""));

  /* ================= EDUCATION ================= */

  if (!resume.EDUCATION || resume.EDUCATION.length === 0) {
    tex = tex.replace(/%----------EDUCATION----------[\s\S]*?\\resumeSubHeadingListEnd/, "");
  } else {
    const eduBlocks = resume.EDUCATION.map((edu: any) => `
  \\resumeSubheading
    {${escapeLatex(edu.Institution)}}
    {${escapeLatex(edu.Location)}}
    {${escapeLatex(edu.Degree)}}
    {${escapeLatex(edu.Duration)}}
`).join("");

    tex = tex.replace(
      /\\resumeSubHeadingListStart[\s\S]*?\\resumeSubHeadingListEnd/,
      `\\resumeSubHeadingListStart${eduBlocks}\n\\resumeSubHeadingListEnd`
    );
  }

  /* ================= SKILLS ================= */

  if (!resume.SKILLS) {
    tex = tex.replace(/%----------SKILLS----------[\s\S]*?\\resumeSubHeadingListEnd/, "");
  } else {
    tex = tex
      .replace("<<Languages>>", joinList(resume.SKILLS.Languages))
      .replace("<<Frameworks>>", joinList(resume.SKILLS["Frameworks & Libraries"]))
      .replace("<<Databases>>", joinList(resume.SKILLS["Tools & Platforms"]))
      .replace("<<Tools>>", joinList(resume.SKILLS["Tools & Platforms"]))
      .replace("<<CS Fundamentals / Domain Skills>>", joinList(resume.SKILLS["Core Subjects"]));
  }

  /* ================= EXPERIENCE ================= */

  if (!resume.EXPERIENCE || resume.EXPERIENCE.length === 0) {
    tex = tex.replace(/%----------EXPERIENCE----------[\s\S]*?\\resumeSubHeadingListEnd/, "");
  } else {
    const expBlocks = resume.EXPERIENCE.map((exp: any) => {
      const bullets = exp.Bullets.map(
        (b: string) => `    \\item ${escapeLatex(b)}`
      ).join("\n");

      return `
  \\resumeSubheading
    {${escapeLatex(exp.Organization)}}
    {}
    {${escapeLatex(exp.Role)}}
    {${escapeLatex(exp.Duration)}}
  \\resumeItemListStart
${bullets}
  \\resumeItemListEnd
`;
    }).join("");

    tex = tex.replace(
      /%----------EXPERIENCE----------[\s\S]*?\\resumeSubHeadingListEnd/,
      `%----------EXPERIENCE----------\n\\section{Experience}\n\\resumeSubHeadingListStart${expBlocks}\n\\resumeSubHeadingListEnd`
    );
  }

  /* ================= PROJECTS ================= */

  if (!resume.PROJECTS || resume.PROJECTS.length === 0) {
    tex = tex.replace(/%----------PROJECTS----------[\s\S]*?\\resumeSubHeadingListEnd/, "");
  } else {
    const projBlocks = resume.PROJECTS.map((p: any) => {
      const bullets = p.Bullets.map(
        (b: string) => `\\item ${escapeLatex(b)}`
      ).join("\n");

      return `
  \\resumeItem{${escapeLatex(p["Project Name"])}}
    {${bullets}}
`;
    }).join("");

    tex = tex.replace(
      /%----------PROJECTS----------[\s\S]*?\\resumeSubHeadingListEnd/,
      `%----------PROJECTS----------\n\\section{Projects}\n\\resumeSubHeadingListStart${projBlocks}\n\\resumeSubHeadingListEnd`
    );
  }

  /* ================= ACHIEVEMENTS ================= */

  if (!resume.ACHIEVEMENTS || resume.ACHIEVEMENTS.length === 0) {
    tex = tex.replace(/%----------ACHIEVEMENTS----------[\s\S]*?\\end{itemize}/, "");
  } else {
    const ach = resume.ACHIEVEMENTS.map(
      (a: string) => `  \\item ${escapeLatex(a)}`
    ).join("\n");

    tex = tex.replace(
      /\\begin{itemize}[\s\S]*?\\end{itemize}/,
      `\\begin{itemize}[leftmargin=*]\n${ach}\n\\end{itemize}`
    );
  }

  /* ================= FINAL SAFETY ================= */

  if (tex.includes("<<")) {
    throw new Error("Unresolved placeholders detected in LaTeX output.");
  }

  return tex;
}


function escapeLatex(input: string): string {
  return input
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
}



function joinList(list?: string[]): string {
  if (!list || list.length === 0) return "";
  return list.map(escapeLatex).join(", ");
}

function isEmptySection(content: string): boolean {
  return content.trim().length === 0;
}
