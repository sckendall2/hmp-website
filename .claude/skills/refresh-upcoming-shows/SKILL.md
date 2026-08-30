---
name: refresh-upcoming-shows
description: Refresh the Shows section of the HMP website — remove past shows (offering to move each venue into the About past-venues list), add new upcoming shows, and audit every show's Details/Venue link. Use when the user wants to update, refresh, or clean up the band's show listings.
---

# Refresh Upcoming Shows

Updates the Shows section in `index.html`. Work through the phases in order, then preview, get approval, and publish.

**Run every command yourself** — the preview, all `git` operations (status, add, commit, push), everything. Nobody should be asked to type a command, use a terminal, or click Merge on GitHub to finish a change. Whoever is running this, their only jobs are: answer questions about shows, and look at the preview and say whether it's good. Do the mechanics yourself.

Pitch the narration to who's asking. For a bandmate, explain in plain language and skip the git vocabulary entirely. For Sam, who maintains the repo, talk normally — name the commands and the failure modes; there's no need to pretend he's never heard of git. Either way the division of labor is the same: you run everything, they only make decisions about shows.

Today's date is available in context — treat any show whose date is strictly before today as "past."

## Phase 0 — Sync with remote

**Before reading or editing `index.html`, sync the local repo with `origin/main`.** Bandmates may push changes directly (e.g. via the GitHub web UI) without this skill, so a local checkout can be stale.

