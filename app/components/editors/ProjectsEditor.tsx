'use client';

import type { ResumeJSON, Project } from '@/utils/validateResumeJson';

interface ProjectsEditorProps {
  projects: Project[];
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function ProjectsEditor({ projects, onUpdate }: ProjectsEditorProps) {
  const handleAdd = () => {
    const newEntry: Project = {
      name: '',
      role: '',
      start: '',
      end: '',
      url: '',
      bullets: [],
    };
    onUpdate({ projects: [...projects, newEntry] });
  };

  const handleUpdate = (index: number, field: keyof Project, value: any) => {
    const updated = projects.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );
    onUpdate({ projects: updated });
  };

  const handleDelete = (index: number) => {
    onUpdate({ projects: projects.filter((_, i) => i !== index) });
  };

  const handleAddBullet = (index: number, bullet: string) => {
    if (!bullet.trim()) return;
    const updated = projects.map((proj, i) =>
      i === index ? { ...proj, bullets: [...proj.bullets, bullet] } : proj
    );
    onUpdate({ projects: updated });
  };

  const handleRemoveBullet = (projIndex: number, bulletIndex: number) => {
    const updated = projects.map((proj, i) =>
      i === projIndex
        ? { ...proj, bullets: proj.bullets.filter((_, j) => j !== bulletIndex) }
        : proj
    );
    onUpdate({ projects: updated });
  };

  const handleUpdateBullet = (projIndex: number, bulletIndex: number, value: string) => {
    const updated = projects.map((proj, i) =>
      i === projIndex
        ? {
            ...proj,
            bullets: proj.bullets.map((b, j) => (j === bulletIndex ? value : b)),
          }
        : proj
    );
    onUpdate({ projects: updated });
  };

  return (
    <div className="space-y-4">
      {projects.map((proj, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">
              {proj.name || 'New Project Entry'}
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
              value={proj.name}
              onChange={(e) => handleUpdate(index, 'name', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Project Name"
            />
            <input
              type="text"
              value={proj.role}
              onChange={(e) => handleUpdate(index, 'role', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Your Role"
            />
          </div>

          <input
            type="url"
            value={proj.url}
            onChange={(e) => handleUpdate(index, 'url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Project URL (optional)"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={proj.start}
              onChange={(e) => handleUpdate(index, 'start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Start (e.g., 2022)"
            />
            <input
              type="text"
              value={proj.end}
              onChange={(e) => handleUpdate(index, 'end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="End (e.g., 2023)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Project Details
            </label>
            <div className="space-y-2">
              {proj.bullets.map((bullet, bulletIndex) => (
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
                  const bullet = prompt('Enter project detail:');
                  if (bullet) handleAddBullet(index, bullet);
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
        + Add Project
      </button>
    </div>
  );
}
