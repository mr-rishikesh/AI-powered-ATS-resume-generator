#set page(paper: "a4", margin: (top: 0.5in, bottom: 0.5in, left: 0.5in, right: 0.5in))
#set text(font: "Times New Roman", size: 10pt, fill: black)
#set par(justify: false, leading: 0.5em)

#align(center)[#text(size: 18pt, weight: "bold")[John Doe]]
#v(4pt)
#align(center)[#text(size: 9pt)[john\@example.com | 555-1234 | New York, NY | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe]]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(6pt)

#text(size: 11pt, weight: "bold")[PROFESSIONAL SUMMARY]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
#text(size: 10pt)[Experienced software engineer with 5 years of experience in building scalable applications.]
#v(8pt)

#text(size: 11pt, weight: "bold")[SKILLS]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
#text(size: 10pt)[*Programming Languages:* JavaScript, Python, TypeScript]
#v(2pt)
#text(size: 10pt)[*Frameworks/Libraries:* React, Node.js, Express]
#v(2pt)
#text(size: 10pt)[*Tools \& Technologies:* Git, Docker, AWS]
#v(8pt)

#text(size: 11pt, weight: "bold")[PROFESSIONAL EXPERIENCE]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
#grid(
  columns: (1fr, auto),
  [#text(weight: "bold")[Google] #h(4pt) #text(style: "italic")[Software Engineer]],
  [#text(size: 9pt)[Mountain View, CA | 2019 - Present]]
)
#v(2pt)
  - Developed features for Chrome browser
  - Led team of 3 engineers on major project
#v(8pt)

#text(size: 11pt, weight: "bold")[EDUCATION]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
#grid(
  columns: (1fr, auto),
  [#text(weight: "bold")[MIT] #h(4pt) #text(style: "italic")[B.S. Computer Science]],
  [#text(size: 9pt)[Cambridge, MA | 2015 - 2019]]
)
#v(2pt)
  - GPA: 3.8
  - Deans List
#v(8pt)

#text(size: 11pt, weight: "bold")[CERTIFICATIONS]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
  - *AWS Certified* - Amazon (2022)
#v(8pt)

#text(size: 11pt, weight: "bold")[ACHIEVEMENTS]
#v(2pt)
#line(length: 100%, stroke: 0.5pt + black)
#v(4pt)
  - Won hackathon 2021
  - Published research paper
