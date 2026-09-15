# Music Center Design Specification

Date: 2026-09-16
Target repository: `skenakun/skenakun.github.io`
Target branch: `V1`
Status: User-approved design, pending implementation plan

## 1. Goal

Add a fullscreen Music Center to the existing Waifu Gallery website. The feature accepts shared links from popular music and video streaming services, resolves the provider, plays content through official embeds or supported iframe APIs, stores a local library and playback state, and preserves the website's existing visual identity through its CSS theme variables.

The implementation remains frontend-only and compatible with GitHub Pages. It does not require provider account login, OAuth, a custom backend, media extraction, scraping protected content, or downloading audio/video.

## 2. User Experience

A new Music action is added to the website alongside the existing feature actions. Opening it shows a fullscreen overlay with a desktop-style three-column layout on large screens and a compact mobile layout on small screens.

The desktop layout contains:

- Left navigation for Home, Favorites, Library, Recently Played, and local playlists.
- Main content area for link input, Home content, or Now Playing content.
- Right-side Up Next queue.
- Persistent bottom transport controls.

The mobile layout contains:

- Top bar with title, minimize action, and URL input.
- Main content area.
- Bottom player.
- Bottom navigation for Home, Library, Add, Favorites, and Queue.
- Queue presented as a drawer rather than a permanent side panel.

The fullscreen Music Center can be minimized. Playback continues and a compact mini player remains visible at the bottom of the main website. Reopening Music Center restores the previous UI state without recreating the active player.

## 3. Visual Integration

Music Center must inherit the website's existing visual tokens rather than define an independent theme.

Primary CSS variables include the existing website tokens such as:

- `--bg`
- `--surface`
- `--surface-strong`
- `--ink`
- `--muted`
- `--purple`
- `--violet`
- `--pink`
- `--rose`
- `--cyan`
- `--blue`
- `--yellow`
- `--orange`
- `--green`
- `--line`
- `--shadow`
- `--shadow-soft`
- radius tokens already defined by the website

Music Center does not duplicate theme state in JavaScript. Any existing Color Burst or alternate palette mechanism affects Music Center automatically through CSS variable inheritance.

All Music Center selectors use an `mc-` namespace to reduce collisions with Gallery, Mini Game, and Android Simulator styles.

## 4. Loading Strategy

Music Center follows the website's existing lazy-feature pattern.

The initial Gallery load must not eagerly initialize provider SDKs or create streaming iframes. The feature loader preloads Music Center assets on hover or focus where appropriate and initializes the feature only after the user opens it.

Provider scripts are loaded on demand and cached through a one-time promise so the same third-party SDK is never injected more than once.

Example lifecycle:

1. Website loads without Music Center runtime.
2. User focuses, hovers, or activates Music.
3. Music Center CSS and JavaScript load.
4. Local state restores.
5. No provider SDK loads until that provider is actually needed.
6. User starts playback through an explicit interaction.

## 5. Proposed File Boundaries

```text
music-center.js
music-center.css

music/
├── music-store.js
├── music-resolver.js
├── music-player.js
├── music-queue.js
├── music-metadata.js
└── providers/
    ├── youtube.js
    ├── spotify.js
    ├── soundcloud.js
    ├── apple-music.js
    ├── deezer.js
    ├── tidal.js
    ├── bandcamp.js
    ├── mixcloud.js
    └── generic.js
```

Responsibilities are deliberately separated:

- `music-center.js` owns feature initialization and UI orchestration.
- `music-resolver.js` validates and normalizes incoming URLs.
- `music-player.js` owns active-provider selection and unified playback state.
- `music-queue.js` owns local queue operations, repeat, shuffle, ordering, and transition policy.
- `music-store.js` owns IndexedDB persistence and schema migration.
- `music-metadata.js` performs best-effort metadata resolution without becoming a playback dependency.
- Provider adapters own provider-specific URL translation, SDK/embed creation, capabilities, events, and cleanup.
- `generic.js` handles recognized but non-controllable external URLs and safe fallback behavior.

