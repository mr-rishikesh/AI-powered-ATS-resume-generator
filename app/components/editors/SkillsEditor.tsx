'use client';

import { useState } from 'react';
import type { ResumeJSON, ResumeSkills } from '@/utils/validateResumeJson';

interface SkillsEditorProps {
  skills: ResumeSkills;
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function SkillsEditor({ skills, onUpdate }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({
    languages: '',
    frameworks: '',
    tools: '',
    soft_skills: '',
  });

  const handleAddSkill = (category: keyof ResumeSkills) => {
    const skill = newSkill[category].trim();
    if (!skill) return;

    onUpdate({
      skills: {
        ...skills,
        [category]: [...skills[category], skill],
      },
    });

    setNewSkill({ ...newSkill, [category]: '' });
  };

  const handleRemoveSkill = (category: keyof ResumeSkills, index: number) => {
    onUpdate({
      skills: {
        ...skills,
        [category]: skills[category].filter((_, i) => i !== index),
      },
    });
  };

  const renderSkillCategory = (
    category: keyof ResumeSkills,
    label: string,
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill[category]}
            onChange={(e) => setNewSkill({ ...newSkill, [category]: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(category)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={placeholder}
          />
          <button
            onClick={() => handleAddSkill(category)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills[category].map((skill, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
            >
              <span>{skill}</span>
              <button
                onClick={() => handleRemoveSkill(category, index)}
                className="text-gray-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderSkillCategory('languages', 'Programming Languages', 'e.g., Python, JavaScript')}
      {renderSkillCategory('frameworks', 'Frameworks / Libraries', 'e.g., React, Django')}
      {renderSkillCategory('tools', 'Tools & Technologies', 'e.g., Git, Docker')}
      {renderSkillCategory('soft_skills', 'Soft Skills', 'e.g., Leadership, Communication')}
    </div>
  );
}
