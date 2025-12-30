export const resume_template = 
```%------------------------
% General Resume Template
% ATS-friendly | Overleaf-ready
%------------------------

\documentclass[a4paper,20pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[pdftex]{hyperref}
\usepackage{fancyhdr}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

% Margins
\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.45in}
\addtolength{\textheight}{1in}

\urlstyle{rm}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

% Section formatting
\titleformat{\section}{
  \vspace{-10pt}\scshape\raggedright\large
}{}{0em}{}[\titlerule \vspace{-6pt}]

%-------------------------
% Custom Commands
\newcommand{\resumeItem}[2]{
  \item\small{\textbf{#1}{: #2}}
}

\newcommand{\resumeSubheading}[4]{
  \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{#3} & \textit{#4}
    \end{tabular*}
}

\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=*]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

%-----------------------------
%%%%%% RESUME STARTS HERE %%%%%%

\begin{document}

%----------HEADER----------
\begin{tabular*}{\textwidth}{l@{\extracolsep{\fill}}r}
  \textbf{\LARGE <<Full Name>>} & Email: \href{mailto:<<email@example.com>>}{<<email@example.com>>} \\
  \href{<<github_url>>}{GitHub} & Mobile: <<Phone Number>> \\
  \href{<<linkedin_url>>}{LinkedIn} & \href{<<portfolio_url>>}{Portfolio (optional)} \\
\end{tabular*}

%----------EDUCATION----------
\section{Education}
\resumeSubHeadingListStart
  \resumeSubheading
    {<<University / College Name>>}{<<City, Country>>}
    {<<Degree Name>> -- <<Major / Branch>>; GPA: <<X.XX>>}{<<Start Year>> -- <<End Year>>}
  \resumeSubheading
    {<<School / College Name>>}{<<City, Country>>}
    {<<Qualification>> -- <<Score / Percentage>>}{<<Year Range>>}
\resumeSubHeadingListEnd

%----------SKILLS----------
\section{Skills}
\resumeSubHeadingListStart
  \resumeItem{Programming Languages}{<<Languages>>}
  \resumeItem{Frameworks / Libraries}{<<Frameworks>>}
  \resumeItem{Databases}{<<Databases>>}
  \resumeItem{Tools \& Platforms}{<<Tools>>}
  \resumeItem{Core Concepts}{<<CS Fundamentals / Domain Skills>>}
\resumeSubHeadingListEnd

%----------EXPERIENCE----------
\section{Experience}
\resumeSubHeadingListStart
  \resumeSubheading
    {<<Company / Organization Name>>}{<<Location>>}
    {<<Role / Position>>}{<<Start Date>> -- <<End Date>>}
  \resumeItemListStart
    \resumeItem{Responsibility / Impact}
      {<<What you did, quantified impact if possible>>}
    \resumeItem{Technologies Used}
      {<<Tech stack used>>}
  \resumeItemListEnd
\resumeSubHeadingListEnd

%----------PROJECTS----------
\section{Projects}
\resumeSubHeadingListStart
  \resumeItem{<<Project Title>>}
    {<<1–2 line description explaining problem, solution, tech stack>> 
    \href{<<project_link>>}{(Live)} \href{<<github_link>>}{(GitHub)}}
\resumeSubHeadingListEnd

%----------ACHIEVEMENTS----------
\section{Achievements}
\begin{itemize}[leftmargin=*]
  \item <<Achievement with rank / numbers>>
  \item <<Competitive programming rating / certifications>>
\end{itemize}

%----------VOLUNTEER / LEADERSHIP----------
\section{Leadership / Volunteering}
\resumeSubHeadingListStart
  \resumeSubheading
    {<<Organization Name>>}{<<Location>>}
    {<<Role>>}{<<Year Range>>}
  \resumeItemListStart
    \resumeItem{Contribution}
      {<<What you contributed / organized / led>>}
  \resumeItemListEnd
\resumeSubHeadingListEnd

%----------LINKS----------
\section{Links}
\resumeSubHeadingListStart
  \resumeItem{GitHub}{<<github_url>>}
  \resumeItem{LinkedIn}{<<linkedin_url>>}
  \resumeItem{Portfolio}{<<portfolio_url>>}
\resumeSubHeadingListEnd

\end{document}
```