No provider-specific logic should leak directly into the Gallery core.

## 6. URL Resolver

The resolver accepts only safe external HTTPS URLs for provider links.

Rejected schemes include:

- `javascript:`
- `data:`
- `file:`
- arbitrary `blob:` input

The resolver uses an explicit provider allowlist for first-class integrations and converts supported URLs into a normalized entity.

Conceptual result:

```js
{
  provider: "youtube",
  sourceBrand: "youtube-music",
  type: "track",
  sourceId: "ABC123",
  canonicalUrl: "...",
  originalUrl: "...",
  fingerprint: "youtube:video:ABC123"
}
```

Tracking query parameters should be discarded when they are not part of playback identity. Parameters that affect content identity or playback context, such as a video ID, playlist ID, or meaningful start time, are preserved.

Equivalent forms of the same item should deduplicate to one fingerprint where practical. A YouTube video shared through `youtu.be`, `youtube.com`, or a compatible `music.youtube.com` link should resolve to a stable YouTube video identity while retaining the original source brand for UI presentation.

## 7. Provider Adapter Contract

All providers expose a common adapter interface to the player manager.

Conceptual operations:

```text
load(item)
play()
pause()
seek(seconds)
setVolume(value)
getState()
destroy()
```

Each adapter reports actual capabilities at runtime.

Conceptual capability object:

```js
{
  play: true,
  pause: true,
  seek: false,
  volume: false,
  next: false,
  previous: false,
  progress: false,
  endedEvent: false
}
```

The UI enables controls only when the active adapter supports them. Unsupported controls are disabled or delegated to the provider's official embed.

## 8. Provider Support Model

Providers are grouped by playback capability rather than pretending every service has identical controls.

### Controlled

Provider exposes enough iframe or widget control to support reliable custom transport controls.

Expected examples include:

- YouTube
- Compatible YouTube Music links through the YouTube playback engine
- Spotify where the official iframe API exposes the required operation
- SoundCloud where the official widget API supports the operation
- Mixcloud where its widget API supports the operation

### Embedded

Content can be shown and played through an official embed, but custom controls may be partial or unavailable.

Expected candidates include:

- Apple Music
- Deezer
- TIDAL
- Bandcamp
- provider-specific cases where the service exposes an official embed but limits parent-page control

### External fallback

The link is recognized and can be stored in the local library, but safe embedded playback is not available for the specific item or provider. The UI offers an Open Original action instead of fabricating unsupported playback controls.

Provider capabilities are discovered from documented API behavior and validated during implementation testing. Provider support must degrade gracefully if a service changes its embed policy.

## 9. YouTube and YouTube Music

YouTube is the primary fully controlled provider.

Supported input forms include normal YouTube video links, shortened video links, playlist links, and compatible YouTube Music video or playlist links.

YouTube Music remains visually identified as YouTube Music when that was the source hostname, but compatible IDs may be played through the YouTube iframe engine.

The implementation must not scrape YouTube pages or require a YouTube Data API key merely to play a shared link.

Playlist playback should rely on official player playlist functionality when possible.

## 10. Unified Player State

Fullscreen UI and mini player read one player state. They do not maintain independent playback state.

Conceptual state:

```js
{
  currentItem: null,
  provider: null,
  status: "idle",
  position: 0,
  duration: null,
  volume: 0.8,
  queue: [],
  queueIndex: -1,
  repeatMode: "off",
  shuffle: false,
  minimized: false
}
```

Provider events flow into the player manager, which updates unified state and notifies all UI surfaces.

Only one provider is active at a time.

Provider switching follows this policy:

1. Pause the current provider where supported.
2. Prepare the target provider.
3. Load the requested item.
4. Mark the new provider active only when initialization succeeds enough to present a stable state.
5. If the target provider fails, show a provider-specific failure state without automatically resuming the previous provider.

This avoids simultaneous playback from multiple embeds.

## 11. Permanent Playback Host

The active provider iframe or widget lives in a stable playback host that survives overlay minimization.

Conceptual page structure:

