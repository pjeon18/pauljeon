export type Project = {
  slug: string;
  title: string;
  role: string;
  summary: string;  // one-liner for cards
  body: string;     // full paragraph case study (no images)
  tags: string[];
  metrics: string[];
  timeframe?: string;
  figmaEmbedSrc?: string;
  slideAnchors?: { label: string; pageId: string }[];
  slidesEmbedSrc?: string;
};

export const projects: Project[] = [
  {
    slug: "harvard-shop",
    title: "Harvard Shop — Procurement & Product Design (FY25)",
    role: "Procurement Manager & Product Designer",
    summary: "Rebuilt the product line and inventory engine—90+ new products—while protecting ~60% margins.",
    body: "As Procurement Manager for The Harvard Shop, I was tasked with modernizing an aging apparel line while controlling risk across a complex catalog of 3,000+ SKUs. I led forecasting and SKU rationalization, ran vendor RFPs and negotiations, and designed the entire FY25 line—over 90 new products—balancing trend, brand, and margin constraints. I built a buy plan that enforced MOQs, lead times, and target costs, and coordinated rollout with marketing and store teams. The result was a refreshed assortment that protected ~60% gross margins, supported $1.8M in managed inventory, and contributed to $5.8M in revenue. Beyond the numbers, the work aligned operations, design, and merchandising around a single plan so the team could move faster with less waste.",
    tags: ["Retail ops","Product design","Forecasting","Vendor management"],
    metrics: ["$1.8M inventory managed","3,000+ SKUs","90+ new products","~60% gross margin","$5.8M revenue"]
  },
  {
    slug: "peace-brand",
    title: ":PEACE — Micro-brand Concept & Apparel System (Design Ethos Final)",
    role: "Brand & Product Designer",
    summary: "A hand-drawn streetwear concept that turns the peace sign into a scalable brand system.",
    body: "Created for the Cactus Jack Design Ethos Final Project, I built :PEACE as a friendly, hand-drawn streetwear concept that turns the universally understood \"V/peace\" sign into a repeatable brand system. The deck walks through brand values (spreading peace with simple, down-to-earth graphics), cultural context of the \"브이 / V-sign,\" and how the gesture's meaning flipped from \"victory\" to \"peace.\" It then traces visual influences (Stüssy's bold iconography; Comme des Garçons' conceptual minimalism), early logo/mascot explorations, and apparel mockups that apply the mark across tees and hoodies. The outcome is a compact toolkit—icon, wordmarks, pattern tiles, and type—that can scale from prints to product while keeping the message legible and warm.",
    tags: ["Brand design","Apparel","Illustration","Storytelling"],
    metrics: ["Brand values & story","Explorations & mockups","Concept art sheet"],
    figmaEmbedSrc: "https://embed.figma.com/slides/mGIxEIwX8c6h3O7bw4W1Ep/Untitled?node-id=1-42&embed-host=share",
    slideAnchors: [
      { label: "Title",            pageId: "1-42" },
      { label: "Brand values",     pageId: "17-274" },
      { label: "Vision & story",   pageId: "3-129" },
      { label: "History",          pageId: "10-53" },
      { label: "Inspiration",      pageId: "3-310" },
      { label: "Art board",        pageId: "13-165" },
      { label: "Mockups",          pageId: "3-185" },
      { label: "Concept art",      pageId: "3-157" },
      { label: "Designer note",    pageId: "17-201" },
      { label: "Slide 10",         pageId: "17-194" },
      { label: "Slide 11",         pageId: "3-323" },
      { label: "Slide 12",         pageId: "17-299" },
      { label: "Slide 13",         pageId: "17-251" }
    ]
  },
  {
    slug: "social-length",
    title: "Is Social Media Getting Shorter? — Data Visualization Case Study (CS171)",
    role: "Data Visualization Researcher & Front-end Developer",
    summary: "YouTube Data API study; interactive visuals exploring 2024–2025 video-length trends.",
    body: "I investigated whether leading channels and media brands actually shifted to shorter videos in 2024–2025. Using the YouTube Data API v3, I scraped and cleaned data on top channels, built distributions and time-series views in HTML/CSS/JavaScript, and triangulated findings with secondary research from PEW and market reports. The analysis surfaced a clear tilt toward short-form among news/entertainment brands, with genre-specific differences that long-form creators use to maintain depth and watch time. I packaged the work as an interactive, exploratory visualization plus a written narrative so classmates and instructors could examine channels, compare periods, and draw their own conclusions. The project demonstrates my end-to-end process—data collection, modeling, visual storytelling, and insight framing for non-technical audiences.",
    tags: ["YouTube API","Data viz","Front-end"],
    metrics: ["Top channels dataset (2024–2025)","Interactive dashboard","PEW research synthesis"]
  },
  {
    slug: "nonprofit-signup",
    title: "Nonprofit Signup Experience — UX / UI Design",
    role: "UI/UX Designer",
    summary: "Research → lo-fi → hi-fi Figma; clearer signup flow to lift conversions.",
    body: "Working as a UI/UX Designer on a six-person team (PM, senior designer, and peers), I redesigned the sign-up flow for a college-application mentorship nonprofit. The problem was low completion from interest to enrollment due to unclear value prop and too many steps. I led research (surveys and interviews), mapped the funnel, and produced lo-fi wires through hi-fi Figma comps, presenting weekly to the board for feedback and alignment. The final design reduced cognitive load with a clearer hierarchy, progressive disclosure, and responsive components ready for developer handoff. We defined success metrics (conversion rate, drop-off by step) and an experimentation plan so the organization could measure impact post-launch.",
    tags: ["UX research","Figma","Accessibility"],
    metrics: ["Board-approved package","Developer-ready components","Defined conversion metrics"],
    slidesEmbedSrc: "https://docs.google.com/presentation/d/14DxxD_gE-jV-Zqnwor8psF4STy90mx-xkbY_e_1rokY/embed?start=false&loop=false&delayms=3000"
  },
  {
    slug: "emr-exhibit",
    title: "Digital Exhibit for Professor — EMR 171 Final",
    role: "Designer/Developer",
    summary: "Animated, accessible web exhibit translating research on Kim Myong Sun.",
    body: "For my EMR 171 final, I translated a professor's research on Kim Myong Sun into a digital exhibit that invites reading, not just skimming. I led wireframing, information architecture, and front-end implementation with Tailwind CSS, using motion sparingly and honoring prefers-reduced-motion for accessibility. The site structures dense scholarship into thematic chapters with scannable typography, captions, and alt/meta support so content works for screen readers. The project demonstrates my ability to turn complex source material into an approachable, narrative web experience while keeping accessibility and performance in focus.",
    tags: ["Tailwind","Web storytelling","Accessibility"],
    metrics: ["Thematic chapters","Reduced-motion support","A11y checks passed"]
  },
  {
    slug: "marketing-emails",
    title: "Marketing Intern — Email Campaigns",
    role: "Design + Analytics",
    summary: "Modular Klaviyo emails with weekly analytics; $8k+ attributed revenue.",
    body: "As a marketing intern, I owned the design and execution of a summer email campaign. I created layouts in Adobe Creative Suite, built and scheduled them in Klaviyo, and set up basic segmentation and A/B tests on subject lines and hero modules. I also coordinated product photoshoots with student models to source authentic visuals and reported weekly performance to leadership. The campaign generated over $8,000 in attributed revenue, and the modular template system I built allowed the team to spin up new sends quickly with consistent brand quality. This work shows how I connect creative, operations, and analytics to drive measurable outcomes.",
    tags: ["Email","Klaviyo","A/B testing"],
    metrics: ["$8,000+ attributed revenue","Weekly performance reports","Reusable templates"]
  },
  {
    slug: "humg-growth",
    title: "Director of Growth — Harvard Undergraduate Marketing Group",
    role: "Director of Growth",
    summary: "Closed sponsorships and ran campus distribution with brands like Red Bull and Poppi.",
    body: "As HUMG's Director of Growth, I was responsible for expanding our budget and reach through external sponsorships and product distribution on campus. I prospected, pitched, and closed partnerships with brands including Red Bull, Coverd, Broadway Marketplace, and Poppi; negotiated deliverables; and planned sampling and event activations. I built simple post-mortems with impressions, redemptions, and qualitative feedback to prove value and secure repeat collaborations. The result was a healthier pipeline, increased operating budget, and a repeatable playbook for campus partnerships that matched brand goals with student demand.",
    tags: ["Partnerships","Growth","Sponsorships","Events"],
    metrics: ["Brand partnerships (Red Bull, Coverd, Broadway Marketplace, Poppi)","Expanded budget","Repeat collaborations"]
  }
];

