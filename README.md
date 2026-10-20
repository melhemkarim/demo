# Linky gift (Next.js), one project per gift

This project is one gift. The gift opens at the plain address (`http://localhost:3000/` while editing, or just the site name once online). There is nothing to add after the address.

## Edit and preview
```bash
npm install        # first time only
npm run dev
```
Open http://localhost:3000. Edit **`config.ts`** (names, letter, captions, messages) and put the photos in **`public/photos/`**. Use the file name only: `img: 'us.jpg'`. The page updates when you save.
Search `config.ts` for `EDIT` to find the parts to personalize.

## Publish
```bash
npm run build
```
This creates a folder called **`out`**: plain files, no server needed. Upload it:
- **Netlify Drop** (app.netlify.com/drop): drag the `out` folder in, then rename the site in Site settings (for example `dana-for-you`). Sign in first so the site does not expire.
- Cloudflare Pages (direct upload) or any static host also works.

Send the customer the site address. To change something later, edit, run `npm run build` again, and upload `out` again.

## Making the next gift
1. Copy this whole project folder and rename the copy (for example `mia-gift`). Copying `node_modules` too saves running `npm install` again; if you leave it out, run `npm install` in the copy.
2. Delete the old photos from `public/photos/`, add the new ones, and edit `config.ts`.
3. `npm run dev` to check it, `npm run build`, upload `out`.

Each gift is a separate copy, so one customer's gift can never show up in another's. The downside is that if you improve the 3D code in `public/gift/main.js`, you have to copy that change into your older gift folders yourself.

## Where things are
| Path | What it is |
|---|---|
| `config.ts` | All the text for this gift. The only file you normally edit. |
| `public/photos/` | The photos for this gift. |
| `public/gift/main.js` | The original 3D/animation/sound code. Gift, cake and balloon colors: search for `0xFF4F8B`. |
| `public/vendor/` | Three.js and GSAP, kept as bundled files because the engine uses the older Three.js API. |
| `app/globals.css` | The stylesheet (colors are the variables at the top). |
| `components/` | Loads the 3D engine and the page markup. |
| `lib/types.ts` | The shape of `config.ts` (your editor autocompletes and flags typos). |

## Wording for non-birthday gifts
`config.ts` has an optional `text: { ... }` block that changes headings and buttons (it is set up for a love gift now). Anything you leave out keeps the birthday wording. For a birthday, delete the whole `text` block and set `age`.

## Good to know
- The pages are marked `noindex`, so Google will not list them. Anyone with the address can still open it.
- Do not upgrade `public/vendor/three.min.js` to a recent Three.js without testing: the engine uses APIs that newer versions removed.
