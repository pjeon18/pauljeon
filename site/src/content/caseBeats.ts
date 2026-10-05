// The story-kit layer for the template case studies (/work/:slug).
// site.ts keeps the original record (headings, images, captions, stats);
// this file adds what the story kit needs on top: each section rewritten as
// a few beats in order, which sections sit on a dark band, the one thesis
// that lights up, an accent, and an optional live embed. Sections line up
// with site.ts by index.

export interface StoryLayer {
  accent: string
  accentDark?: string // a lighter accent for text on dark bands
  night?: string // the dark band color, so dark breaks are not the same black on every study
  thesis?: { text: string; accent?: string; after: number }
  embed?: { src: string; title: string }
  stats?: string[] // replacement stat sentences, by index, when the site.ts label reads badly
  sections: { beats: string[]; dark?: boolean; cap?: string }[]
}

export const caseBeats: Record<string, StoryLayer> = {
  'the-dot': {
    accent: '#E0352B',
    embed: { src: 'https://pjeon18.github.io/dot-onboarding/', title: 'The Dot' },
    thesis: { text: 'Three colors and no buttons. The dot is the whole navigation of the form.', accent: 'the whole navigation', after: 1 },
    sections: [
      { beats: [
        'On this site’s homepage, the period after “Hi, I’m Paul” walks first-time visitors around the page.',
        'People kept mentioning the dot. This project asks whether it could do a job instead of a tour.',
        'A Next button looks the same whether you can press it or not.',
        'The dot is stateful. Its color tells you where you are before you read anything.',
      ] },
      { beats: [
        'Red means it is moving. Black means it is waiting on you. Green means you can go.',
        'Tap it with something missing and it darts to the gap and back.',
        'Tap it with something wrong and it shakes its head at the field.',
        'It stays black through both, so three colors stay three.',
      ] },
      { beats: [
        'The dot arrives huge, dead center of a frame pushed in to twice its size.',
        'It slides aside and parks. Only then does the line stream out beside it, a letter at a time.',
        'The motion is ported from the homepage dot. It slows but never stops, stretches with speed and squashes on landing.',
      ], cap: 'Wrong, not missing. The dot goes to the field and shakes its head, and the underline goes red with it.' },
      { beats: [
        'Each time the dot leaves a screen, a small copy flies to the left margin and settles there.',
        'Faint dots below mark the screens to come, so the column is the progress bar.',
        'Tap a filled dot and the live one flies back, with your answer kept.',
        'Tap it while it is red and it skips to the end of the beat.',
      ] },
      { dark: true, beats: [
        'A demo with made-up questions proves little, so it runs Duolingo’s five onboarding questions both ways.',
        'One tab uses a progress bar and a Continue button. The other uses the dot.',
        'Same questions, same type, same colors. The only thing compared is the mechanism.',
        'In the dot version, each question arrives its own way.',
      ], cap: 'The third arrival. The dot rules a line under the question and the letters fill in behind it.' },
      { beats: [
        'One easing curve over both laps of the orbit made the first lap sluggish and the second a burst.',
        'The curve is now chosen from a simulated speed profile instead of by eye.',
        'A 13px dot scaled up five times looked pixelated, so it is drawn at 80px and scaled down.',
        'Letters wrapped as loose spans let the browser break a line inside a word.',
      ] },
      { beats: [
        'It fits short flows with one decision per screen. Onboarding, checkout, surveys, consent.',
        'It fails on dense forms, where ten fields leave the dot nowhere to park.',
        'It fails on anything done daily. An animation that is charming once gets tiresome by the tenth time.',
        'A hidden Continue for screen readers is the floor of accessibility, not the answer.',
      ], cap: 'The baseline. The same question behind a Continue button, in the same palette.' },
    ],
  },

  'org-chart-explorer': {
    accent: '#2B4C8C',
    night: '#0d1830',
    accentDark: '#86A6EA',
    thesis: { text: 'There is no server to send personnel data to, so there is nothing for security to review.', accent: 'nothing for security to review', after: 1 },
    stats: [
      'rows in the real export it was built and validated against.',
      'bytes transmitted. Parsing, search and the tree all run in the tab.',
      'gzipped, for the entire application.',
    ],
    sections: [
      { beats: [
        'A rep does not want an org chart. A rep wants one person, in context, fast.',
        'Who owns this division, who they report to, and who is the right first call.',
        'So the tree is only there to give context around the person you searched for.',
        'Before this, every question meant scrolling one very large image and reading small text.',
      ], cap: 'The upload screen makes the privacy promise up front. Your file is read in your browser and never uploaded.' },
      { dark: true, beats: [
        'The input is a complete personnel roster. Every name, title and manager in a company.',
        'Uploading that would need sign-off before a rep could use it once.',
        'So the file is read and parsed in the browser and held in memory. No fetch, no storage, no analytics.',
        'Nothing leaves the browser, so there is nothing to review.',
      ] },
      { beats: [
        'Real exports are inconsistent, so the parser bends.',
        'Manager, Reports To and Supervisor all land in the same field.',
        'An import report says what happened. How many people loaded, how many manager links pointed at nobody, and how many names repeated.',
        'A duplicate cannot corrupt the tree, and the banner says when a reporting line is a guess.',
      ] },
      { beats: [
        'Filtering a tree usually means losing the structure or filtering nothing.',
        'Selecting a division shows the matches plus every manager above them, dimmed as context.',
        'The number beside each filter is exact, so a rep never clicks into an empty result.',
        'Search is fuzzy because reps half-remember names. Facets stay exact so data problems stay visible.',
      ] },
      { beats: [
        'Selecting someone opens their full reporting trail as clickable pills.',
        'Walking back up the chain keeps the trail below it, so you never lose your place.',
        'Copy intro path turns the chain into one line a rep can paste into an email.',
      ] },
      { beats: [
        'It shipped with a runbook, a deploy policy scoped to four actions, and a rollback procedure.',
        'A written table of security advisories meant their review held no surprises.',
        'Access control was raised as an open decision, because the app has no login of its own.',
      ] },
      { beats: [
        'It is JavaScript, not TypeScript. The internship ended before the migration, and I would rather say so.',
        'A reload loses your file, and nothing is deep-linkable.',
        'Fuzzy search has no ranking, and there are no tests.',
      ] },
    ],
  },

  'onapsis-gtm': {
    accent: '#0E7C86',
    night: '#062628',
    accentDark: '#5CC8D0',
    thesis: { text: 'The output tells you which of its own answers to trust.', accent: 'which of its own answers to trust', after: 2 },
    stats: [
      'contacts in the addressable market, and none of them ranked.',
      'scored, sales-ready leads across more than 70 target accounts.',
      'confidence on every score, because the model was confident and wrong on odd titles.',
    ],
    sections: [
      { beats: [
        'A 13,000-row contact list is not a pipeline. The team already had the rows.',
        'What they lacked was a way to say which accounts deserved a rep’s morning.',
        'Onapsis sells to both security and SAP teams, so the targets are CISOs, CIOs, security VPs and SAP Basis leads at once.',
      ] },
      { beats: [
        'A pipeline in Google Apps Script, where the team already worked, pulls and enriches contacts from ZoomInfo.',
        'The output is a ranked sheet a rep can act on that morning.',
        'A Gemini layer reads free-text job titles and scores each contact against the target profile.',
        'The hard cases are titles that sound senior but have nothing to do with security or SAP.',
      ] },
      { dark: true, beats: [
        'The model was confident and wrong on unusual titles often enough to matter.',
        'A score that never says when it is guessing teaches reps to distrust all of it.',
        'So every score carries a confidence rating. High goes straight to reps. Low goes to a person.',
        'The model does the bulk sorting, people make the close calls, and each score says which one it needs.',
      ] },
      { beats: [
        'The first batch produced 74 qualified contacts from 47 accounts. By August it was over 300 leads across more than 70.',
        '300 leads is an output count, not an outcome.',
        'Acceptance rate, meetings booked and precision against a hand-checked sample were never measured.',
        'Next would be a few hundred hand-labelled titles, to calibrate the confidence cut points.',
      ] },
    ],
  },

  'f1-undercut': {
    accent: '#E10600',
    accentDark: '#ff6b5e',
    night: '#17100f',
    thesis: { text: 'The variable everyone names first carries almost no signal. The circuit carries most of it.', accent: 'The circuit carries most of it.', after: 2 },
    stats: [
      'undercut attempts, extracted from eleven seasons of race data.',
      'of them succeeded, which is the whole modeling problem in one number.',
      'test AUC on the baseline, against 0.900 on train.',
    ],
    sections: [
      { beats: [
        'No labelled undercut dataset exists, so the first job was defining the event.',
        'An attempt is a pit stop followed by a rival’s stop within five laps. It succeeds if the attacker comes out ahead.',
        'Pace averages never include the lap being predicted. Otherwise the model would be peeking at the answer.',
        'Keeping only gaps under two seconds leaves 761 attempts, and 77 successes.',
      ] },
      { beats: [
        'With 77 positives, predicting failure every time scores about 90%.',
        'The baseline is an interpretable, class-weighted logistic regression. On a pit wall, a probability you can explain beats a black box.',
        'It scores 0.713 AUC on test against 0.900 on train, which is visible overfitting.',
        'Precision peaked near 0.23, so four in five predicted successes were wrong.',
      ] },
      { dark: true, beats: [
        'Every linear correlation with the outcome is under 0.15.',
        'The gap, the pace difference and tire age carry almost no signal on their own.',
        'Thirteen of the top fifteen coefficients are circuits. Some tracks convert at three times the average.',
        'The model mostly learns which track it is at, then how fast the crew works.',
      ] },
      { beats: [
        'Some circuits have five to ten attempts, so the model was fitting noise per track.',
        'The final model treats tracks with little data as closer to average, instead of trusting a handful of races.',
        'It scores 0.683 AUC on fifteen features instead of 0.713 on forty-eight. Slightly worse, and far more trustworthy.',
      ] },
      { beats: [
        'The split is random over attempts, not grouped by race, so one afternoon can land on both sides.',
        'That likely flatters the test number. Grouping by race is the first fix.',
        'Twenty test positives is too few for confidence, and there is no calibration curve.',
      ] },
    ],
  },

  'rl-agents': {
    accent: '#2E7A4C',
    night: '#141a10',
    accentDark: '#74CC97',
    thesis: { text: 'A lot of behavior that looks like a preference is actually a discount rate.', accent: 'a discount rate', after: 2 },
    stats: [
      'states and two actions, with a policy that reverses on one parameter.',
      'is the optimal value of the good state at a 0.9 discount.',
      'RL libraries in the tabular work. The updates are the exercise.',
    ],
    sections: [
      { beats: [
        'Three states, good standing, probation and expelled. Two actions, work or watch YouTube.',
        'YouTube pays four times as much now and raises the chance of sliding toward expulsion, which never ends.',
        'I derived the value functions by hand first, so the crossover was known before any code ran.',
      ] },
      { beats: [
        'The solver is written directly in NumPy, so every update step is visible arithmetic.',
        'At a 0.9 discount, the best policy is YouTube in good standing and work on probation.',
        'When you are safe, the quick reward is worth it. One step from expulsion, which can never be undone, it is not.',
      ] },
      { dark: true, beats: [
        'Drop the discount to 0.5 and the policy flips to YouTube everywhere.',
        'Nothing about the rewards changed. The agent just weights the future less.',
        'An agent that looks reckless may just care less about the future. The fix is in what it is rewarded for.',
      ] },
      { beats: [
        'Separately, a convolutional classifier for FashionMNIST, written as a module from scratch.',
        'Three convolution blocks, dropout, a dense layer, Adam and five epochs.',
        'The training loop checks its own time budget and stops before the grader’s five-minute limit.',
      ] },
    ],
  },

  'media-analytics': {
    accent: '#D7263D',
    accentDark: '#ff7086',
    night: '#1f0b10',
    embed: { src: 'https://xiaoman21.github.io/CS171/', title: 'Are videos getting shorter?' },
    thesis: { text: 'Shorts were half the uploads and three quarters of the views.', accent: 'three quarters of the views.', after: 2 },
    stats: [
      'videos collected across two channel sets and two years.',
      'of 2024 views on seven media channels came from Shorts, on 51% of uploads.',
      'chapters in the story, driven by a scrubber built like a video player.',
    ],
    sections: [
      { beats: [
        'We started from eleven candidate questions, and narrowing them was the design work.',
        'Each question implied a different dataset.',
        'We picked one with a visible answer and a real tension. Platforms trade quick reach for lasting connection.',
      ] },
      { beats: [
        'No dataset answers this, so the pipeline walks every upload on twelve channels across two years.',
        'A fixed duration cutoff is wrong, because YouTube raised the Shorts limit from 60 seconds to 3 minutes in late 2024.',
        'So the classifier is date-aware, 61 seconds before the change and 181 after.',
        'Today’s rule applied to old videos would have manufactured a trend.',
      ], cap: 'Average length trends down while upload counts climb. Two curves that only make sense together.' },
      { dark: true, beats: [
        'Seven media channels in 2024. 51% of uploads were Shorts, and they drew 74% of the views.',
        'One newspaper went from 14% Shorts to 93% in a year. Two channels moved the other way.',
        'Shorts earn several times the likes per view and about a ninth of the comments.',
        'Shorts get the views, and far less of the conversation.',
      ] },
      { beats: [
        'Fourteen chapters behind a scrubber built like a video player.',
        'Six visualizations, all hand-built in d3. A globe you can spin, bubbles that open into donuts, avatars that ride their own lines.',
        'A scatter shows which channels over-deliver on short-form for how much they post.',
      ] },
      { beats: [
        'The story says Shorts work like trailers for long videos. That is correlation, shown more confidently than the evidence supports.',
        'There is no lag regression and no control for seasonality.',
        'The multiplier holds for four of seven channels, and one outlier at 42.6x drags any average.',
        'The dashboard hardcodes 2024, so half of what we collected never reaches the screen.',
      ] },
    ],
  },
}
