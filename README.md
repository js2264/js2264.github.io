# jserizay.com

Source of [jserizay.com](https://jserizay.com): a [Hugo](https://gohugo.io) site using the
[chromokit](https://github.com/js2264/chromokit) theme (the look of chromosomix, metacooler's
documentation and chromokit's own site), in light and dark.

- `themes/chromokit/` is chromokit's, copied by `chromokit init hugo` and listed with hashes in
  `chromokit.json`. Leave it as it is: `npx github:js2264/chromokit sync` replaces it with a newer
  version, and `npx github:js2264/chromokit check` says whether a file of it was edited.
- Everything of this site's own is outside it: the home page (`layouts/index.html`), the data-driven
  partials (`layouts/partials/`), additions to `<head>` (`layouts/partials/chromokit/extend-head.html`),
  the styles (`static/site.css`, on chromokit's `--cx-*` tokens) and the scripts (`static/site.js`,
  `assets/js/filters.js`).

## Editing content

| Page     | Where                                                                                       |
| -------- | ------------------------------------------------------------------------------------------- |
| Home     | `content/_index.md` (text); `config.yml` > `params.home` (picture, line under the name)     |
| About    | `content/about/_index.md`                                                                   |
| Papers   | `data/papers.yaml`; PDFs in `static/papers/pdfs/` as `<id>.pdf` (and `<id>_supp.pdf`); then `python3 scripts/citations.py` |
| Software | `data/software.yaml` (field reference at the top of the file)                               |
| Courses  | `data/courses.yaml` (sorted and grouped by year automatically)                              |
| Books    | `data/books.yaml`; covers in `static/book_covers/`                                          |
| CV       | `static/cv.pdf`                                                                             |

Data-driven pages follow the same pattern: `content/<page>.md` calls the `<page>` shortcode, which
renders `layouts/partials/<page>.html` from `data/<page>.yaml`, styled in `static/site.css`.

**Papers** also get a page each, `/papers/<id>/`, made by `content/papers/_content.gotmpl` from
`data/papers.yaml` (nothing to write by hand): authors, journal, abstract, links, the packages
that implement it, and a "Cite" section with a reference, BibTeX, and `.bib` and `.ris` files.
The Papers page offers every paper in one `.bib` and one `.ris`. The full author lists, volumes
and pages come from Crossref: `python3 scripts/citations.py` fetches the record of each paper that
has none yet into `data/citations/<id>.json` (`--refresh` fetches them all again). The records are
committed, so the build needs no network, and can be corrected by hand.

**For search engines**, every page describes its subject in schema.org terms (JSON-LD,
`layouts/partials/jsonld.html`): the person (`params.person` and `params.links`), each paper's page
a `ScholarlyArticle` (authors with their ORCID, journal, DOI, abstract, PDF), the Papers page the
list of them, and the Software page a `SoftwareSourceCode` per package.

There is no bar across the top (`params.header: false`): the menu (`config.yml` > `menu.main`)
is the sidebar, with the name at its top and the links (Scholar, ORCID, GitHub, email:
`params.links`) at its foot, and the previous/next links at the foot of each page. The home page
has no sidebar: a button for each page of the menu sits under the introduction, and the links
under the name. The site is always light (`params.palette: light`); without that line it follows
the reader's system and gets a light/dark toggle.

Papers and Software have an "On this page" list on the right: the years and the themes, set by
their partials (`.Page.Store.Set "chromokit.toc"`), and following the filter chips. A page's
`description` is used for search engines and link previews only, not shown under its title
(`params.showDescription: false`). The sidebar's width is
`--cx-sidebar-w` in `static/site.css`.

The build warns when a paper's `pdf` or `supp` file is missing from `static/papers/pdfs/`.

## Preview locally

```sh
hugo server
```

Local builds (`hugo`, `hugo server`) are written to `public/`, which is not committed.

## Deploy

Pushing to `master` deploys the site: GitHub Actions builds it with Hugo and publishes it to
GitHub Pages (`.github/workflows/hugo.yml`). Only the sources are committed.

- Follow runs in the repository's *Actions* tab, or with `gh run list --workflow hugo.yml`.
- Redeploy without a new commit from the *Actions* tab ("Run workflow"), or with `gh workflow run hugo.yml`.
- The Hugo version used for deployment is pinned in the workflow (`HUGO_VERSION`): bump it when
  upgrading Hugo locally.
- Pages settings: *Settings > Pages > Build and deployment > Source: GitHub Actions*, with jserizay.com
  as custom domain (set there; `static/CNAME` is not needed for Actions deployments).
