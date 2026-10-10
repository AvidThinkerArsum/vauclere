# Vauclère: Verdin & Sumac

A one-page site for **Vauclère**, a small atelier that builds two open two-seaters: **Verdin** (sage, front-engined) and **Sumac** (red over silver, mid-engined). As you scroll the opening section, the car is seen from straight above. Verdin bursts apart, its panels turn and swap colour, and it closes up again as Sumac, facing the other way.

**Everything here is fictional.** Vauclère, Verdin and Sumac are invented names. No real company, car, logo or trademark appears on the page. Nothing is for sale, and the enquiry form sends nothing. Both cars are drawn in code as layered SVG, with no photos and no generated images.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  (also serves /car-lab, a preview of the car drawing used only in dev)
npm run build    # static export into out/
```

`npm run build` writes a fully static site to `out/`. To host it under a sub-path such as GitHub Pages, set `BASE_PATH`:

```bash
BASE_PATH=/my-repo npm run build
```

The workflow in `.github/workflows/deploy.yml` builds and publishes the site to GitHub Pages on every push to `main`. Before the first run, replace `/__REPO__` in that file with `/<your-repo-name>`, then set **Settings → Pages → Source** to "GitHub Actions".

## Change names, copy and colours

All names, copy and colours are in **`lib/site.ts`**:

- `SITE`: the company name, nav links, manifesto text, figures, enquiry text and footer disclaimer.
- `CARS.a` / `CARS.b`: each car's `wordmark` (the big wide type), `name`, `line`, `description`, `specs` and `anatomy` callouts. Each `palette` sets that car's hero background, stripe colour and ink colour. `paints` is the list of swatches shown in the colour section.

The factory paint of the drawing itself (body, accent and interior) is set in `components/car/palette.ts` (`DEFAULT_PAINT`). Keep it in step with the first entry of each car's `paints`.

## Where things live

| Path | What it does |
| --- | --- |
| `components/hero/Hero.tsx` | The pinned scroll sequence. The keyframes in `K` control explode → turn and colour swap → close, plus the stripes, wordmarks and the 01/02 counter |
| `components/car/` | The car drawing. `types.ts` is the contract: `morph` 0→1 goes from car A to car B, `explode` 0→1 goes from assembled to fully exploded, and `paint` overrides colours |
| `components/sections/` | Manifesto, Anatomy (exploded callouts), Models, Colour (paint configurator), Inquiry |
| `app/car-lab/page.dev.tsx` | Preview page for the drawing. It is built only by `next dev`, never into the export |

Built with Next.js (App Router, static export), Tailwind CSS v4 and framer-motion. Scroll animation changes only transforms and opacity on the car. Visitors who ask for reduced motion get two still slides instead.
