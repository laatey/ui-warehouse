# MoreCode UI Warehouse

A structured repository of generic, reusable UI foundations, component libraries, and retrieval indexes designed for AI agents to build original web, desktop, and mobile applications.

## Core Architecture

```text
ui-warehouse/
├── foundations/
│   ├── desktop/
│   │   ├── blank-pages/
│   │   │   ├── dashboard-page/
│   │   │   └── settings-page/
│   │   ├── layouts/
│   │   │   ├── assistant-workspace-shell/
│   │   │   ├── auth-split-shell/
│   │   │   ├── browser-shell/
│   │   │   ├── cad-ribbon-shell/
│   │   │   ├── canvas-workspace-shell/
│   │   │   ├── crm-workspace-shell/
│   │   │   ├── database-workspace-shell/
│   │   │   ├── dynamic-island-shell/
│   │   │   ├── inbox-workspace-shell/
│   │   │   ├── internal-tool-builder-shell/
│   │   │   ├── marketing-shell/
│   │   │   ├── project-workspace-shell/
│   │   │   ├── query-console-drawer/
│   │   │   └── sidebar-shell/
│   │   └── navigation/
│   │       ├── command-prompt-bar/
│   │       ├── data-grid-toolbar/
│   │       ├── file-tree/
│   │       ├── icon-rail/
│   │       ├── inbox-conversation-list/
│   │       ├── omnibox-toolbar/
│   │       ├── ribbon-bar/
│   │       ├── schema-table-sidebar/
│   │       ├── status-bar/
│   │       ├── tab-strip/
│   │       ├── view-switcher-bar/
│   │       ├── viewport-navigation-gizmo/
│   │       └── widget-palette-grid/
│   ├── mobile/
│   │   ├── blank-pages/
│   │   │   ├── blank-screen/
│   │   │   └── native-blank-screen/
│   │   ├── layouts/
│   │   │   ├── bottom-nav-shell/
│   │   │   └── map-bottom-sheet-shell/
│   │   └── navigation/
│   │       ├── bottom-navigation/
│   │       ├── mobile-drawer-nav/
│   │       ├── native-screen-header/
│   │       └── native-tab-bar/
│   └── shared/
│       ├── primitives/
│       │   ├── chart-panel-shell/
│       │   ├── contact-detail-card/
│       │   ├── crm-data-table/
│       │   ├── crm-filter-builder/
│       │   ├── diff-viewer/
│       │   ├── empty-state/
│       │   ├── form-field-group/
│       │   ├── form-wizard-shell/
│       │   ├── issue-row-item/
│       │   ├── kanban-board-stage/
│       │   ├── message-thread/
│       │   ├── modal-overlay/
│       │   ├── prompt-input/
│       │   ├── property-inspector-panel/
│       │   ├── record-peek-drawer/
│       │   ├── segmented-switch/
│       │   ├── settings-row-group/
│       │   ├── sql-query-editor-stage/
│       │   └── stat-tile/
│       └── utilities/
│           ├── cn/
│           └── responsive-sidebars/
├── libraries/
│   ├── desktop/
│   │   └── electron-window-controls/
│   ├── mobile/
│   │   ├── react-native-primitives/
│   │   └── touch-primitives/
│   └── web/
│       └── shadcn-ui/ (46 accessible primitives)
├── indexes/
│   ├── assets.json
│   ├── dependencies.json
│   └── frameworks.json
├── schemas/
│   └── asset.schema.json
└── scripts/
    ├── build-indexes.mjs
    └── validate-warehouse.mjs
```

## AI Agent Retrieval Guide

