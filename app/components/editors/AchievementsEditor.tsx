'use client';

import { useState } from 'react';
import type { ResumeJSON, Certification } from '@/utils/validateResumeJson';

interface AchievementsEditorProps {
  achievements: string[];
  certifications: Certification[];
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function AchievementsEditor({
  achievements,
  certifications,
  onUpdate,
}: AchievementsEditorProps) {
  const [newAchievement, setNewAchievement] = useState('');

  const handleAddAchievement = () => {
    if (!newAchievement.trim()) return;
    onUpdate({ achievements: [...achievements, newAchievement] });
    setNewAchievement('');
  };

  const handleRemoveAchievement = (index: number) => {
    onUpdate({ achievements: achievements.filter((_, i) => i !== index) });
  };

  const handleUpdateAchievement = (index: number, value: string) => {
    onUpdate({
      achievements: achievements.map((a, i) => (i === index ? value : a)),
    });
  };

  const handleAddCertification = () => {
    const newCert: Certification = {
      name: '',
      issuer: '',
      year: '',
    };
    onUpdate({ certifications: [...certifications, newCert] });
  };

  const handleUpdateCertification = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updated = certifications.map((cert, i) =>
      i === index ? { ...cert, [field]: value } : cert
    );
    onUpdate({ certifications: updated });
  };

  const handleRemoveCertification = (index: number) => {
    onUpdate({ certifications: certifications.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Achievements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Achievements & Awards
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAchievement()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Winner of XYZ Hackathon 2023"
            />
            <button
              onClick={handleAddAchievement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex gap-2">
                <textarea
                  value={achievement}
                  onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                  rows={2}
                />
                <button
                  onClick={() => handleRemoveAchievement(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certifications
        </label>
        <div className="space-y-3">
          {certifications.map((cert, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-900">
                  {cert.name || 'New Certification'}
                </span>
                <button
                  onClick={() => handleRemoveCertification(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>

              <input
                type="text"
                value={cert.name}
                onChange={(e) => handleUpdateCertification(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Certification Name"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => handleUpdateCertification(index, 'issuer', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Issuer"
                />
                <input
                  type="text"
                  value={cert.year}
                  onChange={(e) => handleUpdateCertification(index, 'year', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Year"
                />
              </div>
            </div>
          ))}

          <button
            onClick={handleAddCertification}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors text-sm"
          >
            + Add Certification
          </button>
        </div>
      </div>
    </div>
  );
}
