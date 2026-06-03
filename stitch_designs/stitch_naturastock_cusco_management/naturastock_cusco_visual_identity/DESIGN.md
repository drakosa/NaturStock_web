---
name: NaturaStock Cusco Visual Identity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#42493e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#4a6549'
  on-secondary: '#ffffff'
  secondary-container: '#ccebc7'
  on-secondary-container: '#506b4f'
  tertiary: '#383a37'
  on-tertiary: '#ffffff'
  tertiary-container: '#4f514d'
  on-tertiary-container: '#c3c3bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#ccebc7'
  secondary-fixed-dim: '#b0cfad'
  on-secondary-fixed: '#07200b'
  on-secondary-fixed-variant: '#334d33'
  tertiary-fixed: '#e3e3de'
  tertiary-fixed-dim: '#c6c7c2'
  on-tertiary-fixed: '#1a1c19'
  on-tertiary-fixed-variant: '#454744'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The brand personality for this design system is **Botanical Professionalism**. It balances the organic, life-giving essence of natural products with the rigorous efficiency required for enterprise inventory management. The target audience consists of business owners, warehouse managers, and logistics coordinators who require a tool that feels as reliable and structured as a financial ledger, yet as fresh and approachable as the products they manage.

The design style is **Modern Corporate with Organic Minimalist influences**. It leverages generous whitespace to reduce cognitive load during complex tasks and employs a color palette rooted in the Andean landscape. The interface avoids unnecessary decoration, focusing instead on clarity, legibility, and high-quality functional aesthetics to evoke a sense of calm authority and environmental stewardship.

## Colors

This design system utilizes a palette inspired by the high-altitude forests and stone-paved streets of Cusco.

- **Primary (Forest Green):** Used for primary actions, active states, and brand reinforcement. It represents stability and the core nature of the inventory.
- **Secondary (Sage Green):** Used for tonal accents, progress indicators, and decorative elements that require a softer touch than the primary green.
- **Tertiary (Earthy Beige):** Primarily used for surface backgrounds and container fills to soften the interface compared to pure white, reducing eye strain during long work sessions.
- **Neutral (Slate/Grey):** A range of cool greys is used for typography, borders, and secondary icons to ensure a professional, SaaS-standard legibility.
- **System Colors:** Success (Emerald), Warning (Amber), and Error (Rose) should be used sparingly, prioritized for data validation and status updates within inventory tables.

## Typography

The typography system relies exclusively on **Inter** to maximize readability across high-density data environments. 

- **Headlines:** Use Bold and Semi-Bold weights with slight negative letter-spacing for a modern, compact appearance.
- **Body Text:** Standardized on a 16px base for optimal legibility. Use the "Regular" weight for general content and "Medium" for emphasis within paragraphs.
- **Labels:** Small labels use uppercase with increased letter-spacing to differentiate metadata from interactive text. 
- **Data Display:** When displaying numerical inventory counts or SKU codes, ensure the use of tabular lining figures (if available in the implementation) to maintain vertical alignment in tables.

## Layout & Spacing

This design system follows a **4px baseline grid** to ensure mathematical harmony between elements.

- **Grid System:** A 12-column fluid grid is used for the main content area. In desktop views, the sidebar is fixed at 280px, while the remaining content fluidly expands.
- **Sidebar:** Navigation resides in a persistent left-hand column. It uses `lg` (24px) internal padding for a spacious, breathable feel.
- **Data Tables:** These are the heart of the system. Use `sm` (8px) vertical cell padding for high-density views, or `md` (16px) for standard professional views.
- **Responsive Behavior:** 
  - **Desktop (>1024px):** Full sidebar, 12 columns, 40px outer margins.
  - **Tablet (768px - 1023px):** Collapsed sidebar (icons only), 8 columns, 24px outer margins.
  - **Mobile (<767px):** Bottom navigation or hamburger menu, 4 columns, 16px outer margins.

## Elevation & Depth

Hierarchy is established through **Tonal Layering and Soft Ambient Shadows**. 

1. **Surface Base:** The primary application background uses the Tertiary color (#F5F5F0) to create a soft, non-reflective canvas.
2. **Surface Level 1 (Cards/Tables):** Main content containers are pure white (#FFFFFF) with a very subtle 1px border (#E2E8F0) and a soft, diffused shadow (0px 4px 12px rgba(45, 90, 39, 0.05)). The shadow is slightly tinted with the Primary Green to maintain brand cohesion.
3. **Surface Level 2 (Modals/Popovers):** These elements use a more pronounced shadow (0px 12px 32px rgba(0, 0, 0, 0.1)) to indicate a clear break from the underlying interface.
4. **Interactive States:** Buttons and clickable cards should subtly lift on hover, increasing shadow depth while maintaining the same soft blur radius.

## Shapes

The shape language is **Refined & Friendly**, utilizing a consistent corner radius that reflects the approachable nature of the natural products industry.

- **Small Components:** Checkboxes, tags, and small buttons use a 4px (Soft) radius to maintain precision.
- **Standard Components:** Input fields, primary buttons, and dropdowns use an 8px (Rounded) radius.
- **Large Containers:** Cards, modals, and the sidebar use a 12px (Rounded-LG) radius for a more prominent, modern feel.
- **Visual Consistency:** Ensure that nested elements (like a button inside a card) have a slightly smaller radius than their container to maintain optical alignment.

## Components

### Sidebar Navigation
The sidebar should use a dark variant of the Primary Green or a clean white background. Active states must be clearly marked with a vertical 4px bar on the left edge and a subtle background tint (Sage Green at 10% opacity).

### Data Tables
Tables are the primary data interface. They should feature:
- Sticky headers with a subtle bottom border.
- Alternating row stripes (Zebra striping) using the Tertiary color at 50% opacity.
- Right-aligned numerical data for SKU counts and pricing.

### Statistical Cards
Used for dashboard overviews. These should include a "trend indicator" (micro-chart or percentage) in the top right. Use the Primary Green for positive trends and a muted Earthy Grey for neutral data.

### Form Inputs
Inputs should have a 1px border (#CBD5E1). On focus, the border transitions to Primary Green (#2D5A27) with a 3px soft outer glow (Focus Ring) in Sage Green at 20% opacity. Labels must always be visible above the input field, never hidden as placeholders.

### Buttons
- **Primary:** Solid Forest Green with White text.
- **Secondary:** Transparent background with Forest Green border and text.
- **Ghost:** No border, Sage Green text; used for low-priority actions like "Cancel."