// ATS-Safe Resume Template
// Single-column, professional layout for Applicant Tracking Systems

#set page(
  paper: "a4",
  margin: (x: 18mm, y: 15mm)
)

#set text(
  font: "Times New Roman",
  size: 10.5pt,
  fill: black
)

#set par(
  justify: true,
  leading: 0.55em
)

#set list(
  indent: 20pt,
  body-indent: 5pt,
  spacing: 0.35em
)

// Helper function to create section headers
#let section-header(title) = {
  v(0.5em)
  text(
    size: 11pt,
    weight: "bold",
    smallcaps(title)
  )
  v(-0.3em)
  line(length: 100%, stroke: 1.5pt + black)
  v(0.4em)
}

// Helper for subheadings (job title, degree, etc.)
#let subheading(left, right) = {
  grid(
    columns: (1fr, auto),
    column-gutter: 10pt,
    align: (left, right),
    [
      #text(weight: "bold", size: 10.5pt, left.title)
      #if left.subtitle != "" [
        \ #text(style: "italic", size: 9.5pt, left.subtitle)
      ]
    ],
    [
      #text(size: 9.5pt, right.location)
      #if right.date != "" [
        \ #text(style: "italic", size: 9.5pt, right.date)
      ]
    ]
  )
  v(0.15em)
}

// Main document starts here
// ==============================================

// HEADER SECTION
#grid(
  columns: (1fr, 1fr),
  column-gutter: 15pt,
  align: (left, right),
  [
    #text(size: 18pt, weight: "bold", tracking: 0.5pt, "Rishikesh Kumar Yadav")
    #if "Siwan, India" != "" [
      \ #text(size: 9.5pt, "Siwan, India")
    ]
  ],
  [
    #if "mr.rishikesh2\@gmail.com" != "" [
      #text(size: 9.5pt)[Email: #link("mailto:" + "mr.rishikesh2\@gmail.com")["mr.rishikesh2\@gmail.com"]]
    ]
    #if "+91 98016 90166" != "" [
      \ #text(size: 9.5pt)[Mobile: "+91 98016 90166"]
    ]
    #if "linkedin.com/in/rishikesh-yadav-a059482b0" != "" [
      \ #text(size: 9.5pt)[#link("linkedin.com/in/rishikesh-yadav-a059482b0")[LinkedIn]]
    ]
    #if "github.com/mr-rishikesh" != "" [
      \ #text(size: 9.5pt)[#link("github.com/mr-rishikesh")[GitHub]]
    ]
    #if "" != "" [
      \ #text(size: 9.5pt)[#link("")[Portfolio]]
    ]
  ]
)

#v(-0.4em)
#line(length: 100%, stroke: 1.5pt + black)
#v(0.5em)

// PROFILE SUMMARY
#if "Highly motivated and experienced tech lead with 2+ years of experience in leading communities and developing projects. Skilled in Java, JavaScript, HTML, CSS, C, C++, TypeScript, and Python. Proven track record of promoting open-source culture and mentoring first-time contributors." != "" [
  #par(justify: true, leading: 0.6em)[
    #text(size: 10pt, "Highly motivated and experienced tech lead with 2+ years of experience in leading communities and developing projects. Skilled in Java, JavaScript, HTML, CSS, C, C++, TypeScript, and Python. Proven track record of promoting open-source culture and mentoring first-time contributors.")
  ]
  #v(0.5em)
]

// EDUCATION SECTION
#if true [
  #section-header("Education")
    #subheading(
    (title: "JK Institute of Applied Physics and Technology", subtitle: "Bachelor of Technology - Computer Science"),
    (location: "Prayagraj, India", date: "2023 - Present")
  )
  #list(
    tight: false,
    ["GPA: 8.3"]
  )
  #v(0.4em)

  #subheading(
    (title: "D.S.Inter College Siwan Bihar", subtitle: "Intermediate Class 12th"),
    (location: "Siwan, India", date: "2020 - 2022")
  )
  #list(
    tight: false,
    ["79%"]
  )
  #v(0.4em)

]

