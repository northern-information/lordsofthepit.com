# Claude Code Context for Lords of the Pit

This file provides context for Claude Code when working on this project.

## Project Overview

Lords of the Pit is a static website for a Chicago-based Old School Magic: the Gathering club. The site features blog posts, event coverage, a podcast archive, and historical MTG documents.

**Target Audience:**

- Content writers (non-technical) who write blog posts
- Developers maintaining the site infrastructure
- Community members reading content

## Tech Stack

- **Static Site Generator:** Eleventy 3.1.2
- **Template Engine:** Liquid (for Jekyll compatibility)
- **Styling:** Tailwind CSS 3.4.19
- **Deployment:** Cloudflare Pages (automatic on push to main)
- **Version Control:** Git (images stored directly in repo, no LFS)
- **Node Version:** 20.x
- **Code Style:** Prettier with Liquid plugin

## Key Architecture Decisions

### Migration History (February 2026)

1. **Jekyll → Eleventy**
   - Migrated from Jekyll (Ruby) to Eleventy (Node.js) for faster builds
   - Converted to ES6 modules (`"type": "module"` in package.json)
   - Restructured to `src/` directory for cleaner organization
   - Changed build output from `_site` to `dist`
   - Kept Liquid templates for minimal migration friction
   - Build time improved from ~10-15s to ~3-4s

2. **Bootstrap → Tailwind CSS**
   - Migrated from Bootstrap 4.5 (CDN) to Tailwind CSS 3.4.19
   - Maintained identical visual design (black background, white text, red links)
   - Custom theme configured in `tailwind.config.js`
   - Custom typography in `src/assets/stylesheets/input.css` to match Bootstrap defaults

3. **Git History Cleanup**
   - Removed old image blobs from git history using `git-filter-repo`
   - Attempted Git LFS but hit bandwidth limits
   - Images now stored directly in repository (~3.2GB)
   - Repository size well under GitHub's 100GB limit

### Image Management

- **3.1GB+ of images** stored directly in git (no LFS)
- All images in `src/assets/images/`
- Images are regular git objects (no special setup required)
- R2 bucket available for PDFs: `https://assets.lordsofthepit.com` (migrated from S3 to Cloudflare R2)

### Writer-Friendly Workflow

**Critical:** Non-technical writers use this site. Their workflow MUST remain simple:

1. Create new markdown file in `src/posts/` with format `YYYY-MM-DD-title.md`
2. Write markdown with frontmatter
3. Add images to `src/assets/images/event-name/`
4. Git add/commit/push
5. Auto-deploys via Cloudflare Pages

**Do not introduce complexity** that breaks this workflow.

## Project Structure

```
/
├── README.md                   # Project documentation
├── CLAUDE.md                   # This file - Claude Code context
├── eleventy.config.js          # Eleventy configuration (ES6)
├── tailwind.config.js          # Tailwind CSS configuration
├── package.json                # Node dependencies and scripts
└── src/                        # All source files
    ├── includes/               # Reusable Liquid components
    │   ├── aside.html         # Sidebar with site nav and post archives
    │   ├── head.html          # <head> tags, meta, CSS links
    │   ├── header.html        # Site header with navigation
    │   ├── footer.html        # Site footer
    │   ├── javascript.html    # JS includes
    │   ├── site.html          # Site links component
    │   └── links.html         # External links component
    ├── layouts/               # Page layouts
    │   ├── default.html       # Base layout (others extend this)
    │   ├── post.html          # Blog post layout
    │   ├── page.html          # Static page layout
    │   ├── home.html          # Homepage layout
    │   ├── archives.html      # Archives page layout
    │   └── arcanaeum.html     # Arcanaeum (documents) layout
    ├── posts/                 # Blog posts (113+ posts)
    │   ├── *.md              # Post markdown files (YYYY-MM-DD-title.md)
    │   └── posts.11tydata.js # Default layout and computed next/prev
    ├── pages/                 # Static pages
    │   ├── arcanaeum.md      # Historical MTG documents
    │   ├── archives.md       # All posts by year
    │   ├── clubs.md          # Other OS clubs
    │   ├── cocktails.md      # MTG-themed cocktails
    │   ├── contact.md        # Contact info
    │   ├── faq.md            # Frequently asked questions
    │   ├── formats.md        # Format descriptions
    │   ├── lords-haus.md     # Lords Haus event info
    │   ├── media.md          # Media appearances
    │   ├── meetups.md        # Meetup information
    │   └── os-edh.md         # Old School EDH format
    ├── assets/
    │   ├── images/           # Images (3.1GB, stored in git)
    │   ├── stylesheets/      # CSS files
    │   │   ├── input.css     # Tailwind source (edit this)
    │   │   └── style.css     # Generated CSS (gitignored)
    │   └── javascript/       # JavaScript files
    ├── index.md              # Homepage
    ├── 404.html              # Custom 404 page
    ├── feed.xml              # RSS feed template
    └── *.png, *.ico, etc.    # Favicons and icons
└── dist/                      # Generated site (gitignored)
```

