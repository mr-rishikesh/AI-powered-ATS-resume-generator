'use client';

import type { ResumeJSON, ResumeContact } from '@/utils/validateResumeJson';

interface ContactEditorProps {
  contact: ResumeContact;
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}

export default function ContactEditor({ contact, onUpdate }: ContactEditorProps) {
  const handleChange = (field: keyof ResumeContact, value: string) => {
    onUpdate({
      contact: {
        ...contact,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="john.doe@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+1-234-567-8900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <input
          type="text"
          value={contact.location}
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="San Francisco, CA"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          LinkedIn
        </label>
        <input
          type="url"
          value={contact.linkedin}
          onChange={(e) => handleChange('linkedin', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GitHub
        </label>
        <input
          type="url"
          value={contact.github}
          onChange={(e) => handleChange('github', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://github.com/johndoe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Portfolio / Website
        </label>
        <input
          type="url"
          value={contact.website}
          onChange={(e) => handleChange('website', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://johndoe.com"
        />
      </div>
    </div>
  );
}
