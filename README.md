# Everlearn

Free learning from K to college. Plain HTML, CSS and JS, no build step and no backend.

Open `index.html`, or serve the folder (`python3 -m http.server`).

## What's inside

- Search any topic for a 5-stage learning path with links into Khan Academy, MIT OCW, OpenStax, LibreTexts, YouTube, Gutenberg, JSTOR, Scholar, Quizlet, Anki, Notion, Zotero and Grammarly, plus live Wikipedia, Gutenberg and Open Library results
- Courses with units, lessons, worked examples, practice with hints and retries, unit tests, a course challenge and mastery levels
- Spaced-repetition flashcards, dark and light themes
- **College Board framework:** each AP course shows its unit structure with approximate exam weights, exam format, a topic checklist per unit, the lessons that cover each unit, resource links for every unit, and a link to the official AP Central page (`js/framework.js`); units without lessons can be sent to the course builder
- **Deep dives and supplements:** every lesson shows live excerpts from Wikipedia (CC BY-SA, with attribution), Wikibooks pages, OpenStax textbook tags and tagged resource links. Lessons can be expanded into long-form deep dives, hand-written (`js/deep-hand.js` and `js/deep-hand2.js`, 25 so far), generated in the browser with AI, or batch generated with `node tools/deepen.cjs --tier AP`
- **AP exam practice** (`#/exam/<course>`): every AP course has a timed multiple-choice section (up to 30 questions drawn from all its lessons) with a rough 1-5 score estimate and review of every answer, plus two free-response questions with scoring guides and sample responses that you self-score (`js/frq.js`)
- **Course builder** (`#/build`): build a course by hand (units, lessons, explanations, worked examples, quiz questions, flashcards) or let AI draft the outline, lessons and extra questions, then edit everything. Courses auto-save in the browser, appear in the catalog, and export or import as JSON files
- **Rated practice** (`#/rated`): timed 10-question sprints that adapt to your level. Every question has a difficulty rating and your rating (overall and per subject) updates Elo-style after each answer, with rating history, tiers from Foundation to Distinguished, and a 45-second limit per question
- **Progress:** XP and levels, a daily XP goal, three daily quests, 25 badges, streaks and a 4-week activity heatmap (Progress page)
- **Tiers:** Standard, Honors and AP courses, filterable on the Courses page
- "My courses": save any topic and add notes, links and your own flashcards
- **Studio** (a study notebook): add sources (pasted text, uploaded files, Wikipedia, course lessons), then chat with them with citations, generate study guides, quizzes and flashcards, or turn them into a full course
- **AI course generator** (`#/create`): type any subject and a free model writes a full course, saved in the browser
- Progress lives in the browser, with export and import. Optional cloud sync via Firebase (see `js/config.js`)

## Courses

- Hand-written: `js/courses/*.js`, using the helpers in `js/authoring.js`
- AI-written: generated with free OpenRouter models, see below

## AI in the browser (Studio and course generator)

On the Studio page, click **Connect with OpenRouter**. This uses OpenRouter's OAuth flow to create a key in the user's own account. The key stays in their browser's localStorage and requests go straight from the browser to OpenRouter. Only free (`:free`) models are used. Sign-in needs the site served over `http://localhost` or `https`, so run `python3 -m http.server` rather than opening the file directly. A key can also be pasted by hand. Free models are third-party and rate limited, so tell users not to paste private information.

## Generating courses from the command line

1. Make a free key at https://openrouter.ai/keys and save it to `tools/.env`:

   ```
   OPENROUTER_API_KEY=sk-or-...
   ```

2. Generate one course, or work through the whole K to college list in `tools/curriculum.json`:

   ```bash
   node tools/generate.cjs --topic "Geometry" --subject Math --band 9-12
   node tools/generate.cjs --curriculum --band 6-8 --limit 3
   ```

3. Reload the site. Each run writes raw JSON to `generated/raw/`, validates and rebuilds `js/generated.js`, which the app converts into proper courses.

`--tier AP` or `--tier Honors` limits `--curriculum` to that tier (`--skip N` resumes later in the list). AP and Honors entries in `tools/curriculum.json` follow the College Board unit structure and use longer lessons and AP-style questions. OpenRouter free accounts have a daily request cap (about 50/day, or 1,000/day with $10 of credit); the tool stops cleanly when it is hit and picks up where it left off next time.

Other commands: `--list-models` shows the free models available right now, `--model id1,id2` picks specific ones, `--build` only rebuilds, `--units 5 --lessons 4` sets course size.

The tool asks for an outline, then writes each lesson separately, so it is resumable: re-run the same command and it skips finished lessons. Free models are rate limited, so big batches can take a while. Invalid lessons (bad quiz answers, missing text) are dropped by `js/normalize.js` and the app escapes all AI text, so a bad reply can't break the page.

AI-written courses are marked in the UI. Spot-check them, especially math and science.

## Publishing on GitHub Pages

The site is static (no build step). Push the folder to a GitHub repository, then in Settings > Pages choose the `main` branch and the `/ (root)` folder. The site will be served at `https://<your-username>.github.io/<repo-name>/`. `tools/.env` is git-ignored: never commit an API key. OpenRouter sign-in works on the Pages URL because it is https.
