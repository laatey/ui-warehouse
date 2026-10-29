# AGENTS.md — MoreCode UI Warehouse Contributor Guide

Instructions for AI coding agents maintaining, extending, or extracting UI foundations into the MoreCode UI Warehouse.

---

## 1. Core Principle & Objective

> **You are a UI foundation extraction system, not an application template collector.**

When processing any prebuilt project, ZIP archive, or component repository:
- Extract **only generic, reusable UI foundations and primitives**.
- Output must be **intentionally minimal, unbranded, and immediately ready to build upon**.
- **Page content areas must be blank by default.**
- **Never preserve the original application.** Preserve only the structural building blocks.

---

## 2. Directory Structure Conventions

Every asset in the warehouse must reside in its designated category directory and contain an `asset.json` manifest and a `source/` folder:

```text
ui-warehouse/
├── foundations/
│   ├── desktop/
│   │   ├── blank-pages/<asset-name>/       # Blank page shells (e.g., dashboard, settings)
│   │   ├── layouts/<asset-name>/           # Multi-panel & window shells (e.g., sidebar-shell, browser-shell)
│   │   └── navigation/<asset-name>/        # Navigation bars, tab strips, rails, omniboxes
│   ├── mobile/
│   │   ├── blank-pages/<asset-name>/       # Mobile screen shells with safe-area insets
│   │   ├── layouts/<asset-name>/           # Bottom nav shells, app bars
│   │   └── navigation/<asset-name>/        # Mobile tab bars, drawer menus
│   └── shared/
│       ├── primitives/<asset-name>/        # Headless or styled UI primitives (diff, modal, switch)
│       └── utilities/<asset-name>/         # Hooks and helper functions (resizers, cn)
├── libraries/
│   ├── desktop/<library-name>/             # Desktop-specific libraries (window controls)
│   ├── mobile/<library-name>/              # Mobile-specific touch primitives (bottom sheets)
│   └── web/<library-name>/                 # General web component kits (shadcn-ui)
├── indexes/
│   ├── assets.json                         # Centralized searchable index of all assets
│   ├── dependencies.json                   # Aggregate index of all required packages
│   └── frameworks.json                     # Compatibility matrix by framework
├── schemas/
│   └── asset.schema.json                   # JSON Schema Draft-07 for asset manifests
└── scripts/
    ├── build-indexes.mjs                   # Generates indexes/ from asset.json manifests
    └── validate-warehouse.mjs              # Validates all manifests and entry points
```

---

## 3. Neutralization Checklist (Mandatory Rules)

Before accepting any foundation into the warehouse, you must verify that:

1. **Content areas are blank**:
   - Dashboard layouts must have an empty `<main>{children}</main>` container.
   - Screen structures must not contain dummy metric cards, charts, product tables, or fake statistics.
   - Form layouts must provide empty form slots without pre-filled application logic or inputs.
2. **Branding is completely removed**:
   - Remove company names, product logos, SVG brand marks, and product slogans.
   - Provide clean parameter slots (`brandSlot`, `title`, `headerActions`) instead.
3. **No hardcoded visual styles or themes**:
   - Replace hardcoded hex colors (`#323230`, `#ffffff`) with standard semantic tokens (`bg-background`, `text-foreground`, `border-border`, `bg-muted`).
   - Blank content containers must not impose a forced background gradient, decorative surface, or card styling.
4. **Structural styling and interactions are preserved**:
   - Retain flexbox/grid layout mechanics, resizing logic, and responsive breakpoints.
   - Retain accessibility attributes (`role`, `aria-*`, focus rings, keyboard shortcuts like `Ctrl+B`).
   - Retain smooth micro-animations for interactive chrome (e.g., sliding segmented pills, tab hover states).
5. **No extraneous source trees or archives**:
   - Delete all temporary unpack directories (`_temp_extract/`) and original `.zip` archives immediately after successful extraction and validation.

---

## 4. Asset Manifest Specification (`asset.json`)