Every asset contains an `asset.json` manifest conforming to [schemas/asset.schema.json](file:///c:/Users/gersh/Desktop/ui-warehouse/schemas/asset.schema.json). Future AI agents can query [indexes/assets.json](file:///c:/Users/gersh/Desktop/ui-warehouse/indexes/assets.json) using keywords, aliases, structural capabilities, or visual references.

### Visual Reference Discovery Hints

- **Supabase Studio / Neon-inspired:**
  - `database-workspace-shell` (`mc-desk-shell-00037`): 3-pane database layout with service rail, collapsible sidebar, action toolbar, and inspector panel.
  - `schema-table-sidebar` (`mc-desk-nav-00050`): Database schema picker dropdown, table search filtering, RLS locks, and table list rows.
  - `data-grid-toolbar` (`mc-desk-nav-00051`): Schema breadcrumb, active filter/sort counters, view-as role selector, and insert row actions.
  - `sql-query-editor-stage` (`mc-sh-prim-00052`): Tabbed SQL editor stage, Ctrl+Enter run handler, execution time/row count metrics, and empty results grid slot.
- **Appsmith / Retool-inspired:**
  - `internal-tool-builder-shell` (`mc-desk-shell-00033`): Canvas stage, left entity explorer, right property pane, and collapsible query drawer.
  - `property-inspector-panel` (`mc-sh-prim-00038`): Accordion sections, property controls (text, number, switch, select), and binding expression slots.
  - `widget-palette-grid` (`mc-desk-nav-00039`): Searchable 2-column component card grid with category tabs and drag previews.
  - `query-console-drawer` (`mc-desk-shell-00040`): Collapsible bottom drawer with query tabs, run action bar, and empty response container.
- **Chatwoot / Zendesk-inspired:**
  - `inbox-workspace-shell` (`mc-desk-shell-00034`): 3-pane split inbox layout with feed, message thread, and right contact details sidebar.
  - `inbox-conversation-list` (`mc-desk-nav-00041`): Inbox feed with filter tabs (Mine, Unassigned, All), search input, and conversation cards.
  - `message-thread` (`mc-sh-prim-00042`): Chronological bubble feed, date dividers, typing indicator, and multi-line message composer.
  - `contact-detail-card` (`mc-sh-prim-00043`): Contact profile header, quick action buttons, key-value attributes list, and custom notes slot.
- **Twenty CRM / Salesforce-inspired:**
  - `crm-workspace-shell` (`mc-desk-shell-00035`): CRM workspace with module switcher, view bar, and slide-out side panel.
  - `record-peek-drawer` (`mc-sh-prim-00044`): Slide-out record inspector with entity header, tabs, quick properties grid, and empty details container.
  - `crm-filter-builder` (`mc-sh-prim-00045`): Interactive filter chip bar with operators (is, contains, empty), in-place values, and field picker menu.
  - `crm-data-table` (`mc-sh-prim-00046`): Tabular record data grid with sticky sortable headers, multi-select checkboxes, and empty container slot.
- **Plane / Linear / Agile Workspaces:**
  - `project-workspace-shell` (`mc-desk-shell-00036`): Agile workspace shell with view switcher, filter bar, stage area, and peek drawer.
  - `view-switcher-bar` (`mc-desk-nav-00047`): Segmented view switcher (List, Kanban Board, Calendar, Gantt, Spreadsheet) with action slots.
  - `kanban-board-stage` (`mc-sh-prim-00048`): Multi-column kanban board stage with collapsible status lanes, count badges, and empty drop zones.
  - `issue-row-item` (`mc-sh-prim-00049`): Dense task item row with priority indicators, state badges, mono identifier, assignee avatar, and due date.
- **AutoCAD / Desktop CAD-inspired:** `cad-ribbon-shell` (`mc-desk-shell-00024`), `ribbon-bar` (`mc-desk-nav-00025`), `command-prompt-bar` (`mc-desk-nav-00026`), `viewport-navigation-gizmo` (`mc-desk-nav-00027`), `status-bar` (`mc-desk-nav-00028`)
- **VS Code / Developer IDE-inspired:** `file-tree` (`mc-desk-nav-00029`), `vertical-icon-rail` (`mc-web-nav-00007`)
- **AI Chat & Prompt Composer:** `prompt-input` (`mc-sh-prim-00030`), `assistant-workspace-shell` (`mc-web-shell-00012`), `segmented-switch` (`mc-sh-prim-00014`)
- **Apple Dynamic Island / macOS Notch HUD:** `dynamic-island-shell` (`mc-desk-shell-00032`)
- **Linear / Vercel / SaaS Landing:** `marketing-shell` (`mc-web-shell-00031`), `sidebar-shell` (`mc-web-shell-00001`), `blank-dashboard-page` (`mc-web-page-00008`)
- **Chrome / Browser-inspired:** `browser-shell` (`mc-desk-shell-00002`), `desktop-tab-strip` (`mc-desk-nav-00005`), `omnibox-toolbar` (`mc-desk-nav-00006`)
- **Figma / Canvas-inspired:** `canvas-workspace-shell` (`mc-web-layout-00004`)
- **Uber / Lyft / Logistics-inspired:** `map-bottom-sheet-shell` (`mc-mob-shell-00019`), `react-native-primitives` (`mc-lib-mob-00023`)
- **iOS / Native Mobile:** `native-tab-bar` (`mc-mob-nav-00020`), `native-screen-header` (`mc-mob-nav-00021`), `native-blank-screen` (`mc-mob-page-00022`), `mobile-bottom-nav-shell` (`mc-mob-shell-00010`)
- **Forms, Settings & Data Display:** `form-field-group` (`mc-sh-prim-00053`), `form-wizard-shell` (`mc-sh-prim-00054`), `chart-panel-shell` (`mc-sh-prim-00055`), `stat-tile` (`mc-sh-prim-00056`), `empty-state` (`mc-sh-prim-00057`), `settings-row-group` (`mc-sh-prim-00058`)
- **Universal Component Primitive Kit:** `shadcn-ui-react` (`mc-lib-web-00001`) with 46 unbranded, accessible primitives

## Validation & Verification

All assets in this warehouse are strictly validated against [schemas/asset.schema.json](file:///c:/Users/gersh/Desktop/ui-warehouse/schemas/asset.schema.json) and verified to ensure that all declared entry points exist on disk:

```bash
# Rebuild centralized discovery indexes
npm run build:indexes

# Validate all assets and entry points
npm run validate
```

## MCP Server

Query the warehouse from any MCP client (stdio or hosted HTTP/HTTPS). See [mcp/README.md](mcp/README.md).

```bash
npm run mcp        # stdio
npm run mcp:http   # Streamable HTTP on 127.0.0.1:3333
npm run test:mcp   # transport and security tests
```
