# jserizay.com

Source of [jserizay.com](https://jserizay.com): a [Hugo](https://gohugo.io) site using the
[PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme (vendored in `themes/PaperMod/`,
customized through `layouts/` and `assets/`).

## Editing content

| Page     | Where                                                                                       |
| -------- | ------------------------------------------------------------------------------------------- |
| Home     | `content/profile.md` (text); `config.yml` > `params.profileMode` (picture, buttons)         |
| About    | `content/about/_index.md`                                                                   |
| Papers   | `data/papers.yaml`; PDFs in `static/papers/pdfs/` as `<id>.pdf` (and `<id>_supp.pdf`)       |
| Software | `data/software.yaml` (field reference at the top of the file)                               |
| Courses  | `data/courses.yaml` (sorted and grouped by year automatically)                              |
| Books    | `data/books.yaml`; covers in `static/book_covers/`                                          |
| CV       | `static/cv.pdf`                                                                             |

Data-driven pages follow the same pattern: `content/<page>.md` calls the `<page>` shortcode, which
renders `layouts/partials/<page>.html` from `data/<page>.yaml`, styled by `assets/css/extended/<page>.css`.

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
