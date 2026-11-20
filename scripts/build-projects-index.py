"""Writes content/projects/index.json: the list of project folders (those with an en.md).

GitHub Pages can't list folders, so the home page reads this file to know which
projects exist. The "Update project index" workflow runs it on every push that
touches content/projects/; run it by hand only if you want the file updated
locally (a local `python -m http.server` doesn't need it).
"""
import json
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent / "content" / "projects"
slugs = sorted(p.name for p in root.iterdir() if (p / "en.md").is_file())
(root / "index.json").write_text(json.dumps(slugs, indent=2) + "\n", encoding="utf-8")
print(f"{len(slugs)} projects -> {root / 'index.json'}")
