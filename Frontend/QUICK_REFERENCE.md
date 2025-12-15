# MiniLink Frontend - Quick Reference Card

## 🚀 Start Here

### Development Server
```bash
npm run dev              # Start dev server on port 5173/5174
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Visit the App
```
http://localhost:5174/
```

---

## 📦 Core Components

### Import & Use

```jsx
// Navigation
import Navbar from './components/Navbar'
// Use: <Navbar />

// Footer
import FooterNew from './components/FooterNew'
// Use: <FooterNew />

// Hero
import HeroSectionNew from './components/HeroSectionNew'
// Use: <HeroSectionNew />

// Form
import UrlFormNew from './components/UrlFormNew'
// Use: <UrlFormNew />

// UI Components
import Card from './components/Card'
import Button from './components/Button'
import Badge from './components/Badge'
import LoadingSpinnerNew from './components/LoadingSpinnerNew'
import EmptyState from './components/EmptyState'

// Icons
import { Copy, Share2, Sun, Moon, Menu, X, CheckCircle2 } from 'lucide-react'

// Context
import { useTheme } from './context/ThemeContext'
import { useAuth } from './context/AuthContext'

// Animations
import { motion, AnimatePresence } from 'framer-motion'
```

---

## 🎨 Common Patterns

### Dark Mode Aware Component
```jsx
const MyComponent = () => {
  const { isDark } = useTheme()
  
  return (
    <div className={`bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100`}>
      Content adapts to theme
    </div>
  )
}
```

### Gradient Text
```jsx
<h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
  Premium Text
</h1>
```

### Animated Button
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
>
  Click me
</motion.button>
```

### Card Component
```jsx
<Card variant="elevated" hover className="p-6">
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Variants: default, elevated, glass, gradient, success
```

### Button Component
```jsx
<Button variant="primary" size="lg" loading={isLoading} icon={IconComponent}>
  Text
</Button>

// Variants: primary, secondary, ghost, danger, success
// Sizes: sm, md, lg
```

### Badge Component
```jsx
<Badge variant="success" size="md" icon={CheckIcon}>
  Label
</Badge>

// Variants: primary, secondary, success, warning, danger
```

### Loading Spinner
```jsx
<LoadingSpinnerNew size="md" fullScreen={false} />
// Sizes: sm, md, lg
// fullScreen: false = inline, true = overlay
```

### Empty State
```jsx
<EmptyState
  icon={LinkIcon}
  title="No Results"
  description="Try searching again"
  action={{ label: "Go Home", href: "/" }}
/>
```

---

## 🌈 Color Classes

### Tailwind Colors Used
```
Indigo: indigo-50 to indigo-900
Violet: violet-50 to violet-900
Slate:  slate-50 to slate-950
Green:  green-50 to green-900 (success states)
Red:    red-50 to red-900 (error/danger states)
Yellow: yellow-50 to yellow-900 (warning states)
```

### Dark Mode
```jsx
// Light mode default, dark mode with 'dark:' prefix
className="bg-white dark:bg-slate-900"
className="text-slate-900 dark:text-slate-100"
className="border-slate-200 dark:border-slate-700"
```

---

## 📐 Spacing Scale

```
px-4 py-3    = Small components (buttons, badges)
px-6 py-4    = Medium components
px-8 py-6    = Large components
p-8 md:p-12  = Sections

Gap spacing:
gap-4    = Items 1rem apart
gap-8    = Items 2rem apart
gap-12   = Items 3rem apart

Margin:
my-8     = 2rem top & bottom
mb-4     = 1rem bottom
mt-6     = 1.5rem top
```

---

## 🎬 Common Animations

### Fade In
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

### Scale on Hover
```jsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>
```

### Stagger Children
```jsx
<motion.div>
  {items.map((item, idx) => (
    <motion.div
      key={idx}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.1 }}
    >
      {item}
    </motion.div>
  ))}
</motion.div>
```

### Scroll Trigger
```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
>
  Animates when scrolled into view
</motion.div>
```

---

## 📱 Responsive Classes

