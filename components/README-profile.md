# User Profile Component

The `UserProfile` component displays comprehensive user information with avatar, role badges, and relevant details.

## Features

- **Avatar Display**: Shows user initials or profile image
- **Role-based Styling**: Different colors for student, faculty, and admin roles
- **Flexible Layout**: Supports both full and compact views
- **Current Semester**: Automatically calculates and displays current academic semester
- **Dashboard Integration**: Optional dashboard button for navigation
- **Responsive Design**: Adapts to different screen sizes

## Usage

### Full Profile View
```tsx
import { UserProfile } from "@/components/user-profile"

<UserProfile 
  profile={userProfile} 
  showDashboardButton={true} 
  compact={false} 
/>
```

### Compact Profile View (for headers/sidebars)
```tsx
<UserProfile 
  profile={userProfile} 
  compact={true} 
  showDashboardButton={false} 
/>
```

## Profile Interface

```typescript
interface UserProfile {
  id: string                    // User's unique identifier
  email: string                 // User's email address
  full_name: string            // User's display name
  role: "student" | "faculty" | "admin"  // User's role
  student_id?: string          // Student ID (for students)
  department?: string          // Department name
  created_at: string           // Account creation date
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `profile` | `UserProfile` | Required | User profile data |
| `showDashboardButton` | `boolean` | `true` | Show/hide dashboard navigation button |
| `compact` | `boolean` | `false` | Use compact layout for headers/sidebars |

## Role Colors

- **Student**: Blue (`bg-blue-100 text-blue-800`)
- **Faculty**: Green (`bg-green-100 text-green-800`) 
- **Admin**: Purple (`bg-purple-100 text-purple-800`)

## Semester Calculation

The component automatically calculates the current semester:
- **Spring**: January - May
- **Summer**: June - August  
- **Fall**: September - December

## Integration Points

1. **Root Page** (`app/page.tsx`): Shows full profile when user is logged in
2. **Header** (`app/layout.tsx`): Shows compact profile in navigation
3. **Profile Page** (`app/profile/page.tsx`): Dedicated profile management page
4. **Dashboard**: Can be integrated into dashboard layouts

## Dependencies

- `@/components/ui/avatar` - Avatar component
- `@/components/ui/card` - Card layout components
- `@/components/ui/badge` - Role badges
- `@/components/ui/button` - Action buttons
- `lucide-react` - Icons
- `next/link` - Navigation

## Styling

Uses Tailwind CSS classes with shadcn/ui components for consistent design system integration.