import type { ResumeJSON } from './validateResumeJson';
import fs from 'fs';
import path from 'path';

/**
 * Escapes text for safe use in Typst content blocks
 * Uses a simplified approach that works reliably
 */
function escapeTypst(str: string | undefined | null): string {
  if (!str || typeof str !== 'string') return '';

  // For Typst, we need to escape characters that have special meaning
  // The key characters are: # $ @ * _ ` ~ ^ < > [ ] \ "
  return str
    .replace(/\\/g, '\\\\')   // Backslash first (must be first!)
    .replace(/#/g, '\\#')     // Hash (Typst command prefix)
    .replace(/\$/g, '\\$')    // Dollar (math mode)
    .replace(/@/g, '\\@')     // At sign (labels) - CRITICAL for emails
    .replace(/\*/g, '\\*')    // Asterisk (bold) - but we use it intentionally
    .replace(/_/g, '\\_')     // Underscore (italic)
    .replace(/</g, '\\<')     // Angle brackets (generic)
    .replace(/>/g, '\\>');
}

/**
 * Escapes text but preserves * for bold formatting
 */
function escapeTypstPreserveBold(str: string | undefined | null): string {
  if (!str || typeof str !== 'string') return '';

  return str
    .replace(/\\/g, '\\\\')
    .replace(/#/g, '\\#')
    .replace(/\$/g, '\\$')
    .replace(/@/g, '\\@')
    .replace(/_/g, '\\_')
    .replace(/</g, '\\<')
    .replace(/>/g, '\\>');
}

/**
 * Safely get a string value, with fallback
 */
function safeStr(value: any, fallback: string = ''): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim();
  return String(value).trim();
}

/**
 * Builds the contact line (email | phone | location | links)
 */
function buildContactLine(contact: ResumeJSON['contact']): string {
  if (!contact) return '';

  const parts: string[] = [];

  if (contact.email) {
    parts.push(escapeTypst(contact.email));
  }
  if (contact.phone) {
    parts.push(escapeTypst(contact.phone));
  }
  if (contact.location) {
    parts.push(escapeTypst(contact.location));
  }
  if (contact.linkedin) {
    parts.push(`LinkedIn: ${escapeTypst(contact.linkedin)}`);
  }
  if (contact.github) {
    parts.push(`GitHub: ${escapeTypst(contact.github)}`);
  }
  if (contact.website) {
    parts.push(`Portfolio: ${escapeTypst(contact.website)}`);
  }

  return parts.join(' | ');
}

/**
 * Builds a section header - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildSectionHeader(title: string): string {
  return `#text(size: 10pt, weight: "bold")[${escapeTypst(title.toUpperCase())}]
#v(0pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(0pt)
`;
}

/**
 * Builds the summary section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildSummarySection(summary: string | undefined): string {
  if (!summary || !summary.trim()) return '';

  return `${buildSectionHeader('Professional Summary')}
#text(size: 10pt)[${escapeTypst(summary)}]
#v(1pt)
`;
}

/**
 * Builds the skills section
 */
function buildSkillsSection(skills: ResumeJSON['skills']): string {
  if (!skills) return '';

  const lines: string[] = [];

  if (skills.languages && skills.languages.length > 0) {
    const items = skills.languages.map(s => escapeTypst(safeStr(s))).filter(s => s).join(', ');
    if (items) lines.push(`*Programming Languages:* ${items}`);
  }

  if (skills.frameworks && skills.frameworks.length > 0) {
    const items = skills.frameworks.map(s => escapeTypst(safeStr(s))).filter(s => s).join(', ');
    if (items) lines.push(`*Frameworks/Libraries:* ${items}`);
  }

  if (skills.tools && skills.tools.length > 0) {
    const items = skills.tools.map(s => escapeTypst(safeStr(s))).filter(s => s).join(', ');
    if (items) lines.push(`*Tools & Technologies:* ${items}`);
  }

  if (skills.soft_skills && skills.soft_skills.length > 0) {
    const items = skills.soft_skills.map(s => escapeTypst(safeStr(s))).filter(s => s).join(', ');
    if (items) lines.push(`*Soft Skills:* ${items}`);
  }

  if (lines.length === 0) return '';

  return `${buildSectionHeader('Skills')}
${lines.map(line => `#text(size: 10pt)[${line}]`).join('\n')}
#v(1pt)
`;
}

/**
 * Builds the experience section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildExperienceSection(experience: ResumeJSON['experience']): string {
  if (!experience || experience.length === 0) return '';

  const entries = experience.map(exp => {
    const company = escapeTypst(safeStr(exp.company, 'Company'));
    const title = escapeTypst(safeStr(exp.title, 'Position'));
    const location = escapeTypst(safeStr(exp.location));
    const dateRange = `${escapeTypst(safeStr(exp.start))} - ${escapeTypst(safeStr(exp.end, 'Present'))}`;

    let entry = `#grid(
  columns: (1fr, auto),
  [#text(weight: "bold", size: 10pt)[${company}] #h(2pt) #text(style: "italic", size: 10pt)[${title}]],
  [#text(size: 9pt)[${location ? location + ' | ' : ''}${dateRange}]]
)
`;

    if (exp.bullets && exp.bullets.length > 0) {
      const bullets = exp.bullets
        .filter(b => b && safeStr(b))
        .map(b => `  - ${escapeTypst(safeStr(b))}`)
        .join('\n');
      if (bullets) {
        entry += `#text(size: 10pt)[${bullets}]\n`;
      }
    }

    return entry;
  }).join('#v(0pt)\n');

  return `${buildSectionHeader('Professional Experience')}
${entries}
#v(1pt)
`;
}

