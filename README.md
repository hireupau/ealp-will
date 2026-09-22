# Coffee Order

A single-page React app for ordering a coffee. Each answer reveals the next
question and scrolls it into view: coffee → pick up or delivery → submit →
order complete.

## Requirements

- Node >= 24 (`.node-version` pins 24.18.0 for fnm/nvm users)

## Getting started

```bash
npm install
npm run start
```

The dev server runs on http://localhost:3000 and opens a browser tab.

## Other scripts

| Script | Description |
| --- | --- |
| `npm run build` | Type-check and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | Type-check only |

## Stack

React 19, TypeScript, Vite. No backend — submitting an order just renders the
confirmation in the browser.

---

## Appendix: GitHub PAT for a local Strands agent

Not needed to run the app. This is for the local-testing Strands agent that
reads pull requests from this repo's remote
(`hireupau/engineering-ai-learning-project`).

### 1. Create a fine-grained token

github.com → Settings → Developer settings → Personal access tokens →
**Fine-grained tokens** → Generate new token.

| Field | Value |
| --- | --- |
| Resource owner | `hireupau` |
| Repository access | Only select repositories → `engineering-ai-learning-project` |
| Expiration | 30 days (it's a throwaway test agent) |

> **Set the resource owner to `hireupau`, not your personal account.**

### 2. Grant these repository permissions

| Permission | Level | Why |
| --- | --- | --- |
| **Pull requests** | Read-only | The one that matters: list/get PRs, files, diffs, reviews, review comments |
| **Metadata** | Read-only | Mandatory — GitHub auto-enables it alongside any other repo permission |
| **Contents** | Read-only | Only if the agent also reads repo files at a ref, not just PR data |
| **Issues** | Read-only | Only for the PR conversation timeline — top-level PR comments are issue comments under the hood |

Nothing else. No write permissions of any kind.

### 3. Get it approved by the org

Fine-grained PATs against an org repo need the org to allow them, and a
`hireupau` owner may have to approve the token before it works (Org Settings →
Third-party Access → Personal access tokens).

Until it's approved the token authenticates fine but 404s on the repo — the
same symptom as picking the wrong resource owner, so check both.

SRE can approve tokens.

### 4. Use it

Keep the token in the environment, never in code:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN="github_pat_..."
```

Verify the token before wiring anything up:

```bash
curl -H "Authorization: Bearer $GITHUB_PERSONAL_ACCESS_TOKEN" \
  https://api.github.com/repos/hireupau/engineering-ai-learning-project/pulls
```

`200` with a JSON array means you're set. `404` means resource owner or org
approval, per step 3.

---

## Appendix: Jira API token for a local Strands agent

Also not needed to run the app. This is for the same local-testing Strands
agent, giving it enough access to read Task tickets, comment on them, and move
them across a Kanban board.

Unlike a fine-grained GitHub PAT, **a Jira token can't be scoped to one project
or board** — scopes apply site-wide to the selected product.

### 1. Create a scoped API token

id.atlassian.com → Security → API tokens → **Create API token with scopes**
(not the plain "Create API token" button).

| Field | Value |
| --- | --- |
| App | Jira |
| Expiry | 1–365 days; keep it short for a test agent |

### 2. Select these classic scopes

| Scope | Covers |
| --- | --- |
| `read:jira-work` | Read issues, search by JQL, read comments |
| `write:jira-work` | Edit issues, post comments, execute transitions |

Those two cover all three capabilities. Atlassian recommends classic scopes
over granular ones unless they genuinely don't fit — granular scopes are
documented per endpoint and the JQL search endpoints in particular pull in a
long tail of supporting scopes.

### 3. Use the right base URL

Scoped tokens **must** go through `api.atlassian.com`, not your site domain:

```bash
export JIRA_EMAIL="mike.gardiner@hireup.com.au"
export JIRA_API_TOKEN="..."
export JIRA_CLOUD_ID="..."   # from https://<site>.atlassian.net/_edge/tenant_info

curl -u "$JIRA_EMAIL:$JIRA_API_TOKEN" \
  -H "Accept: application/json" \
  "https://api.atlassian.com/ex/jira/$JIRA_CLOUD_ID/rest/api/3/search/jql?jql=issuetype%3DTask"
```

Calling `https://<site>.atlassian.net/rest/api/3/...` with a scoped token fails
with *"Client must be authenticated to access this resource."* — that error
nearly always means the wrong base URL, not a bad token.

### Gotchas

- **Scopes aren't permissions.** The token caps what it *can* request; the
  account still needs the Jira project permissions — Browse Projects, Add
  Comments, Transition Issues, Edit Issues. Both layers must allow the call.
- **No issue-type scoping.** You can't issue a token that only sees Tasks.
  Filter at query time: `project = ABC AND issuetype = Task ORDER BY rank`.
- **`write:jira-work` includes delete.** It covers creating and deleting issues
  too, not just the comment-and-transition subset you asked for. If that
  matters later, the granular set (`write:comment:jira`, `write:issue:jira`,
  `read:issue.transition:jira`) is narrower.