```
Hidden on mobile:     hidden md:flex
Mobile only:          md:hidden
Stack mobile:         flex-col md:flex-row
Mobile first padding: px-4 md:px-6 lg:px-8

Grid columns:
grid-cols-1          = 1 column (mobile)
md:grid-cols-2       = 2 columns (tablet)
lg:grid-cols-3       = 3 columns (desktop)
```

---

## 🔗 Icon Usage

### Common Icons
```jsx
import {
  Copy,              // Copy icon
  Share2,            // Share icon
  Link,              // Link icon
  CheckCircle2,      // Check circle
  AlertCircle,       // Alert/warning
  Sun,               // Light mode
  Moon,              // Dark mode
  Menu,              // Hamburger menu
  X,                 // Close/X
  Github,            // GitHub logo
  Mail,              // Email
  LogOut,            // Logout
  User,              // User profile
  LayoutDashboard,   // Dashboard
  QrCode,            // QR code
  ExternalLink,      // External link
  Loader,            // Loading spinner
  Zap,               // Lightning/fast
  Shield,            // Security
  BarChart3,         // Analytics
} from 'lucide-react'

// Usage:
<Copy size={20} className="text-indigo-600" />
// Sizes: 16, 18, 20, 24, 32, 48+
```

---

## 🎯 Form Input Pattern

```jsx
<input
  type="url"
  placeholder="https://example.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
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

## 📄 Page Template

```jsx
import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/Navbar'
import FooterNew from '../components/FooterNew'
import Card from '../components/Card'
import Button from '../components/Button'

const PageName = () => {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen flex flex-col ${
      isDark ? 'bg-slate-900' : 'bg-white'
    }`}>
      <Navbar />
      
      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Your content */}
        </div>
      </main>
      
      <FooterNew />
    </div>
  )
}

export default PageName
```

---

## 🧪 Testing Checklist

- [ ] Dev server starts
- [ ] Homepage loads
- [ ] Dark mode toggles
- [ ] Mobile menu works
- [ ] Forms submit
- [ ] No console errors
- [ ] Animations smooth
- [ ] Responsive on mobile/tablet/desktop

---

## 📚 Documentation

| File | Contains |
|------|----------|
| DESIGN_SYSTEM.md | Design specs, colors, typography |
| IMPLEMENTATION_GUIDE.md | Component usage, examples, patterns |
| COMPONENT_INDEX.md | Component catalog, migration checklist |
| SETUP_DEMO_GUIDE.md | Feature walkthrough, customization |
| REDESIGN_COMPLETE.md | Project summary, what's new |

---

## 🚀 Deploy Checklist

- [ ] Run `npm run build`
- [ ] Check `dist/` folder created
- [ ] No build errors
- [ ] Test production build: `npm run preview`
- [ ] Commit all changes
- [ ] Push to repository
- [ ] Deploy to hosting (Vercel, etc.)

---

## 💡 Pro Tips

1. Always import `useTheme` for dark mode
2. Test mobile frequently while developing
3. Use Lucide icons for consistency
4. Keep animations subtle
5. Use `whileInView` for scroll animations
6. Follow existing component patterns
7. Check dark mode by toggling theme
8. Use semantic HTML
9. Include aria-labels on icon buttons
10. Maintain spacing consistency

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Styles not applying | Restart dev server |
| Dark mode not persisting | Check localStorage enabled |
| Icons not showing | Install: `npm install lucide-react --legacy-peer-deps` |
| Animations laggy | Check DevTools GPU acceleration |
| Build fails | Clear node_modules and reinstall |
| Port 5173 in use | Dev server uses 5174 automatically |

---

## 📞 Quick Links

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)
- [React Docs](https://react.dev)

---

## ✨ Summary

You now have:
- ✅ 9 reusable components
- ✅ Modern homepage
- ✅ Full dark mode
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Professional UI
- ✅ Complete documentation

**Everything you need to build amazing pages!** 🚀

---

**Print this card or bookmark it for quick reference while coding!** 🖨️📌
