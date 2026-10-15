# Chalisa Langchai

Personal website built with React, TypeScript, and Vite. The current design directly adapts the Apache-2.0 styles from the local `itouSouta.me` reference: its exact color tokens, square panels, 360px profile column, 20px gaps, header, pill buttons, diagonal technology tiles, asymmetric bento layout, typography, and grain. The content is Chalisa's, in English only. The reference owner's photos, illustrations, project covers, accounts, and service integrations are excluded; their image positions use Chalisa's configured assets or remain available for replacement.

## Run locally

On Windows, double-click `start.cmd`, or run:

```sh
pnpm install
pnpm dev
```

If pnpm is not on PATH, use the local installation:

```sh
node .tools/node_modules/pnpm/bin/pnpm.mjs dev
```

## Pages

| Route | Content |
| --- | --- |
| `/` | Profile sidebar, introduction, technology strip, and five section links |
| `/about` | Biography, education, learning goals, and interests |
| `/skills` | Languages, frameworks, databases, and tools |
| `/projects` | Three project cards with screenshots, search, and category filters |
| `/projects/:id` | Overview, responsibilities, outcome, technologies, and code/demo links |
| `/resume` | English PDF download, without a PDF preview |
| `/contact` | Email, GitHub, LinkedIn, clipboard copy, and direct contact form |
| `/credits` | Original project attribution and license links |

The header includes navigation, a persistent theme toggle, and site search with Ctrl/Cmd+K. The mobile menu uses the reference's fullscreen overlay and supports Escape and focus return. Each content page has home and adjacent section links. Animations respect reduced-motion preferences.

## Update your information

Edit `src/content/portfolio.json`. The website reads the `en` values. The `th` values remain available to the separate Thai PDF generator.

- `name`, `initials`, `role`, `bio`, `goal`: identity and biography.
- `portrait`: an image path such as `/images/portrait.jpg`. Put the file in `public/images/`. If absent, the original-sized circular photo position remains empty.
- `education`: university, degree, year, GPA, period, and coursework.
- `interests`, `skills`: interests and grouped skills.
- `projects`: the real VanVan, Music App, and Autonomous Boat projects. Only VanVan has a live demo. Use `null` for unavailable links.
- `email`, `github`, `linkedin`, `otherContacts`: contact details. Only existing channels are displayed; LinkedIn requires a public `/in/` profile URL.
- `resume.en`: URL of the downloadable English PDF.

The home greeting, profile labels, and layout are in `src/pages/Home.tsx`; the education facts read from the JSON. Active English UI labels are in `src/lib/i18n.tsx`. The site does not read older saved language preferences. Thai source content is retained for PDF generation.

## Design files

- `src/reference.css`: adapted original layout rules and theme tokens. The original source's 1.15 desktop zoom and responsive breakpoints are retained.
- `src/reference-fonts.css`: local Latin font faces for Noto Sans TC, JetBrains Mono, and Shippori Mincho. The logo uses the reference's ChenYuLuoYan font.
- `src/site.css`: content adaptations, accessible controls, empty image positions, forms, and app-specific responsive styles.
- `src/lib/theme.tsx`: theme state stored as `chalisa-theme` in localStorage.
- `src/components/Layout.tsx`: header, mobile menu, grain overlay, page effects, and back-to-top button.
- `src/components/SiteSearch.tsx`: search dialog for real pages and projects.
- `src/pages/Home.tsx`: the five bento positions map to About (large image card), Skills (wide top-right), Resume (tall), Contact (tall), and Projects (bottom-left).
- `src/pages/`: individual pages.

The reference uses Next.js; this implementation keeps the existing React/Vite stack. Superseded designs, unused components, and their dependencies have been removed.

Image positions have `data-image-slot` attributes in Home, About, and Projects, so actual images can be added without changing placement. The GitHub card now renders real contributions for the account in `portfolio.github`, using the public `github-contributions-api.jogruber.de` service (`?y=last`). No token is required. The service caches results for an hour; the site also caches successful responses in memory for an hour. Colors follow the active theme. Each square has a date/count tooltip, and the calendar scrolls horizontally on mobile. Failed requests show a retry button without inventing data.

The contribution snake enters beside the first active date and uses shortest-path search to pursue the nearest remaining contribution while avoiding its own body. It clears visited contribution colors and fills a bar using the actual counts, then returns by a short route for the next loop. It does not sweep empty months and has no pause/play button. It pauses offscreen or in a hidden tab; reduced-motion mode shows the original static calendar. An empty calendar has no food or snake. This runs in the browser against current fetched data, without a GitHub token or scheduled Actions job. `src/lib/snake-route.ts` controls routing, `src/components/ContributionSnake.tsx` controls animation, and `GithubActivity.tsx` loads the data.

