# Show-link policy

Each show row in the Shows section of `index.html` has exactly one link. This is how to choose and label it. (Applies whether you're editing by hand or running the `refresh-upcoming-shows` skill.)

## The policy

1. **Prefer a link to the precise event page, labeled "Details".**
   A specific event-detail URL — a Tockify event page (e.g. `tockify.com/midwaycafejp/detail/...`), an Eventbrite event, the venue's `/events/<this-event>` page, or a festival's per-event / per-band page. **Not** the venue or festival homepage.

2. **Fall back to a venue link labeled "Venue"** only when no precise event page exists, or the precise page is too sparse (e.g. it lacks venue/location info). This fallback applies **even for porch fests**.

3. **Dig hard for the precise URL.** Don't settle for a venue homepage or a generic calendar landing page. Search the venue's events calendar (many Boston-area venues use Tockify or Eventbrite), the festival's schedule or band-specific pages, etc. Only label a link "Details" once you've confirmed it actually points at *this specific event*.

## Why

The goal is to land visitors on the most useful, event-specific page possible. A bare venue homepage is a last resort, and labeling it "Venue" tells visitors honestly what they're getting.