/**
 * Builds the education section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildEducationSection(education: ResumeJSON['education']): string {
  if (!education || education.length === 0) return '';

  const entries = education.map(edu => {
    const institution = escapeTypst(safeStr(edu.institution, 'Institution'));
    const degree = escapeTypst(safeStr(edu.degree, 'Degree'));
    const location = escapeTypst(safeStr(edu.location));
    const dateRange = `${escapeTypst(safeStr(edu.start))} - ${escapeTypst(safeStr(edu.end, 'Present'))}`;

    let entry = `#grid(
  columns: (1fr, auto),
  [#text(weight: "bold", size: 10pt)[${institution}] #h(2pt) #text(style: "italic", size: 10pt)[${degree}]],
  [#text(size: 9pt)[${location ? location + ' | ' : ''}${dateRange}]]
)
`;

    if (edu.details && edu.details.length > 0) {
      const details = edu.details
        .filter(d => d && safeStr(d))
        .map(d => `  - ${escapeTypst(safeStr(d))}`)
        .join('\n');
      if (details) {
        entry += `#text(size: 10pt)[${details}]\n`;
      }
    }

    return entry;
  }).join('#v(0pt)\n');

  return `${buildSectionHeader('Education')}
${entries}
#v(1pt)
`;
}

/**
 * Builds the projects section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildProjectsSection(projects: ResumeJSON['projects']): string {
  if (!projects || projects.length === 0) return '';

  const entries = projects.map(proj => {
    const name = escapeTypst(safeStr(proj.name, 'Project'));
    const role = escapeTypst(safeStr(proj.role));
    const dateRange = `${escapeTypst(safeStr(proj.start))} - ${escapeTypst(safeStr(proj.end, 'Present'))}`;

    let entry = `#grid(
  columns: (1fr, auto),
  [#text(weight: "bold", size: 10pt)[${name}]${role ? ` #h(2pt) #text(style: "italic", size: 10pt)[${role}]` : ''}],
  [#text(size: 9pt)[${dateRange}]]
)
`;

    if (proj.bullets && proj.bullets.length > 0) {
      const bullets = proj.bullets
        .filter(b => b && safeStr(b))
        .map(b => `  - ${escapeTypst(safeStr(b))}`)
        .join('\n');
      if (bullets) {
        entry += `#text(size: 10pt)[${bullets}]\n`;
      }
    }

    return entry;
  }).join('#v(0pt)\n');

  return `${buildSectionHeader('Projects')}
${entries}
#v(1pt)
`;
}

/**
 * Builds the certifications section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildCertificationsSection(certifications: ResumeJSON['certifications']): string {
  if (!certifications || certifications.length === 0) return '';

  const items = certifications
    .filter(cert => cert && cert.name)
    .map(cert => {
      const name = escapeTypst(safeStr(cert.name));
      const issuer = escapeTypst(safeStr(cert.issuer));
      const year = escapeTypst(safeStr(cert.year));
      return `  - *${name}*${issuer ? ` - ${issuer}` : ''}${year ? ` (${year})` : ''}`;
    })
    .join('\n');

  if (!items) return '';

  return `${buildSectionHeader('Certifications')}
#text(size: 10pt)[${items}]
#v(1pt)
`;
}

/**
 * Builds the achievements section - ULTRA COMPACT VERSION (minimal gaps)
 */
