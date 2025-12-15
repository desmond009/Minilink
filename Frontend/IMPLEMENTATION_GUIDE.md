# MiniLink Frontend - Implementation Guide

## Quick Start

### What's New
The entire frontend has been redesigned with a modern, premium SaaS aesthetic featuring:

- **Navbar** - Sticky header with theme toggle and user menu
- **HeroSection** - Animated landing page with feature highlights
- **UrlFormNew** - Modern URL shortening form with QR code support
- **FooterNew** - Professional footer with social links
- **Card, Button, Badge** - Reusable UI components
- **Full Dark/Light Mode** - Seamless theme switching
- **Smooth Animations** - Framer Motion animations throughout

### File Structure

**New Components Created**:
```
components/
├── Navbar.jsx              # New sticky navigation
├── HeroSectionNew.jsx      # New hero section
├── UrlFormNew.jsx          # New URL form with enhanced UI
├── FooterNew.jsx           # New modern footer
├── Card.jsx                # Reusable card component
├── Button.jsx              # Reusable button component
├── Badge.jsx               # Reusable badge component
├── LoadingSpinnerNew.jsx   # Animated loading spinner
├── EmptyState.jsx          # Empty state component
```

**New Pages Created**:
```
pages/
├── HomePageNew.jsx         # New homepage with all sections
```

---

## Component Usage Examples

### 1. Using the Navbar

Already integrated in all pages via `App.jsx`. It automatically handles:
- Dark/Light mode toggle
- User authentication display
- Mobile responsive menu

No props needed - uses `AuthContext` and `ThemeContext`.

### 2. Using the Hero Section

```jsx
import HeroSectionNew from '../components/HeroSectionNew'

<HeroSectionNew />
```

Features animated background, CTA buttons, and feature cards.

### 3. Using the URL Form

```jsx
import UrlFormNew from '../components/UrlFormNew'

<UrlFormNew />
```

Includes:
- Input field with icon
- Loading states
- Result display with copy button
- QR code generation
- Recent links tracking
- Trust badges

### 4. Using the Card Component

```jsx
import Card from '../components/Card'

// Default card
<Card>
  Content here
</Card>

// Elevated card with hover effect
<Card variant="elevated" hover>
  Elevated content
</Card>

// Success state card
<Card variant="success">
  Success message
</Card>

// Glass morphism
<Card variant="glass">
  Transparent content
</Card>

// Gradient card
<Card variant="gradient">
  Gradient content
</Card>
```

### 5. Using the Button Component

```jsx
import Button from '../components/Button'
import { Copy, Share2 } from 'lucide-react'

// Primary button
<Button variant="primary" size="lg">
  Get Started
</Button>

// Button with icon
<Button variant="primary" icon={Copy}>
  Copy Link
</Button>

// Loading state
<Button loading={isLoading}>
  Save
</Button>

// Danger button
<Button variant="danger">
  Delete
</Button>

// Secondary button
<Button variant="secondary">
  Cancel
</Button>

// Ghost button
<Button variant="ghost">
  Learn More
</Button>

// Success button
<Button variant="success">
  Confirm
</Button>
```

### 6. Using the Badge Component

```jsx
import Badge from '../components/Badge'
import { CheckCircle2, AlertCircle } from 'lucide-react'

// Simple badge
<Badge variant="primary">
  Active
</Badge>

// Badge with icon
<Badge variant="success" icon={CheckCircle2}>
  Verified
</Badge>

// Different sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

// Variants: primary, secondary, success, warning, danger
<Badge variant="warning" icon={AlertCircle}>
  Warning
</Badge>
```

### 7. Using the Loading Spinner

```jsx
import LoadingSpinnerNew from '../components/LoadingSpinnerNew'

// Inline spinner
<LoadingSpinnerNew size="md" />

// Full screen spinner
<LoadingSpinnerNew fullScreen={true} />

// Small spinner
<LoadingSpinnerNew size="sm" />
```

### 8. Using Empty State

```jsx
import EmptyState from '../components/EmptyState'
import { LinkIcon } from 'lucide-react'

<EmptyState
  icon={LinkIcon}
  title="No Links Yet"
  description="Start shortening URLs to see them here"
  action={{
    label: "Create First Link",
    href: "/dashboard"
  }}
/>
```

---

## Styling Patterns

### Dark Mode Classes

Always use Tailwind's `dark:` prefix:

```jsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  Content adapts to theme
</div>
```

### Using the Theme Context

```jsx
import { useTheme } from '../context/ThemeContext'

const MyComponent = () => {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <button 
      onClick={toggleTheme}
      className={isDark ? 'text-yellow-400' : 'text-slate-700'}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}
```

### Gradient Text

```jsx
<h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
  Premium Headline
</h1>
```

### Gradient Backgrounds

```jsx
<div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20">
  Content
</div>
```

---

## Animation Patterns

### Using Framer Motion

All components use Framer Motion for smooth animations.

**Fade In Animation**:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

**Hover Effects**:
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