## Important Files & Configuration

### `eleventy.config.js`

- ES6 module using `import`/`export default`
- Configures collections (posts sorted by date descending)
- Jekyll-compatible filters: `date`, `escape`, `strip_html`, `limit`, `where`, etc.
- Allows missing file extensions (Jekyll permalink compatibility)
- Global site data defined inline (title, description, URLs, S3 bucket)
- Passes through assets, images, icons from `src/`
- Input directory: `src/`
- Output directory: `dist/`

### `src/posts/posts.11tydata.js`

- ES6 module using `export default`
- Directory data file for all posts (Eleventy convention)
- Sets default layout: `post.html`
- Computes `next` and `previous` post links for navigation
- Critical for post-to-post navigation in sidebar

### `tailwind.config.js`

- Custom colors: `black`, `white`, `red`, `dark-red`, `faded`
- Custom spacing: `xs` (5px) through `2xl` (200px)
- Custom fonts: `serif` (Times New Roman), `mono` (Courier)
- Content paths configured for Eleventy structure

### `src/assets/stylesheets/input.css`

- Tailwind directives (`@tailwind base/components/utilities`)
- Custom typography matching Bootstrap (h1-h6 sizes)
- Custom components for navigation, buttons, arcanaeum grid
- Edit this file, not `style.css` (which is generated)

### `package.json` Scripts

- `npm run dev` - Concurrent Tailwind watching + Eleventy dev server
- `npm run build` - Production build (compile CSS + Eleventy)
- `npm run build:css` - One-time Tailwind compilation
- `npm run watch:css` - Watch Tailwind for changes
- `npm run pretty` - Format code with Prettier

## Code Conventions

### JavaScript/Config Files

- **ES6 modules:** Use `import` and `export default`
- **Style:** Formatted with Prettier (single quotes, no semicolons)
- All `.js` files use ES6 syntax

### Liquid Templates

- Always use **quoted includes**: `{% include "file.html" %}`
- Collection reference: `collections.posts` (NOT `site.posts`)
- Site data: `site.title`, `site.url`, etc. (defined in `eleventy.config.js`)
- Frontmatter access in templates:
  - Current page: `{{ title }}`, `{{ author }}` (direct access)
  - Collection items: `{{ post.data.title }}`, `{{ post.data.author }}`
- Escape HTML: `{{ variable | escape }}`
- Layouts that extend others need frontmatter: `layout: default.html`

### Frontmatter

- Posts must have: `layout`, `author`, `title`, `date`, `category`
- Date format: `YYYY-MM-DD` (strict requirement)
- Layout references are filename only: `layout: post` (NOT `layout: layouts/post.html`)
- Example:
  ```yaml
  ---
  layout: post
  author: Author Name
  title: "Post Title"
  date: 2025-02-06
  category: blog
  ---
  ```

### Images

- Store in: `src/assets/images/event-name/`
- Reference absolute paths: `![alt](/assets/images/event-name/photo.jpg)`
- Images are regular git objects (no LFS setup required)

