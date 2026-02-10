'use client';

import type { ResumeJSON } from '@/utils/validateResumeJson';

interface ProfileEditorProps {
  name: string;
  summary: string;
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function ProfileEditor({ name, summary, onUpdate }: ProfileEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => onUpdate({ profile_summary: e.target.value })}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Write a compelling summary that highlights your key skills and experience..."
        />
        <p className="text-xs text-gray-500 mt-1">
          2-4 sentences recommended
        </p>
      </div>
    </div>
  );
}
