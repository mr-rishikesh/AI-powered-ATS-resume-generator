'use client';

import { useState } from 'react';
import type { ResumeJSON, Education } from '@/utils/validateResumeJson';

interface EducationEditorProps {
  education: Education[];
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function EducationEditor({ education, onUpdate }: EducationEditorProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    const newEntry: Education = {
      institution: '',
      location: '',
      degree: '',
      start: '',
      end: '',
      details: [],
    };
    onUpdate({ education: [...education, newEntry] });
    setEditIndex(education.length);
  };

  const handleUpdate = (index: number, field: keyof Education, value: any) => {
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    onUpdate({ education: updated });
  };

  const handleDelete = (index: number) => {
    onUpdate({ education: education.filter((_, i) => i !== index) });
    setEditIndex(null);
  };

  const handleAddDetail = (index: number, detail: string) => {
    if (!detail.trim()) return;
    const updated = education.map((edu, i) =>
      i === index ? { ...edu, details: [...edu.details, detail] } : edu
    );
    onUpdate({ education: updated });
  };

  const handleRemoveDetail = (eduIndex: number, detailIndex: number) => {
    const updated = education.map((edu, i) =>
      i === eduIndex
        ? { ...edu, details: edu.details.filter((_, j) => j !== detailIndex) }
        : edu
    );
    onUpdate({ education: updated });
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">
              {edu.institution || 'New Education Entry'}
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
              value={edu.institution}
              onChange={(e) => handleUpdate(index, 'institution', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Institution"
            />
            <input
              type="text"
              value={edu.location}
              onChange={(e) => handleUpdate(index, 'location', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Location"
            />
          </div>

          <input
            type="text"
            value={edu.degree}
            onChange={(e) => handleUpdate(index, 'degree', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Degree"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={edu.start}
              onChange={(e) => handleUpdate(index, 'start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Start (e.g., 2018)"
            />
            <input
              type="text"
              value={edu.end}
              onChange={(e) => handleUpdate(index, 'end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="End (e.g., 2022)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Details (GPA, Honors, etc.)
            </label>
            <div className="space-y-2">
              {edu.details.map((detail, detailIndex) => (
                <div key={detailIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={detail}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const updated = education.map((eduItem, i) =>
                        i === index
                          ? {
                              ...eduItem,
                              details: eduItem.details.map((d, j) =>
                                j === detailIndex ? newValue : d
                              ),
                            }
                          : eduItem
                      );
                      onUpdate({ education: updated });
                    }}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={() => handleRemoveDetail(index, detailIndex)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const detail = prompt('Enter detail:');
                  if (detail) handleAddDetail(index, detail);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add detail
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + Add Education
      </button>
    </div>
  );
}
