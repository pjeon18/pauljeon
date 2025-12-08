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
  documents?: { label: string; href: string }[];
  link?: string;
  linkLabel?: string;
  gallery?: { src: string; alt?: string }[];
};

export const projects: Project[] = [
  {
    slug: "cs109-undercut",
    title: "Predicting Undercut Success in Formula 1 — CS109 Final",
    role: "Data Scientist",
    summary: "Built an undercut attempts dataset (2014–2024) and a baseline model (AUC 0.71) to predict pit stop undercut success.",
    body: "We asked: Can we predict the success of an undercut pit stop strategy in Formula 1 based on real-time race conditions? I built a clean 2014–2024 undercut dataset filtered to realistic attempts (≤2s gap), engineered tire-age differential and gap-per-lap features, and ran a logistic regression baseline with class imbalance treatment. The final dataset holds 761 legitimate attempts; EDA shaped the gap filter, weighting/thresholding, and inclusion of circuit and tire-age features. The baseline achieved AUC–ROC 0.71 on test, showing predictive lift beyond chance. Circuit effects dominate importance (Gilles Villeneuve 34.5%, Albert Park 26.1%, Monaco 25.0%), pit stop times correlate most with success, and weak linear correlations hint at non-linear interactions. This supports real-time strategy, risk, and tire management decisions, with future improvements planned for SMOTE augmentation, boosted trees with imbalance-aware loss, cost-sensitive learning, and circuit-aware hierarchical models.",
    tags: ["Data science","Logistic regression","Class imbalance","Feature engineering","F1"],
    metrics: ["761 undercut attempts (2014–2024)","AUC–ROC 0.71 baseline","Circuit & tire-age features","Class-weighted modeling"],
    documents: [
      { label: "Project writeup (PDF)", href: "_CS_1090a__Final_Project.pdf" },
      { label: "Presentation slides (PDF)", href: "_CS_1090a_Presentation.pdf" }
    ]
  },
  {
    slug: "harvard-shop",
    title: "Harvard Shop — Procurement & Product Design (FY25)",
    role: "Procurement Manager & Product Designer",
    summary: "Managed $1.8M inventory across 1,100+ SKUs; automated orders, +47% YoY revenue while holding 65% margins.",
    body: "I owned procurement and inventory for The Harvard Shop across three retail stores and e-commerce, managing $1.8M inventory and 1,100+ SKUs. I automated high-demand product orders via a Python API integration with Lightspeed, lifting revenue 47% YoY (~$370K) while maintaining 65% margins. Weekly I aligned store, marketing, and product leads on stock, margins, and priorities, and I worked with vendors (Nike, Champion, Patagonia, Peter Millar) to resolve quality and fulfillment issues. The result was a steadier pipeline, fewer stockouts, and tighter coordination across teams.",
    tags: ["Retail ops","Automation","Inventory","Vendor management"],
    metrics: []
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
    metrics: ["Top channels dataset (2024–2025)","Interactive dashboard","PEW research synthesis"],
    link: "https://xiaoman21.github.io/CS171/",
    linkLabel: "View live project"
  },
  {
    slug: "nonprofit-signup",
    title: "Nonprofit Signup Experience — UX / UI Design",
    role: "UI/UX Designer",
    summary: "Research → lo-fi → hi-fi Figma; clearer signup flow to lift conversions.",
    body: "For a college-application mentorship nonprofit, I conducted surveys and interviews, distilled user pain points, and redesigned the sign-up flow with lo-fi and hi-fi Figma prototypes. I led weekly stakeholder check-ins to share research findings, refine requirements, and prioritize the MVP. The final design simplified steps, clarified value props, and included responsive components and acceptance criteria for engineers to ship with confidence.",
    tags: ["UX research","Figma","Accessibility"],
    metrics: [],
    slidesEmbedSrc: "https://docs.google.com/presentation/d/14DxxD_gE-jV-Zqnwor8psF4STy90mx-xkbY_e_1rokY/embed?start=false&loop=false&delayms=3000"
  },
  {
    slug: "emr-exhibit",
    title: "Digital Exhibit for Professor — EMR 171 Final",
    role: "Designer/Developer",
    summary: "Animated, accessible web exhibit translating course research into an interactive story.",
    body: "For EMR 171, I designed and built an interactive website that translated a professor’s research into a scannable, accessible exhibit. I led wireframes, information architecture, and front-end implementation with Tailwind, emphasizing readability, captions, alt/meta, and prefers-reduced-motion. The site turns dense scholarship into themed chapters that work for both visual readers and assistive tech.",
    tags: ["Tailwind","Web storytelling","Accessibility"],
    metrics: []
  },
  {
    slug: "marketing-emails",
    title: "Marketing Intern — Email Campaigns",
    role: "Design + Analytics",
    summary: "Modular Klaviyo emails with weekly analytics; $8k+ attributed revenue.",
    body: "As a marketing analytics intern, I translated ROAS, CTR, conversion, and open-rate data into dashboards and recommendations for marketers and store managers. I communicated A/B checkout test results and next steps to designers and leadership, and I designed summer email layouts that generated $8,000+ in attributed revenue. I also researched, planned, and launched an SMS marketing campaign as my final project.",
    tags: ["Email","Klaviyo","A/B testing"],
    metrics: [],
    gallery: [
      { src: "email1.png", alt: "4th of July sitewide promo email" },
      { src: "email2.png", alt: "Dorm room essentials email" },
      { src: "email7.png", alt: "Harvard Shop on film collage email" },
      { src: "email6.png", alt: "Graduation styles email" },
      { src: "email3.png", alt: "New website launch email" },
      { src: "email4.png", alt: "Harvard Shop product feature email" }
    ]
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

