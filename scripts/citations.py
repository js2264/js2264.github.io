#!/usr/bin/env python3
"""
Fetch each paper's full citation record from Crossref into data/citations/<id>.json.

    python3 scripts/citations.py            # the papers that have no record yet
    python3 scripts/citations.py --refresh  # every paper again
    python3 scripts/citations.py <id> ...   # these papers only (again)

data/papers.yaml lists each paper with its DOI and a short author list; Crossref
holds the rest (every author with their given name and ORCID, volume, issue,
pages). The paper pages, the "Cite" section and its BibTeX and RIS files read
these records, and fall back to papers.yaml for a paper that has none. The
records are committed, so the site builds without the network, and can be
corrected by hand. Standard library only.
"""
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAPERS = ROOT / "data" / "papers.yaml"
OUT = ROOT / "data" / "citations"
API = "https://api.crossref.org/works/"
AGENT = "jserizay.com citation records (https://jserizay.com/; scripts/citations.py)"


def papers():
    """(id, doi) for each paper of papers.yaml, read without a YAML library."""
    found, current = [], None
    for line in PAPERS.read_text(encoding="utf-8").splitlines():
        if m := re.match(r'^\s*-\s+id:\s*"?([^"#]+?)"?\s*$', line):
            current = m.group(1)
        elif current and (m := re.match(r'^\s+doi:\s*"?([^"#\s]+)"?\s*$', line)):
            found.append((current, m.group(1)))
            current = None
    return found


def first(value):
    return value[0] if isinstance(value, list) and value else (value or None)


def text(value):
    """Crossref's text, with its HTML entities and tags (<i>, <sub>…) undone."""
    value = first(value)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html.unescape(value))).strip() if value else None


def record(doi):
    url = API + urllib.parse.quote(doi, safe="/")
    request = urllib.request.Request(url, headers={"User-Agent": AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        work = json.load(response)["message"]
    authors = []
    for a in work.get("author", []):
        entry = {k: html.unescape(a[k]).strip() for k in ("given", "family", "name") if a.get(k)}
        if a.get("ORCID"):
            entry["orcid"] = a["ORCID"].replace("http://", "https://")
        authors.append(entry)
    date = (work.get("published") or work.get("issued") or {}).get("date-parts", [[None]])[0]
    keep = {
        "doi": work.get("DOI", doi),
        "type": work.get("type"),
        "subtype": work.get("subtype"),
        "title": text(work.get("title")),
        "container": text(work.get("container-title")),
        "short_container": text(work.get("short-container-title")),
        "publisher": work.get("publisher"),
        "institution": text([i.get("name") for i in work.get("institution", [])]),
        "volume": work.get("volume"),
        "issue": work.get("issue"),
        "page": work.get("page"),
        "article_number": work.get("article-number"),
        "issued": [part for part in date if part],
        "issn": work.get("ISSN"),
        "authors": authors,
    }
    return {k: v for k, v in keep.items() if v not in (None, [], "")}


def main(argv):
    refresh = "--refresh" in argv
    only = {a for a in argv if not a.startswith("--")}
    OUT.mkdir(parents=True, exist_ok=True)
    failed = 0
    for pid, doi in papers():
        target = OUT / f"{pid}.json"
        if only and pid not in only:
            continue
        if target.exists() and not refresh and not only:
            continue
        try:
            data = record(doi)
        except (urllib.error.URLError, KeyError, ValueError) as error:
            print(f"  {pid}: {doi} not found on Crossref ({error})", file=sys.stderr)
            failed += 1
            continue
        target.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"  {pid}: {len(data.get('authors', []))} authors")
        time.sleep(0.2)  # Crossref's public pool asks for a gentle rate
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
