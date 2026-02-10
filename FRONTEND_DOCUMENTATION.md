# ATS Resume Editor - Frontend Documentation

## Overview

Complete two-pane resume editor with live preview and PDF export functionality.

## Architecture

### Data Flow

```
PDF Upload → Backend API → optimizedResume JSON → React State → Editor + Preview
                                                                        ↓
                                                                   PDF Export
```

### State Management

- Single source of truth: `resumeData` state in main page
- Unidirectional data flow
- All edits update central state
- Preview re-renders on state change

## Components Structure

```
app/resume-editor/page.tsx           Main page (state management)
├── PdfUpload.tsx                    File upload with drag-drop
├── ResumeEditor.tsx                 Left panel wrapper
│   └── editors/
│       ├── ProfileEditor.tsx        Name + summary
│       ├── ContactEditor.tsx        Email, phone, links
│       ├── SkillsEditor.tsx         Skills by category
│       ├── EducationEditor.tsx      Education entries
│       ├── ExperienceEditor.tsx     Work experience
│       ├── ProjectsEditor.tsx       Projects
│       └── AchievementsEditor.tsx   Achievements + certs
└── ResumePreview.tsx                Right panel live preview
```

## Key Features

### 1. PDF Upload
- Drag and drop or click to upload
- PDF validation
- Loading state during processing
- Error handling

### 2. Section Editors
Each editor supports:
- Add new entries
- Edit existing entries
- Delete entries
- Real-time state updates

### 3. Live Preview
- LaTeX-inspired styling
- Times New Roman font
- Single-column layout
- Section dividers
- Two-column subheadings
- ATS-safe rendering

### 4. PDF Export
- Uses backend `/api/generate-pdf`
- Downloads as `{Name}_Resume.pdf`
- Preserves formatting
- ATS-compatible

## Component Details

### Main Page (`page.tsx`)

State:
```typescript
resumeData: ResumeJSON | null
isLoading: boolean
```

Key functions:
- `handleResumeLoaded(data)` - Set initial resume data
- `handleResumeUpdate(data)` - Update resume data
- `handleDownloadPdf()` - Export to PDF

### PdfUpload Component

Props:
- `onResumeLoaded: (data: ResumeJSON) => void`

Features:
- Drag-drop area
- File input fallback
- Upload progress
- Error display

### ResumeEditor Component

Props:
- `resumeData: ResumeJSON`
- `onUpdate: (data: ResumeJSON) => void`

Features:
- Tab navigation between sections
- Active section highlighting
- Pass-through updates to parent

### Section Editors

Common pattern:
```typescript
interface EditorProps {
  [sectionData]: SectionType;
  onUpdate: (updates: Partial<ResumeJSON>) => void;
}
```

Update pattern:
```typescript
onUpdate({ [sectionKey]: updatedValue })
```

### ResumePreview Component

Props:
- `resumeData: ResumeJSON`

Features:
- Pure presentation (no state)
- Renders from JSON only
- CSS-based styling
- Conditional rendering

## Styling

### Tailwind Classes
- Layout: `grid`, `flex`, `space-y`, `gap`
- Forms: `border`, `rounded-lg`, `focus:ring-2`
- Colors: `bg-blue-600`, `text-gray-700`
- Interactive: `hover:`, `transition-colors`

### Resume Preview CSS
Location: `app/styles/resume-preview.css`

Key classes:
- `.resume-preview` - Container
- `.resume-header` - Two-column header
- `.resume-section-title` - Section with underline
- `.resume-subheading` - Two-column entry
- `.resume-list` - Bullet points

## API Integration

### Upload Resume
```typescript
POST /api/upload-resume
Body: FormData with 'file'
Response: { success, optimizedResume, ... }
```

### Generate PDF
```typescript
POST /api/generate-pdf
Body: { optimizedResume: ResumeJSON }
Response: PDF binary
```

## Real-Time Sync

### How it works:
1. User edits field in editor
2. `onChange` triggers
3. Editor calls `onUpdate()`
4. Parent updates `resumeData` state
5. React re-renders preview
6. Preview reflects change instantly

### Controlled Components
All inputs use:
```typescript
value={data.field}
onChange={(e) => onUpdate({ field: e.target.value })}
```

## Add/Remove Patterns

### Add Entry
```typescript
const newEntry = { ...defaultValues };
onUpdate({ section: [...section, newEntry] });
```

### Remove Entry
```typescript
onUpdate({ section: section.filter((_, i) => i !== index) });
```

### Update Entry
```typescript
onUpdate({
  section: section.map((item, i) =>
    i === index ? { ...item, field: value } : item
  )
});
```

## Navigation

Access editor at: `/resume-editor`

## Responsive Design

### Desktop (lg+)
- Two-column grid
- Sticky panels
- Fixed height with scroll

### Mobile/Tablet
- Single column stack
- Full height panels
- Natural scroll

## Error Handling

### Upload Errors
- File type validation
- API error display
- User-friendly messages

### Form Validation
- Required field checks
- Format validation
- Inline error display

## Future Enhancements

Potential additions:
- Undo/redo functionality
- Auto-save drafts
- Template selection
- Real-time collaboration
- Export to Word
- Multiple resume versions
- ATS score display

## Performance Considerations

### Optimizations
- Controlled component updates
- Conditional rendering
- CSS-only styling (no JS animations)
- Lazy loading (if needed)

### Potential Issues
- Large resume data (100+ entries)
- Frequent re-renders
- PDF generation time

### Solutions
- Debounce input updates
- Memoize preview component
- Loading indicators
- Virtual scrolling (if needed)

## Testing Checklist

- [ ] Upload PDF successfully
- [ ] Edit each section
- [ ] Add/remove entries
- [ ] Preview updates live
- [ ] Download PDF works
- [ ] PDF matches preview
- [ ] ATS can parse PDF
- [ ] Responsive on mobile
- [ ] Error states display
- [ ] Empty states handled

## Deployment Notes

### Environment Variables
None required (backend handled separately)

### Build Command
```bash
npm run build
```

### Production Considerations
- Enable error tracking
- Add analytics
- Implement rate limiting
- Add file size limits
- Optimize bundle size
