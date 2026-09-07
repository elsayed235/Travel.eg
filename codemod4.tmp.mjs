// Wave 4 fix: IMG_* token string literals -> imported URL constants.
// Only rewrites when the bare constant is imported in the same file.
// DRY_RUN=1 prints planned swaps without writing.
import fs from 'node:fs';

const FILES = [
  'src/components/planner/TripPlanner.tsx',
  'src/components/live/DahabLiveView.tsx',
  'src/components/booking/BookingReviewStep.tsx',
  'src/components/itinerary/GeneratedItinerary.tsx',
  'src/components/mytrip/sections/TripHeroCard.tsx',
  'src/components/food/FoodNowView.tsx',
  'src/components/itinerary/AlternativesModal.tsx',
  'src/components/planner/StepInterests.tsx',
  'src/components/planner/StepPace.tsx',
];
const RULES = [
  [/image: '(IMG_[A-Za-z0-9_]+)'/g, 'image: $1'],
  [/imageUrl: '(IMG_[A-Za-z0-9_]+)'/g, 'imageUrl: $1'],
  [/src="(IMG_[A-Za-z0-9_]+)"/g, 'src={$1}'],
];
const dry = process.env.DRY_RUN === '1';
let total = 0;
for (const f of FILES) {
  const src = fs.readFileSync(f, 'utf8');
  let out = src;
  const applied = [];
  const skipped = [];
  for (const [re, rep] of RULES) {
    out = out.replace(re, (m, tok) => {
      const imported = new RegExp(`import[^;]*\\b${tok}\\b`).test(out);
      if (imported) {
        applied.push(tok);
        return m.replace(`'${tok}'`, tok).replace(`"${tok}"`, `{${tok}}`);
      }
      skipped.push(tok);
      return m;
    });
  }
  total += applied.length;
  if (dry) {
    console.log(`${f}: rewrite=${applied.length} skip=${skipped.length}`);
    for (const t of skipped) console.log(`   SKIP ${t}`);
  } else if (applied.length) {
    fs.writeFileSync(f, out);
    console.log(`${f}: rewrote ${applied.length}`);
  }
  if (skipped.length && !dry) console.log(`${f}: SKIPPED ${skipped.join(',')}`);
}
console.log(`total=${total} ${dry ? 'DRY-RUN' : 'WRITTEN'}`);