// SKILLS SECTION
#if true [
  #section-header("Skills")
    #text(size: 9.5pt)[*Programming Languages:* "Java", "JavaScript", "HTML", "CSS", "C", "C++", "TypeScript", "Python"]
  #v(0.2em)
  #text(size: 9.5pt)[*Frameworks / Libraries:* "Node.js", "MySQL", "Express", "MongoDb", "React", "Prisma"]
  #v(0.2em)
  #text(size: 9.5pt)[*Tools & Technologies:* "Git", "Github", "VS Code", "Windows", "Linux"]
  #v(0.2em)
  #text(size: 9.5pt)[*Soft Skills:* "Public Speaking", "Leadership", "Creative Writing"]

]

// EXPERIENCE SECTION
#if true [
  #section-header("Experience")
    #subheading(
    (title: "Google Developer Groups (GDG) on Campus JKIAPT", subtitle: "Tech Lead"),
    (location: "", date: "September 2025 - Present")
  )
  #list(
    tight: false,
    ["Promoted from Active Member to Tech Lead after 2 years of contributions to GDG."],
    ["Led a community of 100+ student developers, organizing Contests, hackathons, and Google Cloud study jams."],
    ["Mentored peers in building projects on Web and AI/ML, improving their problem-solving and coding skills."],
    ["Collaborated with GDG organizers and industry experts to host events with 100+ attendees"]
  )
  #v(0.4em)

  #subheading(
    (title: "GirlScript Summer of Code (GSSoC)", subtitle: "Project Admin"),
    (location: "", date: "June 2025 - Present")
  )
  #list(
    tight: false,
    ["Guided 8+ contributors in building and scaling open-source projects under GSSoC."],
    ["Reviewed and merged 26+ pull requests, ensuring high-quality, maintainable, and well-documented code."],
    ["Created contribution guidelines, assigned issues, and streamlined onboarding for new contributors."],
    ["Mentored developers on Git, GitHub workflows, and collaborative open-source practices, boosting project efficiency and contributor growth."]
  )
  #v(0.4em)

  #subheading(
    (title: "GirlScript Summer of Code", subtitle: "Campus Ambassador"),
    (location: "", date: "June 2025 - Present")
  )
  #list(
    tight: false,
    ["Represented GSSoC on campus, promoting open-source culture and mentoring first-time contributors"],
    ["Organized sessions and events to boost participation and community engagement"],
    ["Acted as a bridge between GSSoC core team and campus tech community"]
  )
  #v(0.4em)

]

// PROJECTS SECTION
#if true [
  #section-header("Projects")
    #subheading(
    (title: "FlashChat – Real-Time Chat Web App", subtitle: ""),
    (location: "", date: "April 2025 - ")
  )
  #list(
    tight: false,
    ["Built a full-stack real-time chat app using React.js, Node.js, Express, MongoDB, and Socket.io."],
    ["Implemented secure JWT auth with bcrypt, and message storage via Mongoose."],
    ["Designed responsive UI with Tailwind CSS and deployed the app on Render using GitHub ."]
  )
  #v(0.4em)

  #subheading(
    (title: "AI Code Reviewer – AI-Powered Code Review Tool", subtitle: ""),
    (location: "", date: "March 2025 - ")
  )
  #list(
    tight: false,
    ["Built a web app to perform AI-based code reviews using the Gemini API for real-time feedback."],
    ["Analysed code for syntax errors, logic issues, and optimization across multiple languages."],
    ["Delivered structured code improvement feedback with best practices and explanations."],
    ["Supported JavaScript, Python, C++, and more with a scalable architecture."]
  )
  #v(0.4em)

]

// CERTIFICATIONS SECTION
#if false [
  #section-header("Certifications")

]

// ACHIEVEMENTS SECTION
#if true [
  #section-header("Achievements")
  #list(
    tight: false,
    ["1st Place – CodeFront Hackathon (Apr 2025): Built an AI-powered mock interview platform with React.js, Firebase, Clerk, and Gemini AI."],
    ["1600+ rating on leetcode & 1120+ \@codeforces 450+ Problems Solved on various coding platform"],
    ["GDG on Campus – Active Member (2023–2024): Supported events/workshops, secured 4th place in a coding contest"]
  )

]
