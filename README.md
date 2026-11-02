# Alexey Rudi — bilingual portfolio

React + TypeScript + Vite + Tailwind CSS, with locally owned shadcn/ui Button and Accordion components built on Radix UI. English and Russian content, category filters, accessible expandable case studies, light/dark theme, and a copy-email action. No backend, analytics, or paid services.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Production build: `npm run build`. The deployable HTML, CSS, and JS are in `dist/`.

## Publish free on GitHub Pages

1. Create a **public** repository, named `yourusername.github.io` for your account's main website, or any other name for a project website.
2. Push the contents of this folder to its `main` branch. Include the hidden `.github/` directory and `package-lock.json`; exclude `node_modules/`.
3. In the repository, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow** if the first push happened before enabling Pages.
5. After deployment succeeds, the URL is shown in the deployment and in Settings → Pages.

The relative Vite base supports both account and project URLs. Navigation uses section anchors, so there is no client-side routing fallback to configure. Hosting and the github.io address are free for public repositories. A custom domain is optional and purchased separately.

## Update your content

### Add another CV

The **CV profile** selector is independent of the English/Russian switch. Your current .NET CV is the first entry; no placeholder CVs are published. Each entry has a shareable URL such as `?cv=senior-dotnet`. A visitor's last selection is remembered; an explicit URL takes priority. Unknown or removed IDs safely fall back to the first entry.

1. Copy the bilingual content structure from `src/content.ts` into a new file such as `src/cvs/my-next-cv.ts` and export it. Keep the same fields in both languages.
2. Import that content in `src/profiles.ts`.
3. Add a `CVProfile` entry to the exported `profiles` array with a unique URL-safe `id`, English/Russian selector labels, initials, page title, descriptions, email, optional Telegram link, architecture map, and toolkit. Point its `content` field at the imported bilingual content.
4. Run `node --test tests/*.test.mjs` and `npm run build`, then push to `main`. The selector lists every registered CV automatically; the shared page needs no edits.

The `CVProfile` TypeScript interface validates each entry's structure. All rendered names, copy, contacts, toolkit, page metadata, and branding come from the selected profile. Profile switching resets case-study filters and expanded details. Browser Back and Forward restore CV selection.

### Architecture map and metrics

`src/architecture.ts` defines the interactive hexagonal technology map. Select a domain, application, or adapter group to show its full technology list and responsibility. Delivery and observability tools sit outside the domain. The map spans career experience and does not claim every technology ran in a single system. The ports-and-adapters boundary follows [Alistair Cockburn's original description](https://alistair.cockburn.us/hexagonal-architecture).

`metrics` and `metricsNote` define the highlights and qualifications. Approximately **50 production investigations across the full career** is the owner's revised estimate. The two-week delivery cadence, parallel hotfix work, P&L speedup, and storage reduction refer to Timetta. The owner reports more than 3× improvement in coding pace with agents. No numeric feature/hotfix total is inferred from tenure.

### Original CV coverage

All 21 work-history bullets are retained in Russian with original wording (line wrapping and PDF headers removed), along with the original three-paragraph About section. English content translates those statements. Work appears under all four employers, with six selected cases across Timetta, Arcadia, VDOM BOX International, and Arview.

### Dependency-engine demo

The first case uses `demo: 'gantt'` to render `src/components/GanttDemo.tsx` beside its description on desktop, and below it on mobile. Other rows can receive demos later without publishing empty windows. The demo is illustrative browser code, not the proprietary production engine.

- Five tasks and all four relationships: FS, SS, FF, SF.
- Drag bars to move tasks; drag either edge to resize. Arrow keys move a focused bar; Shift+arrow changes duration. Inputs provide a second way to edit dates and duration.
- Drag the grid, use week arrows, or Shift+wheel/trackpad horizontal scroll to pan an unbounded, virtualized day axis. Zoom, Fit, and Reset controls are available.
- Select a dependency in the legend, then edit its type or signed day lag.
- `src/lib/gantt.ts` evaluates constraints in topological order. It pushes successors forward while retaining slack and rejects cycles, invalid intervals, and unknown task references. Intervals use exclusive finish boundaries: `[start, start + duration)`.
- Run `node --test tests/*.test.mjs` for dependency semantics, signed lag, cascading changes, slack, validation, and the CV registry tests.

`public/favicon.svg` is the navigation wordmark adapted for the browser tab. Browser titles and selector labels use the localized CV label without repeating the person's name.

Edit `src/content.ts` for both language versions; edit contacts and profile settings in `src/profiles.ts`. Theme and layout are in `src/index.css`. Browser language and theme choices persist in local storage. The default language is English.

Content is adapted from the supplied Russian CV. Case studies describe employment work; they do not imply public source code or individual ownership of team achievements. Approximate storage savings and collaborative contributions retain those qualifications. Personal phone number, birth date, citizenship, and administrative CV fields are intentionally omitted. The original PDF is not bundled publicly because it contains those details.

To add more shadcn components: `npx shadcn@latest add <component>`.

## Component attribution

`src/components/ui/button.tsx` and `accordion.tsx` are adapted from shadcn/ui's New York components, released under the MIT license. See `LICENSE-shadcn.txt`.
