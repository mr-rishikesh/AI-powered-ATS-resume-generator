'use client';

import { useState } from 'react';
import type { ResumeJSON } from '@/utils/validateResumeJson';
import ProfileEditor from './editors/ProfileEditor';
import ContactEditor from './editors/ContactEditor';
import SkillsEditor from './editors/SkillsEditor';
import EducationEditor from './editors/EducationEditor';
import ExperienceEditor from './editors/ExperienceEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import AchievementsEditor from './editors/AchievementsEditor';

interface ResumeEditorProps {
  resumeData: ResumeJSON;
  onUpdate: (data: ResumeJSON) => void;
}

type Section = 'profile' | 'contact' | 'skills' | 'education' | 'experience' | 'projects' | 'achievements';

export default function ResumeEditor({ resumeData, onUpdate }: ResumeEditorProps) {
  const [activeSection, setActiveSection] = useState<Section>('profile');

  const sections: { id: Section; label: string }[] = [
    { id: 'profile', label: 'Profile Summary' },
    { id: 'contact', label: 'Contact Info' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'achievements', label: 'Achievements' },
  ];

  const handleUpdate = (updates: Partial<ResumeJSON>) => {
    onUpdate({ ...resumeData, ...updates });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Section Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-1 p-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors
                ${activeSection === section.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Section Content */}
      <div className="p-6">
        {activeSection === 'profile' && (
          <ProfileEditor
            name={resumeData.name}
            summary={resumeData.profile_summary}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'contact' && (
          <ContactEditor
            contact={resumeData.contact}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'skills' && (
          <SkillsEditor
            skills={resumeData.skills}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'education' && (
          <EducationEditor
            education={resumeData.education}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'experience' && (
          <ExperienceEditor
            experience={resumeData.experience}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'projects' && (
          <ProjectsEditor
            projects={resumeData.projects}
            onUpdate={handleUpdate}
          />
        )}
        {activeSection === 'achievements' && (
          <AchievementsEditor
            achievements={resumeData.achievements}
            certifications={resumeData.certifications}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
}