**Staggered Children**:
```jsx
<motion.div>
  {items.map((item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

---

## Form Input Patterns

Standard input styling that respects dark mode:

```jsx
<input
  type="url"
  placeholder="https://example.com"
  className={`
    w-full px-4 py-3 rounded-xl border-2
    transition-all duration-300
    focus:outline-none
    ${isDark
      ? 'bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
    }
  `}
/>
```

---

## Spacing Conventions

**Padding**:
- Small elements: `px-4 py-2`
- Medium elements: `px-6 py-3`
- Large elements: `px-8 py-4`
- Sections: `p-8` to `p-12`

**Margins**:
- Between sections: `my-12` to `my-20`
- Between items: `mb-4` to `mb-8`
- Stack spacing: `space-y-4` or `space-x-4`

**Responsive Spacing**:
```jsx
<div className="px-4 sm:px-6 lg:px-8 py-8 md:py-12">
  Content
</div>
```

---

## Icons with Lucide React

**Import Icons**:
```jsx
import { 
  Copy, 
  Share2, 
  LinkIcon, 
  CheckCircle2,
  AlertCircle,
  Sun,
  Moon,
  Menu,
  X,
  Github,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react'
```

**Use Icons**:
```jsx
<Copy size={20} className="text-indigo-600" />
<Sun size={24} className="text-yellow-400" />
<CheckCircle2 size={18} className="text-green-500" />
```

**Icon Sizes**:
- 12-16: Labels, badges
- 18-20: Buttons (default)
- 24: Hero sections
- 48+: Empty states

---

## Building New Pages

Template for creating consistent pages:

```jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import FooterNew from '../components/FooterNew'
import Card from '../components/Card'
import Button from '../components/Button'

const NewPage = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
              isDark
                ? 'bg-gradient-to-r from-white via-indigo-200 to-violet-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-slate-900 via-indigo-600 to-violet-600 bg-clip-text text-transparent'
            }`}>
              Page Title
            </h1>
            <p className={`text-xl max-w-3xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Page description
            </p>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="elevated">
                  <div className="p-6">
                    <h3 className={`text-lg font-bold mb-2 ${
                      isDark ? 'text-slate-200' : 'text-slate-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Button variant="primary" size="lg">
              Get Started
            </Button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <FooterNew />
    </div>
  )
}

export default NewPage
```

---

## Environment Variables

The app uses these environment variables:

```env
VITE_API_URL=https://minilink-fr8u.onrender.com/api
VITE_SHORT_BASE_URL=https://minilink-phi.vercel.app
```

These are accessible via `import.meta.env.VITE_API_URL`

---

## Performance Tips

1. **Use `whileInView` for animations**:
   ```jsx
   <motion.div whileInView={{ opacity: 1 }} viewport={{ once: true }}>
     Animate on scroll
   </motion.div>
   ```

2. **Lazy load components**:
   ```jsx
   const HeavyComponent = lazy(() => import('./Heavy'))
   ```

3. **Optimize images**: Use WebP format where possible

4. **Code splitting**: Large pages are automatically split by Vite

---

## Testing the New UI

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Visit pages**:
   - Homepage: `http://localhost:5174/`
   - Dashboard: `http://localhost:5174/dashboard`
   - Profile: `http://localhost:5174/profile`

3. **Test dark mode**:
   - Click the Sun/Moon icon in navbar
   - Theme persists in localStorage

4. **Test responsiveness**:
   - Resize browser
   - Check mobile menu on small screens

---

## Common Issues & Solutions

### Components not styled?
- Check Tailwind is imported in `index.css`
- Verify `tailwind.config.js` exists
- Restart dev server

### Dark mode not working?
- Ensure `ThemeProvider` wraps app in `App.jsx`
- Check localStorage for `theme` key
- Verify `dark:` classes in HTML

### Animations laggy?
- Check GPU acceleration in DevTools
- Reduce animation complexity
- Use `will-change: transform` for heavy animations

### Icons not showing?
- Verify lucide-react is installed
- Check import: `from 'lucide-react'`
- Ensure icon names are correct

---

## Next Steps for Future Updates

1. **Integrate with Dashboard**: Update dashboard with new components
2. **Create Auth Pages**: Style Login/Register with new design
3. **Add More Features**: Analytics, Custom domains, Link management
4. **Performance**: Implement code splitting and lazy loading
5. **Testing**: Add unit tests for components

---

## Summary

The new frontend design includes:

✅ Modern, premium SaaS aesthetic
✅ Full dark/light mode support
✅ Mobile-first responsive design
✅ Smooth Framer Motion animations
✅ Accessible and semantic HTML
✅ Reusable component library
✅ Professional color schemes
✅ Beautiful gradients and effects
✅ Icon integration with Lucide React
✅ Toast notifications
✅ Theme persistence

**Total New Components**: 9 core components
**Total New Pages**: 1 new homepage
**Dark Mode**: 100% coverage
**Mobile Responsive**: Yes
**Animations**: Full Framer Motion support

Start using these components in your pages and enjoy the modern design! 🚀
