# University of Hathbodhiya

An intimate fellowship archive for recipes, museum works, memory albums, songs, reflections, and community profiles. The existing Warm Nostalgia UI is preserved. Persistence, authentication, and authorization now run on Firebase (Spark / free tier) with Cloudinary unsigned uploads for images.

## What was completed

The previous build stored everything in `localStorage` and let anyone impersonate any member. That is replaced with:

- Firebase Authentication (Google + email/password)
- Cloud Firestore for profiles, contributions, comments, and stars
- Role-based access: `MASTER_ADMIN`, `ADMIN`, `MEMBER`
- Admin approval before community access
- Cloudinary image uploads using an **unsigned preset** (no API secret in the browser)
- Firebase Hosting-ready Vite production build

Frontend roles are display-only. Firestore Security Rules are the source of truth.

## Stack (free-tier first)

| Service | Purpose | Paid plan required? |
| --- | --- | --- |
| Firebase Auth | Google + email sign-in | No (Spark) |
| Cloud Firestore | Data + security rules | No (Spark) |
| Firebase Hosting | Static SPA | No (Spark) |
| Cloudinary | Image uploads | No (free unsigned uploads) |

Cloud Functions were intentionally **not** used. Spark cannot deploy functions, and Blaze is a billing account even when usage is free.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Firebase web keys in `.env.example` match the existing `university-of-hathbodhiya` web app. They are expected to be public; protect the project with Auth authorized domains and these Firestore rules.

## Firebase configuration

1. In [Firebase Console](https://console.firebase.google.com/) open project `university-of-hathbodhiya` (or your own project and update env vars).
2. Enable **Authentication → Sign-in method**:
   - Email/Password
   - Google (set a support email)
3. Add authorized domains: `localhost` and your Hosting domain (no `https://`, no port).
4. Create a Firestore database (production mode is fine — deploy rules immediately).
5. From this repo:

```bash
npx -y firebase-tools@latest login
npx -y firebase-tools@latest use university-of-hathbodhiya
npx -y firebase-tools@latest deploy --only firestore
```

That deploys `firestore.rules` and `firestore.indexes.json`.

## Cloudinary setup (images)

Do **not** put the API secret in the frontend.

1. Create a free Cloudinary account.
2. Settings → Upload → **Upload presets** → add an **unsigned** preset.
3. Restrict the preset: folder `uoh-archive`, max file size 8 MB, image formats only, unsigned.
4. Put the cloud name and preset name in `.env.local`:

```
VITE_CLOUDINARY_CLOUD_NAME=your_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

Text-only contributions still work if Cloudinary is not configured.

## Admin bootstrap (MASTER_ADMIN)

Rules never let a user grant themselves `MASTER_ADMIN`. The Firebase Console uses the Admin SDK and bypasses rules. After you register and verify email:

1. Sign in once so `accounts/{yourUid}` and `profiles/{yourUid}` exist (status `pending`, role `MEMBER`).
2. Firebase Console → Firestore:
   - `accounts/{yourUid}`: set `role` to `MASTER_ADMIN` and `status` to `approved`
   - `profiles/{yourUid}`: set `role` to `MASTER_ADMIN` and `status` to `approved`
3. Refresh the app.

You can now approve members from **Community Wall → Steward desk**. Ordinary admin operations cannot demote or overwrite the master admin document.

## Roles

| Role | Can do | Cannot do |
| --- | --- | --- |
| MEMBER (approved) | Create/edit/delete own contributions, comment, star, view approved content | Change roles or approve anyone |
| ADMIN | Approve/reject/suspend members, delete any contribution | Manage admins or touch MASTER_ADMIN |
| MASTER_ADMIN | Everything admins can, plus add/remove ADMIN | Accidentally drop master via the app |

Pending, rejected, and suspended users only see an access gate. They cannot read the archive.

## Security model

- Default deny in `firestore.rules`
- Email lives only in `accounts/{uid}` (owner + admins). Community wall profiles have no email.
- Users create as `MEMBER` + `pending` only
- Users cannot update their own `role` or `status`
- Duplicate stars: `starredBy` must grow by exactly the caller’s uid
- Contribution `authorId` is immutable and must match `request.auth.uid` on create
- Email/password users must verify email before documents can be created

I've set up prototype Security Rules to keep the data in Firestore safe. They are designed to be secure for least-privilege RBAC, ownership checks, and field validation. However, you should review and verify them before broadly sharing your app.

## Tests

Rules tests need the Firestore emulator and **JDK 21+** (`firebase-tools` current release no longer runs on JDK 17):

```bash
npm run test:rules
```

Critical cases covered: unauthenticated deny, self-promotion, self-approval, admin cannot mint admins, master admin protection, pending isolation, duplicate stars, owner vs admin deletes.

## Production build and Hosting

```bash
npm run build
npx -y firebase-tools@latest deploy --only hosting,firestore
```

Hosting serves `dist/` as an SPA (`**` → `/index.html`).

After deploy, add the Hosting domain to Auth authorized domains.

## Free-tier limits (honest)

Firebase Spark (approximate, check current quotas):

- Firestore: 50k reads / 20k writes / 20k deletes per day, 1 GiB stored
- Hosting: 10 GB storage, 360 MB/day transfer
- Auth: generous for a small fellowship

Cloudinary free (approximate):

- 25 monthly credits (storage + transformations + bandwidth)
- Unsigned presets can be abused if leaked — restrict folder, size, and allowed formats

If the community grows, expect to hit Firestore reads first (feed + member wall). Pagination is already in the feed (`Load earlier memories`).

## Project layout

```
src/auth/           Auth state
src/lib/            Firebase app, errors, constants
src/services/       Auth, users, contributions, Cloudinary
src/components/     Existing sanctuary UI + auth/admin gates
firestore.rules     Default-deny RBAC
firestore.indexes.json
```