```html
<div id="mc-playback-host"></div>
<div id="mc-overlay"></div>
<div id="mc-mini-player"></div>
```

Minimizing Music Center hides or transitions the overlay. It must not destroy and recreate the active player unless the provider adapter itself requires a controlled rebuild after an error.

This requirement is central to continuous playback.

## 12. Local Library

Music Center maintains a local cross-provider library.

Supported local concepts include:

- Saved items
- Favorites
- Recently Played
- Local playlists
- Persistent queue

Favorites affect only Music Center's local database. They do not mutate the user's streaming-service account.

Local playlists may contain items from different providers in one ordered list.

A track stored in multiple local playlists remains one canonical library entity referenced by multiple playlist entries.

## 13. IndexedDB Schema

Use a separate database from the Gallery's storage.

Database name:

```text
musicCenterDB
```

Initial object stores:

```text
tracks
playlists
playlistItems
history
favorites
queue
settings
```

The database stores references and metadata only. It must not cache downloaded audio or video payloads.

### tracks

Stores provider identity, canonical URL, original URL, source ID, content type, fingerprint, metadata, artwork URL when available, and relevant timestamps.

### playlists

Stores local playlist identity and user-visible name.

### playlistItems

Stores ordered references from local playlists to canonical track entities.

### history

Stores track references and playback timestamps. An item enters history when playback actually begins, not when the URL is merely pasted.

History is capped at 200 entries in V1.

### favorites

Stores local favorite references.

### queue

Stores the persistent local queue order and the current queue index where appropriate.

### settings

Stores lightweight Music Center preferences, including volume, repeat mode, shuffle state, active view, minimized state, and similar UI preferences.

Schema migration must be versioned so future changes do not require deleting the user's library.

## 14. Restore Behavior

After a full page reload, Music Center restores:

- Library
- Favorites
- Recently Played
- Local playlists
- Queue
- Volume
- Repeat mode
- Shuffle state
- Last relevant Music Center view

Playback never resumes automatically after a reload.

The UI may offer a Resume action for the previous item. Playback begins only after a user gesture, respecting browser autoplay restrictions.

Last-known playback position may be offered only for adapters where reading and seeking position is reliable.

## 15. Queue

The queue is a Music Center construct and may mix providers.

Supported V1 operations:

- Add to end
- Play next
- Remove
- Clear
- Drag reorder
- Previous
- Next
- Shuffle
- Repeat off
- Repeat all
- Repeat one

Provider-native album or playlist contents are not scraped merely to force them into the local queue. Where a provider manages its own sequence inside an official embed, Music Center treats that embed as one playable entity unless official APIs expose individual items safely and without credentials beyond the approved architecture.

If an adapter emits a reliable ended event, Music Center may automatically advance to the next local queue item. If it cannot know when playback ends, automatic advancement is disabled for that item rather than guessed.

## 16. Shuffle Semantics

Shuffle must not mutate the stored canonical order of a playlist or queue.

The queue manager keeps original order separately from the transient shuffled traversal order. Turning shuffle off restores original ordering.

## 17. Metadata Resolution

Metadata is best-effort and non-blocking.

Resolution order:

1. Parse identity available directly from the shared URL.
2. Use an official metadata, oEmbed, iframe, or widget mechanism where available and allowed in a frontend-only context.
3. Accept metadata delivered by provider player events.
4. Fall back to provider name, original URL, known content type, and default provider artwork.

Metadata states:

```text
loading
ready
partial
unavailable
```

Metadata failure does not automatically equal playback failure.

Untrusted third-party HTML should not be persisted as library data. The application builds known-safe embeds from validated provider information.

## 18. Mini Player

The mini player appears after Music Center is minimized only when a current item exists.

It contains the subset of controls that the active adapter can truthfully support, such as:

- Artwork
- Title and artist or creator
- Play or pause
- Previous and next where available
- Progress where readable
- Volume where controllable
- Reopen Music Center

The mini player must share the same unified player state as the fullscreen UI.

## 19. Error Handling

Primary user-visible error classes:

