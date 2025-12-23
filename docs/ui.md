# UI Coding Standards

This document outlines the UI coding standards and conventions for the Lifting Diary Course project. **All developers must strictly adhere to these guidelines.**

---

## UI Component Library

### shadcn/ui Components Only

**CRITICAL RULE:** This project uses **shadcn/ui** exclusively for all UI components.

- ✅ **DO:** Use shadcn/ui components for all UI needs
- ❌ **DO NOT:** Create custom UI components
- ❌ **DO NOT:** Use other UI libraries (Material-UI, Ant Design, Chakra UI, etc.)
- ❌ **DO NOT:** Build custom buttons, inputs, cards, dialogs, or any other UI primitives

### Adding shadcn/ui Components

When you need a new UI component:

1. Install it via the shadcn/ui CLI:
   ```bash
   npx shadcn@latest add [component-name]
   ```

2. Use the component in your code:
   ```tsx
   import { Button } from "@/components/ui/button"

   export default function MyComponent() {
     return <Button variant="default">Click me</Button>
   }
   ```

### Available shadcn/ui Components

Common components you'll use (install as needed):
- `button` - Buttons with various variants
- `card` - Cards with header, content, footer
- `input` - Form inputs
- `label` - Form labels
- `dialog` - Modal dialogs
- `dropdown-menu` - Dropdown menus
- `form` - Form components with react-hook-form integration
- `table` - Data tables
- `badge` - Status badges
- `calendar` - Date picker calendar
- `select` - Select dropdowns
- `toast` - Toast notifications
- `tabs` - Tabbed interfaces
- `sheet` - Slide-over panels
- `alert` - Alert messages

For a complete list, visit: https://ui.shadcn.com/docs/components

---

## Date Formatting

### Library: date-fns

All date formatting in this project must use **date-fns**.

- ✅ **DO:** Use date-fns for all date operations and formatting
- ❌ **DO NOT:** Use moment.js, dayjs, or native Date methods for formatting

### Standard Date Format

**Required Format:** `[ordinal day] [abbreviated month] [year]`

**Examples:**
- `1st Sep 2025`
- `2nd Aug 2025`
- `3rd Jan 2026`
- `4th Jun 2024`
- `21st Dec 2024`
- `22nd Nov 2024`
- `23rd Oct 2024`

### Implementation

#### Installation
```bash
npm install date-fns
```

#### Usage Example

```tsx
import { format } from 'date-fns'

// Helper function for ordinal suffix
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

// Format date according to project standards
function formatStandardDate(date: Date): string {
  const day = format(date, 'd')
  const month = format(date, 'MMM')
  const year = format(date, 'yyyy')
  return `${day}${getOrdinalSuffix(Number(day))} ${month} ${year}`
}

// Example usage
const myDate = new Date('2025-09-01')
console.log(formatStandardDate(myDate)) // "1st Sep 2025"
```

#### Recommended: Create a Utility Function

Create `lib/utils/date.ts`:

```tsx
import { format } from 'date-fns'

export function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

export function formatDate(date: Date | string | number): string {
  const dateObj = new Date(date)
  const day = format(dateObj, 'd')
  const month = format(dateObj, 'MMM')
  const year = format(dateObj, 'yyyy')
  return `${day}${getOrdinalSuffix(Number(day))} ${month} ${year}`
}
```

Then import and use throughout the app:

```tsx
import { formatDate } from '@/lib/utils/date'

const formattedDate = formatDate(new Date()) // "23rd Dec 2024"
```

---

## Summary

### Golden Rules

1. **UI Components:** shadcn/ui only - no exceptions
2. **Date Formatting:** date-fns with ordinal day format
3. **No Custom Components:** Use what shadcn/ui provides
4. **Consistency:** Follow these standards in every file

### Before You Code

- [ ] Need a UI component? Check shadcn/ui first
- [ ] Need to format a date? Use date-fns with standard format
- [ ] Tempted to create a custom component? Don't. Use shadcn/ui instead

---

**Questions?** Refer to:
- shadcn/ui documentation: https://ui.shadcn.com
- date-fns documentation: https://date-fns.org
