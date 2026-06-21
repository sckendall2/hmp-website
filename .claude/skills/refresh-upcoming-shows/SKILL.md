---
name: refresh-upcoming-shows
description: Refresh the Shows section of the HMP website — remove past shows (offering to move each venue into the About past-venues list), add new upcoming shows, and audit every show's Details/Venue link. Use when the user wants to update, refresh, or clean up the band's show listings.
---

# Refresh Upcoming Shows

Updates the Shows section in `index.html`. Work through the three phases in order, then verify and commit.

Today's date is available in context — treat any show whose date is strictly before today as "past."

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

## Phase 1 — Remove past shows

1. Read the current `.show-row` entries and identify every show dated before today.
2. List the past shows you found so the user can confirm.
3. For **each** past show, ask the user whether to add its venue to the **past-venues list** in the About section (the second `<p class="about-bio">`). The past-venues paragraph is a comma-separated prose list — insert the venue naturally, avoiding duplicates and keeping the existing closing phrasing ("...house concerts, block parties, and a shocking variety of porch fests.").
   - Note: recurring venues (e.g. Remnant Brewing, Midway Cafe) may already be in the list — don't duplicate.
   - Porch fests are generally already covered by the closing "shocking variety of porch fests" — ask before adding a specific one.
4. Remove the past `.show-row` blocks.

## Phase 2 — Add new upcoming shows

1. Ask the user for new shows. For each, collect: date, venue name, time, city/state, and any event URL they already have.
2. Insert each as a new `.show-row` in correct chronological position.
3. Match the existing date format exactly: `Sat, Jul 11` (abbreviated weekday, abbreviated month, no leading zero on day).
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

## Finish

1. If a local server is running, the user can eyeball the result; otherwise just confirm the markup.
2. Show the user a summary of changes (removed shows, added shows, link upgrades).
3. Commit and push only when the user approves, following the repo's existing commit style.
