/**
 * Validates and sanitizes resume JSON to ensure it matches the expected schema
 */

export interface ResumeContact {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
}

export interface ResumeSkills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  soft_skills: string[];
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  start: string;
  end: string;
  details: string[];
}

export interface Experience {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface Project {
  name: string;
  role: string;
  start: string;
  end: string;
  url: string;
  bullets: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface ResumeJSON {
  name: string;
  profile_summary: string;
  contact: ResumeContact;
  skills: ResumeSkills;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  achievements: string[];
}

/**
 * Validates and normalizes resume JSON structure
 * @param data - Raw parsed JSON object
 * @returns Validated and sanitized resume JSON
 */
export function validateResumeJson(data: any): ResumeJSON {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid resume data: must be an object");
  }

  // Helper function to ensure string
  const ensureString = (val: any, defaultVal = ""): string => {
    return typeof val === 'string' ? val : defaultVal;
  };

  // Helper function to ensure array
  const ensureArray = (val: any): any[] => {
    return Array.isArray(val) ? val : [];
  };

  // Helper function to ensure string array
  const ensureStringArray = (val: any): string[] => {
    if (!Array.isArray(val)) return [];
    return val.filter(item => typeof item === 'string' && item.trim().length > 0);
  };

  // Validate and build contact object
  const contact: ResumeContact = {
    email: ensureString(data.contact?.email),
    phone: ensureString(data.contact?.phone),
    location: ensureString(data.contact?.location),
    github: ensureString(data.contact?.github),
    linkedin: ensureString(data.contact?.linkedin),
    website: ensureString(data.contact?.website),
  };

  // Validate and build skills object
  const skills: ResumeSkills = {
    languages: ensureStringArray(data.skills?.languages),
    frameworks: ensureStringArray(data.skills?.frameworks),
    tools: ensureStringArray(data.skills?.tools),
    soft_skills: ensureStringArray(data.skills?.soft_skills),
  };

  // Validate education array
  const education: Education[] = ensureArray(data.education).map((edu: any) => ({
    institution: ensureString(edu?.institution),
    location: ensureString(edu?.location),
    degree: ensureString(edu?.degree),
    start: ensureString(edu?.start),
    end: ensureString(edu?.end),
    details: ensureStringArray(edu?.details),
  }));

  // Validate experience array
  const experience: Experience[] = ensureArray(data.experience).map((exp: any) => ({
    company: ensureString(exp?.company),
    title: ensureString(exp?.title),
    location: ensureString(exp?.location),
    start: ensureString(exp?.start),
    end: ensureString(exp?.end),
    bullets: ensureStringArray(exp?.bullets),
  }));

  // Validate projects array
  const projects: Project[] = ensureArray(data.projects).map((proj: any) => ({
    name: ensureString(proj?.name),
    role: ensureString(proj?.role),
    start: ensureString(proj?.start),
    end: ensureString(proj?.end),
    url: ensureString(proj?.url),
    bullets: ensureStringArray(proj?.bullets),
  }));

  // Validate certifications array
  const certifications: Certification[] = ensureArray(data.certifications).map((cert: any) => ({
    name: ensureString(cert?.name),
    issuer: ensureString(cert?.issuer),
    year: ensureString(cert?.year),
  }));

  // Build validated resume object
  const validatedResume: ResumeJSON = {
    name: ensureString(data.name, "Name Not Found"),
    profile_summary: ensureString(data.profile_summary),
    contact,
    skills,
    education,
    experience,
    projects,
    certifications,
    achievements: ensureStringArray(data.achievements),
  };

  // Log validation summary
  console.log("✅ Resume validation complete:");
  console.log(`  - Name: ${validatedResume.name}`);
  console.log(`  - Experience entries: ${validatedResume.experience.length}`);
  console.log(`  - Education entries: ${validatedResume.education.length}`);
  console.log(`  - Projects: ${validatedResume.projects.length}`);
  console.log(`  - Skills categories: ${Object.keys(skills).filter(k => skills[k as keyof ResumeSkills].length > 0).length}`);

  return validatedResume;
}

/**
 * Checks if the resume has minimum required information
 * @param resume - Validated resume JSON
 * @returns true if resume has sufficient data
 */
export function hasMinimumResumeData(resume: ResumeJSON): boolean {
  const hasName: boolean = !!(resume.name && resume.name !== "Name Not Found");
  const hasContact: boolean = !!(resume.contact.email || resume.contact.phone);
  const hasExperience: boolean = resume.experience.length > 0;
  const hasEducation: boolean = resume.education.length > 0;
  const hasSkills: boolean = resume.skills.languages.length > 0 ||
                             resume.skills.frameworks.length > 0 ||
                             resume.skills.tools.length > 0;

  return hasName && (hasContact || hasExperience || hasEducation || hasSkills);
}
