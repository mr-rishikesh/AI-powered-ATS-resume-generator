// utils/generateTypstFromJson.ts
import type { ResumeJSON } from './validateResumeJson';
import fs from 'fs';
import path from 'path';

/* ===================== ESCAPE ===================== */

function escapeTypst(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/[{}\[\]#%&$@_*<>`~^"]/g, m => '\\' + m)
    .trim();
}

function safeStr(v: any): string {
  if (!v) return '';
  return String(v).trim();
}

/* ===================== SANITIZE ===================== */

function sanitizeTypst(src: string): string {
  return src
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^[.\-]+$/gm, '')
    .trim() + '\n';
}

/* ===================== HEADER ===================== */

function section(title: string): string {
  return `#text(weight: "bold", size: 11pt)[${escapeTypst(title)}]
#line(length: 100%, stroke: 0.1pt)
#v(0.4pt)
`;
}

/* ===================== CONTACT ===================== */

function contactLine(c: ResumeJSON['contact']): string {
  if (!c) return '';
  return [
    c.email,
    c.phone,
    c.location,
    c.linkedin && `LinkedIn: ${c.linkedin}`,
    c.github && `GitHub: ${c.github}`,
    c.website && `Portfolio: ${c.website}`,
  ]
    .filter(Boolean)
    .map(escapeTypst)
    .join(' | ');
}

/* ===================== BULLETS ===================== */

function bullets(items?: string[]): string {
  if (!items?.length) return '';
  return items
    .filter(Boolean)
    .map(i => `- ${escapeTypst(i)}`)
    .join('\n') + '\n';
}

/* ===================== SECTIONS ===================== */

function summary(s?: string) {
  if (!s) return '';
  return `${section('Professional Summary')}
#text(size: 10pt)[${escapeTypst(s)}]
`;
}

function skills(s: ResumeJSON['skills']) {
  if (!s) return '';

  const blocks: string[] = [];

  if (s.languages?.length)
    blocks.push(`Programming Languages:\n${escapeTypst(s.languages.join(', '))}`);

  if (s.frameworks?.length)
    blocks.push(`Frameworks & Libraries:\n${escapeTypst(s.frameworks.join(', '))}`);

  if (s.tools?.length)
    blocks.push(`Tools & Technologies:\n${escapeTypst(s.tools.join(', '))}`);

  if (s.soft_skills?.length)
    blocks.push(`Soft Skills:\n${escapeTypst(s.soft_skills.join(', '))}`);

  if (!blocks.length) return '';

  return `${section('Skills')}
${blocks.map(b => `#text(size: 10pt)[${b}]`).join('\n\n')}
`;
}

function experience(list: ResumeJSON['experience']) {
  if (!list?.length) return '';

  const rows = list.map(e => {
    const left = `#text(weight: "bold")[${escapeTypst(e.company)}] (#text(style: "italic")[${escapeTypst(e.title)}])`;
    const right = `${escapeTypst(e.location)} | ${escapeTypst(e.start)} - ${escapeTypst(e.end || 'Present')}`;

    return `#grid(columns: (1fr, auto),
  [${left}],
  [#text(size: 9pt)[${right}]]
)
${bullets(e.bullets)}`;
  });

  return `${section('Professional Experience')}
${rows.join('\n#v(0.8pt)\n')}
`;
}

function education(list: ResumeJSON['education']) {
  if (!list?.length) return '';

  const rows = list.map(e => {
    const detail =
      e.details?.find(d => /gpa|cgpa|%|marks/i.test(d || '')) || '';

    const left = `#text(weight: "bold")[${escapeTypst(e.institution)}] — #text(style: "italic")[${escapeTypst(e.degree)}${detail ? `, ${escapeTypst(detail)}` : ''}]`;
    const right = `${escapeTypst(e.location)} | ${escapeTypst(e.start)} - ${escapeTypst(e.end || 'Present')}`;

    return `#grid(columns: (1fr, auto),
  [${left}],
  [#text(size: 9pt)[${right}]]
)
${bullets(e.details?.filter(d => d !== detail))}`;
  });

  return `${section('Education')}
${rows.join('\n#v(0.8pt)\n')}
`;
}

function projects(list: ResumeJSON['projects']) {
  if (!list?.length) return '';

  const rows = list.map(p => {
    const left = `#text(weight: "bold")[${escapeTypst(p.name)}${p.role ? ` (${escapeTypst(p.role)})` : ''}]`;
    const right = `${escapeTypst(p.start)} - ${escapeTypst(p.end || 'Present')}`;

    return `#grid(columns: (1fr, auto),
  [${left}],
  [#text(size: 9pt)[${right}]]
)
${bullets(p.bullets)}`;
  });

  return `${section('Projects')}
${rows.join('\n#v(0.8pt)\n')}
`;
}

function certifications(list: ResumeJSON['certifications']) {
  if (!list?.length) return '';

  const items = list
    .filter(c => c?.name)
    .map(c => {
      const parts = [escapeTypst(c.name)];
      if (c.issuer) parts.push(escapeTypst(c.issuer));
      if (c.year) parts.push(`(${escapeTypst(c.year)})`);
      return `- ${parts.join(' — ')}`;
    })
    .join('\n');

  if (!items) return '';

  return `${section('Certifications')}
${items}
`;
}

function achievements(list?: string[]) {
  if (!list?.length) return '';
  return `${section('Achievements')}
${bullets(list)}
`;
}

/* ===================== MAIN ===================== */

export function generateTypstFromJson(r: ResumeJSON): string {
  const tpl = `#set page(paper: "a4", margin: (top: 12mm, bottom: 12mm, left: 14mm, right: 14mm))
#set text(font: "Times New Roman", size: 10pt)
#set par(leading: 0.26em)

#align(center)[#text(size: 16pt, weight: "bold")[{NAME}]]
#align(center)[#text(size: 9pt)[{CONTACT}]]
#line(length: 100%, stroke: 0.5pt)
#v(3pt)

{SUMMARY}
{SKILLS}
{EXPERIENCE}
{EDUCATION}
{PROJECTS}
{CERTIFICATIONS}
{ACHIEVEMENTS}
`;

  const out = tpl
    .replace('{NAME}', escapeTypst(r.name))
    .replace('{CONTACT}', contactLine(r.contact))
    .replace('{SUMMARY}', summary(r.profile_summary))
    .replace('{SKILLS}', skills(r.skills))
    .replace('{EXPERIENCE}', experience(r.experience))
    .replace('{EDUCATION}', education(r.education))
    .replace('{PROJECTS}', projects(r.projects))
    .replace('{CERTIFICATIONS}', certifications(r.certifications))
    .replace('{ACHIEVEMENTS}', achievements(r.achievements));

  return sanitizeTypst(out);
}

export function writeTypstToTempFile(content: string): string {
  const dir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const file = path.join(dir, `resume_${Date.now()}.typ`);
  fs.writeFileSync(file, content, 'utf-8');
  return file;
}