function buildAchievementsSection(achievements: string[]): string {
  if (!achievements || achievements.length === 0) return '';

  const items = achievements
    .filter(a => a && safeStr(a))
    .map(a => `  - ${escapeTypst(safeStr(a))}`)
    .join('\n');

  if (!items) return '';

  return `${buildSectionHeader('Achievements')}
#text(size: 10pt)[${items}]
#v(1pt)
`;
}

/**
 * Main function: Generates complete Typst document from ResumeJSON
 * This is the SINGLE SOURCE OF TRUTH for resume rendering
 */
export function generateTypstFromJson(resumeJson: ResumeJSON): string {
  // Read the template
  const templatePath = path.join(process.cwd(), 'templates', 'resume.typ');
  let template: string;

  try {
    template = fs.readFileSync(templatePath, 'utf-8');
  } catch (error) {
    console.error('Failed to read template, using inline template');
    // Fallback inline template - ULTRA COMPACT VERSION (minimal gaps)
    template = `#set page(paper: "a4", margin: (top: 0.25in, bottom: 0.25in, left: 0.35in, right: 0.35in))
#set text(font: "Times New Roman", size: 10pt, fill: black)
#set par(justify: false, leading: 0.3em)

#align(center)[#text(size: 16pt, weight: "bold")[{NAME}]]
#v(0pt)
#align(center)[#text(size: 9pt)[{CONTACT_LINE}]]
#v(0pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(1pt)

{SUMMARY_SECTION}
{SKILLS_SECTION}
{EXPERIENCE_SECTION}
{EDUCATION_SECTION}
{PROJECTS_SECTION}
{CERTIFICATIONS_SECTION}
{ACHIEVEMENTS_SECTION}`;
  }

  // Build all sections
  const name = escapeTypst(safeStr(resumeJson.name, 'Name'));
  const contactLine = buildContactLine(resumeJson.contact);
  const summarySection = buildSummarySection(resumeJson.profile_summary);
  const skillsSection = buildSkillsSection(resumeJson.skills);
  const experienceSection = buildExperienceSection(resumeJson.experience);
  const educationSection = buildEducationSection(resumeJson.education);
  const projectsSection = buildProjectsSection(resumeJson.projects);
  const certificationsSection = buildCertificationsSection(resumeJson.certifications);
  const achievementsSection = buildAchievementsSection(resumeJson.achievements);

  // Replace placeholders
  let typstContent = template
    .replace(/{NAME}/g, name)
    .replace(/{CONTACT_LINE}/g, contactLine)
    .replace(/{SUMMARY_SECTION}/g, summarySection)
    .replace(/{SKILLS_SECTION}/g, skillsSection)
    .replace(/{EXPERIENCE_SECTION}/g, experienceSection)
    .replace(/{EDUCATION_SECTION}/g, educationSection)
    .replace(/{PROJECTS_SECTION}/g, projectsSection)
    .replace(/{CERTIFICATIONS_SECTION}/g, certificationsSection)
    .replace(/{ACHIEVEMENTS_SECTION}/g, achievementsSection);

  // Final cleanup - remove any leftover placeholders
  typstContent = typstContent.replace(/\{[A-Z_]+\}/g, '');

  // Remove excessive blank lines
  typstContent = typstContent.replace(/\n{3,}/g, '\n\n');

  console.log('✅ Typst content generated successfully');

  return typstContent;
}

/**
 * Writes Typst content to a temporary file
 */
export function writeTypstToTempFile(typstContent: string): string {
  const tempDir = path.join(process.cwd(), 'temp');

  // Ensure temp directory exists
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const tempFilePath = path.join(tempDir, `resume_${timestamp}_${randomId}.typ`);

  fs.writeFileSync(tempFilePath, typstContent, 'utf-8');

  console.log(`📝 Typst file written to: ${tempFilePath}`);

  return tempFilePath;
}