### Styling

- Main source: `src/assets/stylesheets/input.css` (Tailwind)
- Generated output: `src/assets/stylesheets/style.css` (DO NOT EDIT)
- Uses Tailwind utility classes throughout
- Custom components defined in `@layer components` in `input.css`
- Mobile-first responsive design

## Common Tasks

### Adding a New Post

Writers handle this, but if helping:

1. Create `src/posts/YYYY-MM-DD-title.md`
2. Add frontmatter (layout, author, title, date, category)
3. Add images to `src/assets/images/event-name/`
4. Write content in markdown
5. Reference images: `![alt](/assets/images/event-name/photo.jpg)`
6. Commit and push to main

### Adding a New Page

1. Create `src/pages/pagename.md`
2. Add frontmatter with layout (usually `page.html`)
3. Optionally add permalink: `/custom-url/`
4. Update navigation in `src/includes/header.html` if needed

### Modifying Styles

1. Edit `src/assets/stylesheets/input.css`
2. Tailwind auto-compiles in dev mode
3. Check browser with hard refresh (Cmd+Shift+R)

### Adding a New Layout

1. Create in `src/layouts/newlayout.html`
2. Must start with frontmatter: `layout: default.html` (if inheriting)
3. Use quoted includes: `{% include "component.html" %}`
4. Reference in page frontmatter: `layout: newlayout.html`

### Formatting Code

- Run `npm run pretty` to format all code with Prettier
- Some complex Liquid templates are excluded (see `.prettierignore`)

## Deployment

- **Automatic:** Push to `main` branch triggers Cloudflare Pages deployment
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **No GitHub Actions needed** - Cloudflare handles everything
- **Build Time:** ~4 seconds locally, ~2-3 minutes on Cloudflare (includes npm install)

## Testing Checklist

Before major changes:

- [ ] Run `npm run build` - must succeed
- [ ] Check homepage shows latest 3 posts with titles
- [ ] Navigate to individual post - titles, authors, next/prev links work
- [ ] Visit `/archives` - all posts listed by year (not full dates)
- [ ] Check mobile responsiveness
- [ ] Verify images load
- [ ] Test RSS feed: `/feed.xml`
- [ ] Check 404 page styling
- [ ] Run `npm run pretty` to ensure formatting

## Known Issues & Gotchas

1. **Liquid in Markdown:** Markdown files with Liquid syntax examples must be in `eleventy.config.js` ignores
2. **File Extensions:** Permalinks without extensions are allowed (Jekyll compatibility)
3. **Layout Nesting:** Layouts that extend other layouts need frontmatter at top
4. **Collection Sorting:** Posts are sorted newest-first in `eleventy.config.js` - don't sort in templates
5. **Frontmatter Access:** In templates, use `title` directly; in loops, use `post.data.title`
6. **Date Filter:** Custom filter respects format strings (`%Y`, `%b %-d, %Y`, etc.) for Jekyll compatibility
7. **No LFS:** Images are regular git objects - no LFS setup required for fresh clones

## Writer Support

When helping writers:

- **Keep it simple** - don't suggest complex git workflows
- Images go in `src/assets/images/` - no special handling required
- Markdown preview: Use VS Code with Markdown Preview or GitHub web editor
- Post won't show? Check date format (YYYY-MM-DD) and frontmatter syntax
- All posts must be in `src/posts/` directory

## Performance Notes

- Build time: ~3-4 seconds for full site
- 126 pages generated (113 posts + 13 pages)
- Repository size: ~3.2GB (images included)
- Cloudflare Pages build: ~2-3 minutes total (includes npm install + build)

## Contact & Maintenance

- Primary maintainer: @tyleretters
- Issues: GitHub Issues
- Writers: Trained on markdown + basic git
- Don't break the writer workflow!

---

**Remember:** This site serves a community of Magic: the Gathering players. Content is king. Keep the infrastructure invisible and reliable.
