# Amir Karimi — Personal Website

A static, dependency-free personal site: plain HTML, CSS and JavaScript. No build step,
no framework, no server — it can be hosted on GitHub Pages for free.

## Structure

```
.
├── index.html              # all content lives here
├── assets/
│   ├── css/style.css       # design tokens + components
│   ├── js/main.js          # theme toggle, mobile menu, scroll effects
│   ├── img/profile.jpg     # your photo (see below)
│   └── files/              # put Amir_Karimi_Resume.pdf here
├── .nojekyll               # tells GitHub Pages to serve files as-is
└── README.md
```

## Still to add

**Your résumé PDF** — save it as `assets/files/Amir_Karimi_Resume.pdf` so the
"Résumé" button in the hero downloads it.

To swap the hero photo later, just replace `assets/img/profile.jpg` with another
square image (about 800×800 px). If the file is ever missing, the hero falls back
to an "AK" placeholder instead of showing a broken image.

## Run it locally

Just open `index.html` in a browser. Or, for a proper local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish on GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: personal website"
git branch -M main
git remote add origin https://github.com/amir-karimii/amir-karimii.github.io.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Source: Deploy from a branch →
Branch: `main`, folder: `/ (root)`** → Save.

- Repo named `amir-karimii.github.io` → the site is at `https://amir-karimii.github.io`
- Any other repo name (e.g. `portfolio`) → `https://amir-karimii.github.io/portfolio`

The first deploy takes a minute or two. Every later `git push` updates the live site.

### Custom domain (optional)

Add a file named `CNAME` at the root containing just your domain (e.g. `amirkarimi.ir`),
point an `A` record at GitHub Pages' IPs, then enable the domain under Settings → Pages.

## Editing

Everything is in `index.html`, marked with comment banners (`<!-- ==== HERO ==== -->`, etc.).
Colors, spacing and radii are CSS variables at the top of `style.css` — change
`--accent` there to restyle the whole site at once.
