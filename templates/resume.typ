// ATS-SAFE PROFESSIONAL RESUME TEMPLATE - ULTRA COMPACT VERSION
// Optimized for single-page layout - NEVER exceeds 1 page

#set page(
  paper: "a4",
  margin: (top: 0.25in, bottom: 0.25in, left: 0.35in, right: 0.35in),
)

#set text(
  font: "Times New Roman",
  size: 10pt,
  fill: black,
)

#set par(
  justify: false,
  leading: 0.3em,
)

// HEADER
#align(center)[
  #text(size: 16pt, weight: "bold")[{NAME}]
]
#v(0pt)
#align(center)[
  #text(size: 9pt)[{CONTACT_LINE}]
]
#v(0pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(1pt)

{SUMMARY_SECTION}
{SKILLS_SECTION}
{EXPERIENCE_SECTION}
{EDUCATION_SECTION}
{PROJECTS_SECTION}
{CERTIFICATIONS_SECTION}
{ACHIEVEMENTS_SECTION}