```text
INVALID_URL
UNSUPPORTED_PROVIDER
EMBED_UNAVAILABLE
PLAYBACK_ERROR
```

Nonfatal internal or degraded states include:

```text
METADATA_UNAVAILABLE
PLAYER_API_TIMEOUT
STORAGE_ERROR
NETWORK_ERROR
```

Nonfatal metadata failure does not tear down a working player.

Suggested timeout targets for implementation validation:

- Provider API/script readiness: about 8 seconds
- Metadata resolution: about 6 seconds
- Embed readiness: about 10 seconds

Timeouts transition to a useful fallback state. The UI must never display an indefinite loading spinner with no exit path.

Common recovery actions:

- Retry
- Open Original
- Remove from queue
- Skip to Next

## 20. Security Boundaries

Music Center is not a general-purpose iframe injector.

Security requirements:

- External provider URLs must use HTTPS.
- Provider hostnames are normalized and validated.
- Embed URLs are constructed by provider adapters from known patterns rather than copied blindly from user input.
- Dangerous URL schemes are rejected.
- Iframe permissions are limited to what each official player needs.
- Third-party HTML is not trusted as application markup.
- No attempt is made to bypass DRM, authentication, subscription restrictions, geo restrictions, or provider embed restrictions.

## 21. Responsive Behavior

Large screens use:

```text
Sidebar | Main | Queue
```

Tablet uses a compact sidebar or navigation plus main content, with Queue as a drawer where necessary.

Mobile uses a top bar, main content, bottom player, bottom navigation, and queue drawer.

Fullscreen sizing uses modern dynamic viewport units such as `100dvh` with sensible fallback behavior.

The mini player must not obscure critical controls from the existing website.

## 22. Accessibility

Interactive controls use semantic elements and visible focus treatment.

Music Center should support keyboard interaction where it does not conflict with the surrounding Gallery.

Candidate shortcuts while Music Center is the active context:

- Space for play or pause
- Left and right arrows for seek only when the active adapter supports seeking
- M for mute where supported
- Escape to minimize Music Center

Keyboard shortcuts must not take over the page when focus is in a text field or when Music Center is not the active interaction context.

The design respects `prefers-reduced-motion` and avoids requiring animation to understand state.

## 23. Browser and Autoplay Behavior

Target browsers:

- Modern Chromium-based browsers
- Modern Firefox
- Modern Safari
- Mobile Chrome
- Mobile Safari

Third-party cookie policy, tracking prevention, iframe restrictions, and autoplay rules may vary by browser and provider.

The first playback start always comes from a user gesture. Music Center must degrade to an embed or Open Original fallback where browser policy prevents richer integration.

## 24. Testing Strategy

### Resolver tests

Cover:

- Normal URLs
- Short URLs
- Playlist URLs
- YouTube Music URLs
- Malformed URLs
- Duplicate-equivalent URLs
- Relevant query parameters
- Tracking parameters
- Unsafe schemes
- Provider-lookalike domains

### Store tests

Cover:

- Fresh database initialization
- CRUD for each store
- Deduplication
- Queue persistence
- History cap
- Local playlist references
- Schema migration
- Storage failure behavior

### Queue tests

Cover:

- Add
- Play next
- Remove
- Clear
- Reorder
- Previous and next
- Shuffle preserving canonical order
- Repeat off, all, and one
- Cross-provider transitions

### Player tests

Cover:

- Single active provider
- Provider switching
- Supported control mapping
- Unsupported control disabling
- Adapter readiness timeout
- Playback failure
- Ended-event advancement where available
- Minimize and reopen without rebuilding the active player

### UI tests

Cover:

- Fullscreen open
- Minimize
- Reopen
- Home
- Library
- Favorites
- Recent
- Local playlist creation and editing
- Queue drawer
- Empty states
- Loading states
- Error states
- Theme inheritance
- Alternate palette or Color Burst behavior
- Reduced motion
- Keyboard focus behavior

### Responsive tests

Validate representative desktop, tablet, and mobile viewport sizes plus mobile dynamic viewport behavior.

