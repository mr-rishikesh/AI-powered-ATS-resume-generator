'use client';

import { useState } from 'react';
import type { ResumeJSON, Experience } from '@/utils/validateResumeJson';

interface ExperienceEditorProps {
  experience: Experience[];
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function ExperienceEditor({ experience, onUpdate }: ExperienceEditorProps) {
  const handleAdd = () => {
    const newEntry: Experience = {
      company: '',
      title: '',
      location: '',
      start: '',
      end: '',
      bullets: [],
    };
    onUpdate({ experience: [...experience, newEntry] });
  };

  const handleUpdate = (index: number, field: keyof Experience, value: any) => {
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onUpdate({ experience: updated });
  };

  const handleDelete = (index: number) => {
    onUpdate({ experience: experience.filter((_, i) => i !== index) });
  };

  const handleAddBullet = (index: number, bullet: string) => {
    if (!bullet.trim()) return;
    const updated = experience.map((exp, i) =>
      i === index ? { ...exp, bullets: [...exp.bullets, bullet] } : exp
    );
    onUpdate({ experience: updated });
  };

  const handleRemoveBullet = (expIndex: number, bulletIndex: number) => {
    const updated = experience.map((exp, i) =>
      i === expIndex
        ? { ...exp, bullets: exp.bullets.filter((_, j) => j !== bulletIndex) }
        : exp
    );
    onUpdate({ experience: updated });
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = experience.map((exp, i) =>
      i === expIndex
        ? {
            ...exp,
            bullets: exp.bullets.map((b, j) => (j === bulletIndex ? value : b)),
          }
        : exp
    );
    onUpdate({ experience: updated });
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">
              {exp.company || 'New Experience Entry'}
            </h3>
            <button
              onClick={() => handleDelete(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={exp.company}
              onChange={(e) => handleUpdate(index, 'company', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Company"
            />
            <input
              type="text"
              value={exp.location}
              onChange={(e) => handleUpdate(index, 'location', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Location"
            />
          </div>

          <input
            type="text"
            value={exp.title}
            onChange={(e) => handleUpdate(index, 'title', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Job Title"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={exp.start}
              onChange={(e) => handleUpdate(index, 'start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Start (e.g., Jan 2020)"
            />
            <input
              type="text"
              value={exp.end}
              onChange={(e) => handleUpdate(index, 'end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="End (e.g., Present)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Responsibilities & Achievements
            </label>
            <div className="space-y-2">
              {exp.bullets.map((bullet, bulletIndex) => (
                <div key={bulletIndex} className="flex gap-2">
                  <textarea
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(index, bulletIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                    rows={2}
                  />
                  <button
                    onClick={() => handleRemoveBullet(index, bulletIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const bullet = prompt('Enter responsibility/achievement:');
                  if (bullet) handleAddBullet(index, bullet);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add bullet point
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add Experience
      </button>
    </div>
  );
}
