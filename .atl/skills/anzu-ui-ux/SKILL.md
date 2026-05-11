---
name: anzu-ui-ux
description: >
  Anzu Inventory frontend UI/UX skill. Trigger: When building, improving, or reviewing
  any UI component, page, or interaction for the Anzu Yu-Gi-Oh! card inventory app.
license: Apache-2.0
metadata:
  author: luisroman
  version: "1.0"
---

## When to Use

- Building new UI components (cards, modals, forms, buttons)
- Improving existing components (hover states, animations, spacing)
- Reviewing UI consistency against design system
- Creating page layouts (home, catalog, inventory, profile)
- Adding micro-interactions or animations
- Implementing responsive design

## Design System — Anzu Tokens

### Color Palette

| Token | Hex | Role |
|-------|-----|------|
| `--color-canvas` | #ffffff | Page backgrounds, card surfaces |
| `--color-ink-black` | #000000 | Primary text, strong borders, icons |
| `--color-subtle-gray` | #ebebeb | Hairline borders, subtle dividers, inactive states |
| `--color-muted-text` | #707070 | Secondary text, link text, navigation items |
| `--color-soft-gray` | #c9cbcc | Loader text, tertiary information, placeholder text |
| `--color-placeholder-text` | #7b7b7b | Placeholder text in input fields |
| `--color-shop-violet` | #5433eb | Primary action backgrounds, interactive icons, selected states, brand logo |
| `--color-violet-shadow` | #c0b5f3 | Violet supporting accent for decorative details |

### Typography Scale

| Role | Size | Line Height | Letter Spacing |
|------|------|-------------|----------------|
| caption | 11px | 1.33 | — |
| body-sm | 12px | 1.33 | — |
| body | 14px | 1.33 | — |
| body-lg | 16px | 1.33 | — |

**Font Family**: Inter for body,Poppins for display/titles

### Spacing Scale

| Token | Value |
|-------|-------|
| spacing-4 | 4px |
| spacing-8 | 8px |
| spacing-12 | 12px |
| spacing-16 | 16px |
| spacing-20 | 20px |
| spacing-24 | 24px |
| spacing-32 | 32px |
| spacing-40 | 40px |
| spacing-48 | 48px |

### Border Radii

| Name | Value | Use |
|------|-------|-----|
| radius-md | 4px | Small elements |
| radius-lg | 8px | Medium elements |
| radius-xl | 11.4046px | Card containers |
| radius-2xl | 17.1064px | Large containers |
| radius-2xl-2 | 22.8092px | Buttons |
| radius-full | 9999px | Pills, inputs |

### Shadows

| Name | Value |
|------|-------|
| shadow-lg | `0px 4px 24px 0px rgba(69, 36, 219, 0.34)` |

## Critical Patterns

### 1. NEVER use generic AI aesthetics

- Avoid: Inter, Roboto (use Inter per spec but make it interesting)
- Avoid: Purple gradients on white (Shop Violet is fine as solid accent)
- Avoid: Cookie-cutter component designs
- Avoid: Space Grotesk, Comic Sans, system defaults

### 2. Motion & Micro-interactions

**Required for all interactive elements:**

```css
/* Card hover effect */
.card {
  transition: all 200ms ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 4px 24px 0px rgba(69, 36, 219, 0.34);
}

/* Button press */
.button:active {
  transform: scale(0.95);
}

/* Page load stagger (for card grids) */
.card:nth-child(1) { animation-delay: 0ms; }
.card:nth-child(2) { animation-delay: 50ms; }
.card:nth-child(3) { animation-delay: 100ms; }
/* ... */
```

**Apply to:**
- Cards on home/catalog pages (translateY + shadow on hover)
- Buttons (scale 0.95 on active)
- Modals (fade-in + slight scale-up)
- Navigation links (background color transition)

### 3. Typography Hierarchy