The source license is retained in `public/licenses/itouSouta-Apache-2.0.txt`, and notices are in `public/third-party-notices.txt`. Font licenses are in `public/licenses/`. The font download helper `scripts/import-reference-fonts.mjs` restores the local Latin font assets; no font network requests are needed at runtime.

## Resume PDFs

The website downloads `public/resume/resume-en.pdf`. The existing Thai PDF is retained in `public/resume/resume-th.pdf`. Neither includes a phone number. Replace the PDF directly, or edit `src/content/resume.json` and regenerate:

```sh
node scripts/generate-resumes.mjs --language=en
node scripts/generate-resumes.mjs --language=th
```

The generator also reads education, contacts, and project links from `portfolio.json`. Font selection and font sizes are in `scripts/generate-resumes.mjs`: `embeddedFontFaces`, the Thai CSS, and the English resume CSS. Both versions use Cambria; Thai characters use Noto Serif Thai because Cambria does not cover Thai. Cambria is read from Windows Fonts, or paths supplied in `RESUME_CAMBRIA_REGULAR` and `RESUME_CAMBRIA_BOLD`. Open font files and licenses are in `public/fonts/`.

PDF generation uses Google Chrome via Playwright, checks for A4 page overflow, and saves HTML previews in `artifacts/`. To regenerate both PDFs, run `pnpm resume`.

## Contact form

The form validates name, email, subject, and a message of at least 10 characters, then submits directly through FormSubmit. `src/lib/contact.ts` controls the request; the destination comes from `email` in `src/content/portfolio.json`. The visitor's email is supplied as the reply-to address. The form displays sending, success, activation-required, and failure states, retains text on failure, and prevents duplicate requests while sending.

The recipient must click **Activate Form** in the verification email from FormSubmit before messages can be delivered. An activation request for `chalisa4824@gmail.com` was accepted by FormSubmit on October 16, 2026; owner verification is still required. If FormSubmit requests verification again after deployment, submit from the deployed site and confirm the new activation email. Do not put private email-service keys into Vite client code. FormSubmit is an external service and receives the submitted contact details and message; the page includes a service disclosure. The separate email address link still opens an email app.

The home greeting alternates between Chalisa and Aom. `src/pages/Home.tsx` defines these names; `src/site.css` controls their timing, shared photo color treatment, pointer-responsive skill cards, and other visual refinements. Page and search transitions respect reduced-motion settings. About displays study year, GPA, and the Computer major in three fact cards.

Motion follows the local reference's settings: desktop Lenis 1.3.25 (`wheelMultiplier: 0.8`, `lerp: 0.1`, enabled above 760px), native mobile/reduced-motion scrolling, 0.45s ease page entrance without an outgoing-page delay, 0.55s header entrance, an 8s upward name loop, 1.1s photo/skill zoom, and 0.55s project-image stack transitions. Name rotation uses a duplicated first name for a continuous upward loop. Contact columns stretch to equal height on desktop. `src/components/SmoothScroll.tsx` controls scrolling; `Layout.tsx` coordinates it with navigation, search/menu locking, and back-to-top. The live snake follows the reference SVG's approximately 100ms per cell while pursuing Chalisa's own contributions.

## Check and preview

```sh
pnpm check
pnpm build
pnpm test:e2e
node scripts/capture-preview.mjs
```

Playwright checks English-only content, configured photos, navigation, themes, deep links, site search, project filters, project links, PDF downloads, clipboard copy, direct contact submission, mobile menus, and narrow-screen overflow. Contact requests are mocked in automated tests and do not send real messages. `tests/refinements.spec.ts` also checks name rotation, About facts, skill hover, activation responses, and retry behavior. It uses locally installed Google Chrome; override the browser path with `PORTFOLIO_BROWSER`. Screenshots are saved in `artifacts/`.

Vite outputs the production site to `dist/`. BrowserRouter requires a rewrite to `index.html`; `vercel.json` and `public/_redirects` provide hosting rules. Local design changes are not deployed automatically by these commands.

## Credits

This portfolio website is based on [itouSouta.me](https://github.com/itousouta15/itouSouta.me), created by [itousouta15](https://github.com/itousouta15).

I use the original website as the base for my personal portfolio. I have changed the personal information, projects, and content to make it my own.

Thanks to the original developer for sharing this project.

## License

The original project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for details.

Attribution and modification notices are recorded in [NOTICE](NOTICE) and [third-party notices](public/third-party-notices.txt). Credits are also accessible from the website footer. Font and icon licenses remain alongside their assets.