### Provider smoke tests

Each first-class provider must be tested with at least one known public share link and any officially supported playlist or collection form relevant to that provider.

## 25. V1 Scope

V1 includes:

- Fullscreen Music Center overlay
- Persistent mini player
- Universal URL resolver
- YouTube integration
- Compatible YouTube Music integration
- Spotify integration
- SoundCloud integration
- Mixcloud integration
- Recognition plus official embed or fallback paths for Apple Music, Deezer, TIDAL, and Bandcamp
- Generic external-provider fallback
- Local library
- Favorites
- Recently Played
- Cross-provider local playlists
- Persistent queue
- Shuffle
- Repeat
- Responsive UI
- Website-native theme variables and Color Burst inheritance
- Lazy feature loading
- Safe URL validation
- Graceful provider failure handling

## 26. Explicit Non-Goals for V1

V1 does not include:

- Provider account login
- OAuth
- Synchronizing Spotify Liked Songs or playlists into the user's Spotify account
- Synchronizing YouTube subscriptions or account library
- A custom backend
- Media proxying
- Audio or video downloading
- Stream extraction
- DRM circumvention
- Scraping hidden playlist contents
- Circumventing embed, subscription, geo, or authentication restrictions
- Claiming full custom controls where a provider exposes only an official embedded player

## 27. Acceptance Criteria

The feature is ready for V1 when all of the following are true:

1. The existing Gallery still loads and functions when Music Center is never opened.
2. Music Center loads lazily and opens as a fullscreen overlay.
3. Its colors and surfaces inherit the current website theme variables.
4. Supported URLs normalize into stable provider entities.
5. Unsafe input cannot become an arbitrary iframe URL.
6. YouTube video playback works through the supported iframe mechanism.
7. Compatible YouTube playlist playback works without scraping.
8. YouTube Music links that map to compatible YouTube IDs play while retaining YouTube Music branding in Music Center.
9. Spotify, SoundCloud, and Mixcloud use their supported official embed or control mechanisms without fake capabilities.
10. Apple Music, Deezer, TIDAL, and Bandcamp resolve to an official embed or graceful Open Original fallback according to runtime capability.
11. Only one provider is active at a time.
12. Minimizing Music Center does not restart or destroy an active player unnecessarily.
13. The mini player and fullscreen UI remain synchronized.
14. Favorites, library items, recent history, local playlists, queue, and settings persist locally.
15. Reloading the website never autoplays media without a user gesture.
16. Cross-provider local playlists and queues remain valid even when some entries can only use embedded or external playback.
17. Errors produce a recoverable UI rather than a blank screen or endless spinner.
18. Desktop and mobile layouts remain usable.
19. Reduced-motion and keyboard behavior are respected.
20. No implementation path depends on downloading or extracting protected media.

## 28. Implementation Constraints

The implementation should preserve current project conventions where they do not conflict with this design.

No unrelated refactoring is part of this feature. Changes to the existing feature loader or index markup should be limited to what is necessary to register Music Center, create its trigger, and provide stable mount points.

If repository inspection during implementation reveals that the existing loader has a reusable registration pattern, Music Center should use it instead of introducing a parallel loader architecture.

If a provider's current official API behavior conflicts with an assumption in this document, implementation must prefer documented current behavior and downgrade the affected capability rather than add unofficial scraping or bypass logic.

## 29. Design Review Notes

Self-review completed against the approved conversation decisions.

- No unresolved TODO or TBD placeholders remain.
- Fullscreen overlay, persistent mini player, link-only operation, local persistence, broad provider recognition, and Provider Adapter Layer are consistent across the document.
- V1 stays frontend-only.
- Provider capability differences are explicit.
- Playback continuity is handled through a permanent playback host.
- Theme integration is based on existing CSS variables rather than a separate Music Center palette.
- Storage responsibility is separated from the Gallery database.
- Security and non-goals explicitly exclude arbitrary iframe injection, scraping protected content, media extraction, and access-control bypasses.
- Acceptance criteria map to the approved design and can drive the implementation plan and tests.