1. Run `git status` — if there are unexpected uncommitted changes, stop and ask the user before touching anything (don't clobber in-progress work).
2. Run `git fetch origin`, then compare `main..origin/main`. If origin has commits the local branch doesn't, fast-forward pull (`git pull --ff-only origin main`) before proceeding.
3. Only after the local checkout matches `origin/main` should you read `index.html` and start Phase 1. Editing against a stale base risks silently re-adding or re-removing content someone else already changed.

The Shows markup is a series of `.show-row` blocks inside `<div class="shows-list">`:

```html
<div class="show-row">
  <span class="show-date">Sat, Jul 11</span>
  <div class="show-details">
    <span class="show-venue">Venue Name</span>
    <span class="show-meta">Time &mdash; City, ST</span>
  </div>
  <a href="URL" class="show-link" target="_blank" rel="noopener noreferrer">Details</a>
</div>
```

Rows are listed in chronological order; keep them that way.

**Shows are grouped by year.** Each year present in the list gets its own subhead followed by its own `.shows-list` containing that year's rows:

```html
<h3 class="shows-subhead">Upcoming in 2026</h3>
<div class="shows-list">
  ...2026 rows, chronological...
</div>

<h3 class="shows-subhead">Upcoming in 2027</h3>
<div class="shows-list">
  ...2027 rows, chronological...
</div>
```

Subhead text is always `Upcoming in <year>`. Year groups appear in ascending order. The year is **not** repeated in each `.show-date` (dates stay `Sat, Jul 11`) — the subhead carries it.

## Phase 1 — Remove past shows

1. Read the current `.show-row` entries and identify every show dated before today.
2. List the past shows you found so the user can confirm.
3. For **each** past show, ask the user whether to add its venue to the **past-venues list** in the About section (the second `<p class="about-bio">`). The past-venues paragraph is a comma-separated prose list — insert the venue naturally, avoiding duplicates and keeping the existing closing phrasing ("...house concerts, block parties, and a shocking variety of porch fests.").
   - Note: recurring venues (e.g. Remnant Brewing, Midway Cafe) may already be in the list — don't duplicate.
   - Porch fests are generally already covered by the closing "shocking variety of porch fests" — ask before adding a specific one.
4. Remove the past `.show-row` blocks.
5. If removing past shows leaves a year group empty, delete that whole group — both its `<h3 class="shows-subhead">` and its now-empty `<div class="shows-list">`. (E.g. once all 2026 shows are past, the "Upcoming in 2026" subhead and its list go away, leaving "Upcoming in 2027" as the first group.)

## Phase 2 — Add new upcoming shows

1. Ask the user for new shows. For each, collect: date, venue name, time, city/state, and any event URL they already have.
2. Insert each as a new `.show-row` under the subhead for its year, in correct chronological position within that year's `.shows-list`. If a show falls in a year that has no group yet, create a new `<h3 class="shows-subhead">Upcoming in <year></h3>` + `<div class="shows-list">` block, placed so year groups stay in ascending order.
3. Match the existing date format exactly: `Sat, Jul 11` (abbreviated weekday, abbreviated month, no leading zero on day, no year — the subhead carries the year).
4. Use `&mdash;` between time and location and `&bull;` to separate multiple time items, matching existing rows. Use `&amp;` for ampersands.
5. For the link, apply the link policy in Phase 3 — don't just drop in whatever URL was given.

## Phase 3 — Audit every Details/Venue link

Apply the **show-link policy** in [`./shows-link-policy.md`](./shows-link-policy.md) (the authoritative source) to every row, new and existing. In summary:

- **Prefer the precise event page, labeled "Details"** — a specific event-detail URL (Tockify event page, Eventbrite event, the venue's `/events/<this-event>`, a festival's per-event or per-band page), NOT the venue or festival homepage.
- **Fall back to a venue link labeled "Venue"** only when no precise event page exists, or the precise page is too sparse (e.g. lacks venue/location info). This applies even to porch fests.

For each row currently labeled "Venue", **dig hard** for a precise event page that would let it be upgraded to "Details":
- Check the venue's events calendar / booking platform (many Boston-area venues use Tockify or Eventbrite).
- Check the festival site for a schedule or band-specific page.
- Use WebFetch/WebSearch to confirm a candidate URL actually points at *this* specific event before relabeling.
- Only relabel "Venue" → "Details" when you've confirmed the link is genuinely event-specific. If you can't find one, leave it as "Venue".

Report which links you upgraded, which you couldn't, and why.

## Phase 4 — Preview, approve, then publish

Do these in order. **The approval gate in step 3 is mandatory — never push before the user has looked at the page and said it's good.**

1. **Show them the rendered page yourself.** The goal is that they *look at the real Shows section* before anything is published — the mechanism doesn't matter, so use whichever of these works in the environment you're in, and never ask them to run anything:
   - **A local dev server**, when the repo sits somewhere the preview process can actually read.
   - **Publish the page as an Artifact.** Works identically on a laptop and in a browser-only session, and gives a link that can be forwarded to the band for review.
   - **Serve a copy from a scratch directory**, when the repo itself is unreadable (see the caveat below). Copy the *whole* site — `index.html`, `css/`, `js/`, and all of `images/`, not just `images/gallery/` — or the hero photo 404s and the page looks broken for reasons that have nothing to do with your edit.

   Then give them the exact URL and say which section to look at.

   **Known trap on Sam's Mac:** the repo lives under `~/Documents`, which macOS TCC protects. The preview subprocess doesn't inherit that permission, so `python3 -m http.server` dies at startup on `os.getcwd()` and any server rooted in the repo 404s every file — `stat` succeeds while reads fail, so it looks like a working server serving nothing. This is not a Python bug and not worth re-debugging; fall back to an Artifact or a scratch copy. It resolves for good if the repo ever moves out of `~/Documents`.
2. **Summarize the changes** in plain language: shows removed, shows added, any About past-venues additions, and which links you set to "Details" vs "Venue" (and any you couldn't upgrade).
3. **Explicitly ask the user to look at the page and approve.** Say something like: "Please open the page, look at the Shows section, and tell me if it looks right." **Wait for a clear yes.** If they want changes, make them and return to step 1. Do not proceed to step 4 until they approve.
4. **Only after approval, publish it yourself:** `git add` the changed files, commit following the repo's existing commit style, and `git push`.

   **Push to `main` directly — do not open a pull request.** GitHub Pages publishes this site from `main`, so a PR leaves the change invisible until somebody clicks Merge, which is exactly the git-shaped chore this skill exists to avoid. This matters most in a cloud or browser-based session, where branch-and-PR is the usual default; override it here. Committing straight to `main` is the established workflow for this repo — the bandmates do it through the GitHub web UI already.

5. **Confirm it actually went live.** Pages takes a minute or so to rebuild, so don't just report success off a clean `git push`. Poll the live site until the change appears, then tell them in plain language that it's up. If it hasn't landed after a few minutes, say so plainly — that means the Pages build needs a look.
