# University of Hathbodhiya — Community Archive & Memory Sanctuary

A warm, intimate, open-source archive crafted for the young Christian grads fellowship to honor and preserve the teachings, hospitality, recipes, artwork, articles, songs, and golden memories shared at the Hathbodhiya home.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following core design and architectural decisions have been confirmed and incorporated:

- **Confirmed Decision 1 (Auth & Media Storage)**: Instant Google profile authentication with local persistent storage (IndexedDB / localStorage) and seamless direct photo uploading. Ready for export or Firebase sync without requiring external API keys to start.
- **Confirmed Decision 2 (Museum Songs Experience)**: Focused song memory register documenting the hymns and Alexa playlist favorites played at the house, with memories and reflection notes, without bulky audio player widgets.
- **Confirmed Decision 3 (Unified Curatorial Tone)**: No individual names or "uncle/aunty" references. All memories honor the loving hosts, mentors, and the shared table together as one unified spirit of unconditional Christian hospitality and guidance.
- **Confirmed Decision 4 (Design System)**: Exact fidelity to the "Warm Nostalgia" specification: `#111210` / `#181714` dark warm canvas, `#22201D` card surfaces, `#E8B45A` warm amber accents, `#F5EFE3` warm cream text, Newsreader serif headings, Manrope body typography, zero search bars, and zero pill badges.

---

## 1. Overview & Core Concept

- **What It Does**: A curated digital sanctuary and communal living archive where fellowship members document and revisit cherished recipes, hand-drawn art, reflective essays, life perspectives, golden advice, and fellowship photo albums.
- **Target Audience / Persona**: The graduates, students, and friends of the "University of Hathbodhiya" fellowship who have been blessed with meals, shelter, faith guidance, and unconditional love.
- **Key Value**: Ensures that the recipes cooked with love, perspectives on Christian living, artwork, and hospitality traditions are never forgotten, allowing future generations of friends to recreate the dishes and carry forward the spirit of love without expectations.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Arrival & Sanctuary Dashboard**:
   - Members are welcomed by an intimate hero with the simple serif wordmark: `University of Hathbodhiya`.
   - Today's Featured Reflection or Memory appears in an editorial showcase with date and contributor.
   - Quick Category Grid leads to the 5 primary sanctuaries:
     - 🎨 **Museum**: Hand-drawn art & sketches, written articles on faith/life, and the Alexa & Hymns song register.
     - 🍲 **Recipe Book**: Beloved family recipes with ingredients, cooking notes, and memories around the table.
     - 📸 **Memory Albums**: Fellowship photos, gatherings, quiet tea times, and reflections with lightbox viewing.
     - 🕊️ **Things We Don't Want to Forget**: Core wisdom, perspectives on God, hospitality principles, and life quotes.
     - 🏆 **Community Wall**: The fellowship directory featuring members' Google avatars, stars received, and messages of gratitude.

2. **Google Community Sign-In**:
   - One-tap sign-in showing member profile picture, name, email, and fellowship join year.
   - Profile switch affordance for community testing (allowing any grad member to log in, add memories, and award stars).

3. **Curating & Contributing**:
   - Universal "Add to Archive" modal supporting all five categories with custom fields (e.g., Recipe step-by-step + ingredients; Art medium + reflection; Advice + biblical insight; Song title + artist + house memory).
   - Instant image upload with live preview and local storage cache.

4. **Community Love & Stars**:
   - Members can award stars (`⭐`) and write thoughtful comments on any recipe, artwork, quote, or memory album photo.
   - Contribution points and star tallies automatically populate the Community Wall.

### Visual Identity & Theme Tokens

- **Dominant Canvas**: Dark warm velvet (`#111210` / `#181714`)
- **Structural Surfaces**: Deep warm umber cards (`#22201D`) with subtle hairline borders (`#2E2A25`)
- **Primary Accent**: Warm candlelight amber (`#E8B45A`), hover tone (`#D4A045`)
- **Typography**:
  - *Headings & Wordmark*: `Newsreader` (Editorial Serif, 400 & 500 weights)
  - *Body & Controls*: `Manrope` (Clean contemporary sans-serif, 400 & 600 weights)
  - *Numerals & Timestamps*: Clean tabular figures with unboxed text separators (`·`)
- **Anti-Slop Restraint**: Zero pill badges, zero mechanical status dots, zero search bars, zero corporate cards-within-cards, and zero fake telemetry.

---

## 3. Key Product Decisions & Trade-Offs

- **No Search Bar By Design**:
  - *Chosen Approach*: Deliberate browsing via thematic categories and chronological archival journals.
  - *Why*: User explicitly mandated "no searches". This preserves the reflective, leisurely atmosphere of browsing a family photo album rather than a transactional database.
- **Client-Side Persistence with Export Capability**:
  - *Chosen Approach*: Built-in IndexedDB / LocalStorage backing with rich pre-seeded authentic memories, plus JSON backup and Firebase readiness.
  - *Why*: Instant reactivity, offline-first reliability, zero cold start delays, and guaranteed zero broken links or missing credentials during demo and daily usage.
- **Google Sign-In Simulation & State**:
  - *Chosen Approach*: Community member profile switcher and custom Google profile creator, saving user avatar, display name, and contribution ledger.
  - *Why*: Enables seamless testing of the Community Wall, starring mechanics, and contributor attribution without requiring live Google Cloud OAuth credentials during evaluation.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   University of Hathbodhiya Webapp                     │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────┐                           ┌─────────────────────┐
│    Top Bar Wordmark   │                           │    Google Profile   │
│   (3-Zone Contract)  │                           │   Session & Stars   │
└──────────────────────┘                           └─────────────────────┘
           │
           ├───────────────────────────────┬───────────────────────────────┐
           ▼                               ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
│  Sanctuary Landing  │         │  Category Archives  │         │   Community Wall    │
│  · Featured Memory  │         │  · Museum (Art/Song)│         │  · Member Avatars   │
│  · Archive Shelves  │         │  · Recipe Book      │         │  · Star Tallies     │
│  · Recent Musings   │         │  · Memory Albums    │         │  · Notes of Thanks  │
│                     │         │  · Golden Advice    │         │                     │
└─────────────────────┘         └─────────────────────┘         └─────────────────────┘
           │                               │                               │
           └───────────────────────────────┼───────────────────────────────┘
                                           ▼
                    ┌─────────────────────────────────────────┐
                    │      State Store & Media Repository     │
                    │  · Pre-seeded Curated Archive           │
                    │  · Reactive Storage (IndexedDB/Storage) │
                    │  · Direct Image Upload Cache            │
                    │  · Star & Comment Mutation Handlers     │
                    └─────────────────────────────────────────┘
```

### Core Data Models

- **ArchiveItem**: `id`, `category` (`museum_art` | `museum_article` | `museum_song` | `recipe` | `memory_album` | `advice`), `title`, `subtitle`, `content`, `images: string[]`, `metadata` (ingredients, prepTime, medium, artist, songPrompt, verses), `author` (`name`, `avatar`, `email`), `createdAt`, `starsCount`, `starredBy: string[]`, `comments: Comment[]`
- **CommunityMember**: `id`, `name`, `email`, `avatar`, `fellowshipRole`, `gradYear`, `bio`, `starsEarned`, `contributionsCount`
- **Comment**: `id`, `authorName`, `authorAvatar`, `text`, `createdAt`
