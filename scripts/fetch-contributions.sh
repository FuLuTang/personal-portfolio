#!/usr/bin/env bash
# Collects the pull requests and issues that GITHUB_USER opened in repositories
# owned by someone else, and writes them to data/contributions.json.
# Runs in the "Update GitHub contributions" workflow (daily) and locally with `gh`.
set -euo pipefail

USER_NAME="${GITHUB_USER:-FuLuTang}"
OUT="${1:-data/contributions.json}"
mkdir -p "$(dirname "$OUT")"

search() {
  # $1 = issue type (pr | issue); prints a JSON array, newest first
  gh api -X GET search/issues \
    -f q="author:${USER_NAME} type:$1 -user:${USER_NAME}" \
    -f sort=created -f order=desc -f per_page=100 \
    --jq '[.items[] | {
        repo: (.repository_url | sub("^.*/repos/"; "")),
        title: .title,
        url: .html_url,
        number: .number,
        state: (if .pull_request.merged_at then "merged" else .state end),
        created: .created_at[0:10],
        closed: (.closed_at // "" | .[0:10])
      }]'
}

prs="$(search pr)"
issues="$(search issue)"
updated="$(date -u +%Y-%m-%d)"

# one key per line, so the workflow can ignore a change on the "updated" line alone
printf '{\n"user": "%s",\n"updated": "%s",\n"prs": %s,\n"issues": %s\n}\n' \
  "$USER_NAME" "$updated" "$prs" "$issues" > "$OUT"

echo "Wrote $OUT"
