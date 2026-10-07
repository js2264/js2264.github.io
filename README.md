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
hugo server --renderToMemory
```

Keep `--renderToMemory` while `publishDir: docs` is set in `config.yml`: a plain `hugo server`
writes its development build into `docs/`.

## Deploy

Pushing to `master` builds and deploys the site with GitHub Actions (`.github/workflows/hugo.yml`).
This requires *Settings > Pages > Build and deployment > Source: GitHub Actions*, with jserizay.com
as custom domain.

### Legacy `docs/` folder

Before the switch to GitHub Actions, the site was served from the committed `docs/` folder, built with:

```sh
hugo --cleanDestinationDir
```

Once Pages deploys through GitHub Actions, `docs/` is no longer used: delete it (`git rm -r docs`)
and remove `publishDir: docs` from `config.yml`.