```tsx
// Use these classes, NOT arbitrary sizes
<h1 className="text-2xl font-bold text-ink-black">  {/* Page titles */}
<h2 className="text-xl font-semibold text-ink-black"> {/* Section titles */}
<h3 className="text-body font-medium text-ink-black">  {/* Card titles */}
<p className="text-body-sm text-muted-text">          {/* Secondary info */}
<p className="text-caption text-soft-gray">            {/* Tertiary info */}
```

### 4. Spatial Composition

**Section Gap**: 40px between major sections
**Element Gap**: 8px between closely related elements
**Card Padding**: 16px inside cards

**Grid System:**
- Mobile (<640px): 1 column
- Tablet (640-1024px): 2 columns
- Desktop (>1024px): 3-4 columns
- Gap: 24px between cards

### 5. Visual Details — Depth & Texture

Avoid flat white backgrounds. Add subtle depth:

```css
/* Card with shadow - appears to float */
.card {
  background: #ffffff;
  box-shadow: 0px 4px 24px 0px rgba(69, 36, 219, 0.34);
}

/* Image container - soft radius */
.card-image {
  border-radius: 11.4046px;
  overflow: hidden;
}

/* Interactive elements need violet glow on focus */
input:focus, button:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-shop-violet);
}
```

### 6. Input & Form Design

**Search Input (pill shape):**
```tsx
<input
  className="w-full pl-12 pr-4 py-3 rounded-[10000px] border border-subtle-gray
             text-ink-black placeholder:text-placeholder-text
             focus:outline-none focus:ring-2 focus:ring-shop-violet"
/>
```

**Buttons:**
- Primary (rounded-white): White bg, border-subtle-gray, shadow-lg
- Ghost: Transparent bg, rounded-full, hover:bg-subtle-gray
- Pill: For navigation items, rounded-[30px]

### 7. Layout Rhythm

```
Hero Section: text-center mb-12 (40px gap)
Cards Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
Card Internal: p-4 with 16px padding
Section Separators: my-8 or my-12 (32-48px vertical spacing)
```

## Code Examples

### Card Component Pattern

```tsx
export function Card({ card, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col items-center p-4
                 rounded-[11.4046px] bg-canvas
                 transition-all duration-200
                 hover:shadow-[rgba(69,36,219,0.34)_0px_4px_24px_0px]
                 hover:-translate-y-1"
    >
      <div className="w-full aspect-[3/4] relative overflow-hidden rounded-[11.4046px] mb-3">
        <img src={card.image_url} alt={card.name} className="object-cover w-full h-full" />
      </div>
      <h3 className="text-body font-medium text-ink-black text-center mb-1 line-clamp-1">
        {card.name}
      </h3>
      {card.archetype && (
        <p className="text-body-sm text-muted-text text-center mb-1 line-clamp-1">
          {card.archetype}
        </p>
      )}
      <p className="text-caption text-soft-gray">
        {card.owner_count} {card.owner_count === 1 ? 'owner' : 'owners'}
      </p>
    </div>
  );
}
```

### Button Variants

```tsx
// Primary action - uses rounded-white variant
<Button variant="rounded-white">Agregar carta</Button>

// Ghost - navigation, secondary actions
<Button variant="ghost">Cancelar</Button>

// Pill - for nav links, filters
<Button variant="pill">Todos</Button>
```

### Loading States

```tsx
// Card grid loading
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {[...Array(8)].map((_, i) => (
    <div key={i} className="bg-subtle-gray rounded-[11.4046px] animate-pulse h-64" />
  ))}
</div>
```

## Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Checklist Before Finishing UI Work

- [ ] Cards have hover effects (translateY + shadow)
- [ ] Buttons have active state (scale 0.95)
- [ ] Inputs have focus states (ring-shop-violet)
- [ ] Typography uses design system classes (text-body, text-body-sm, etc.)
- [ ] Spacing follows 40px section / 8px element rhythm
- [ ] Colors use design tokens (bg-canvas, text-shop-violet, etc.)
- [ ] Border radii match design system (11.4046px for cards, etc.)
- [ ] Responsive breakpoints work (mobile/tablet/desktop)
- [ ] No generic fonts or colors hardcoded
- [ ] Motion is smooth (200ms duration, ease transitions)