Every asset folder **must** include an `asset.json` strictly validating against [schemas/asset.schema.json](file:///c:/Users/gersh/Desktop/ui-warehouse/schemas/asset.schema.json).

### Required Fields

```json
{
  "id": "mc-<platform/type>-<unique-slug-or-id>",
  "name": "canonical-asset-name",
  "type": "foundation" | "layout" | "navigation" | "primitive" | "component" | "utility" | "library",
  "platform": "web" | "desktop" | "mobile" | "cross-platform",
  "frameworks": ["React"],
  "description": "Concise summary of structural capabilities provided.",
  "capabilities": [
    "collapsible-sidebar",
    "keyboard-shortcuts",
    "empty-content-container"
  ],
  "keywords": [
    "dashboard layout",
    "sidebar navigation"
  ],
  "aliases": [
    "Linear-style layout",
    "admin sidebar foundation"
  ],
  "visual_references": [
    {
      "name": "Linear",
      "purpose": "compact keyboard-oriented sidebar navigation",
      "reference_type": "structural-search-hint"
    }
  ],
  "related_assets": ["mc-web-nav-00007", "mc-lib-web-00001"],
  "dependencies": ["react", "react-dom", "lucide-react"],
  "design_constraints": [
    "No forced brand identity",
    "Empty content container by default"
  ],
  "entry_points": ["source/AppShell.tsx"],
  "source_provenance": {
    "source_archive": "source-project.zip",
    "original_paths": ["src/components/layout/AppShell.tsx"],
    "neutralization_summary": "Extracted layout shell, removed branding and mock charts."
  },
  "license": "MIT",
  "validation_status": "verified",
  "version": "1.0.0"
}
```

### Visual Reference Search Vocabulary
Use recognizable interface names as **search hints** (not as instructions to copy them):
- **Claude Code / Cursor / ChatGPT:** Developer workspace, terminal integration, collapsible inspector panel, mode toggling.
- **Linear / Vercel:** Minimalist sidebar navigation, compact keyboard-oriented productivity dashboard.
- **Chrome / Arc / Brave:** Tab strip with pinned tabs, omnibox address bar, browser navigation controls.
- **VS Code:** Multi-tab code editor chrome, activity bar icon rail, title bar window controls.
- **Figma / Miro:** Infinite canvas workspace, floating tool palette, viewport control overlays.
- **iOS / Android Standard:** Bottom tab bar, safe-area headers, swipeable gesture drawers.

---

## 5. Workflow for Adding New Foundations

Follow this automated workflow whenever adding or updating an asset:

1. **Extract to temporary scratch space**:
   Unpack source archives to a temporary directory (`_temp_extract/`).
2. **Isolate generic structures**:
   Identify the generic layout, navigation, or component primitives. Strip all product-specific pages, data fetching, and business logic.
3. **Neutralize & standardize**:
   Ensure all content containers are empty (`children`), tokens are semantic, and TypeScript types are fully exported.
4. **Create asset package**:
   Place code into `foundations/.../<asset-name>/source/` and write `asset.json`.
5. **Rebuild indexes**:
   ```bash
   npm run build:indexes
   ```
6. **Validate the warehouse**:
   ```bash
   npm run validate
   ```
   *Must exit with code 0 with all assets validated.*
7. **Clean up**:
   Delete temporary scratch files and original archive files.

---

## 6. Scripts & Validation Commands

- **`npm run build:indexes`** (`node scripts/build-indexes.mjs`):
  Scans all `asset.json` manifests, compiles [indexes/assets.json](file:///c:/Users/gersh/Desktop/ui-warehouse/indexes/assets.json), aggregates [indexes/dependencies.json](file:///c:/Users/gersh/Desktop/ui-warehouse/indexes/dependencies.json), and builds [indexes/frameworks.json](file:///c:/Users/gersh/Desktop/ui-warehouse/indexes/frameworks.json).
- **`npm run validate`** (`node scripts/validate-warehouse.mjs`):
  Validates every asset against [schemas/asset.schema.json](file:///c:/Users/gersh/Desktop/ui-warehouse/schemas/asset.schema.json) and verifies that every declared entry point exists on disk.
