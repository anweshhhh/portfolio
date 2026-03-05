const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    }
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

function formatDate(dateLike) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function hydrateRepoMeta(card) {
  const repo = card.dataset.repo;
  if (!repo) return;

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`);
    if (!res.ok) throw new Error("GitHub API unavailable");
    const data = await res.json();

    const updated = card.querySelector('[data-field="updated"]');
    const pill = card.querySelector(".pill");

    if (updated) updated.textContent = `Updated: ${formatDate(data.updated_at)}`;
    if (pill && data.language) pill.textContent = data.language;
  } catch (_error) {
    // Intentionally silent fallback to static card text.
  }
}

for (const card of document.querySelectorAll(".project-card")) {
  hydrateRepoMeta(card);
}

const PROJECT_LIBRARY = {
  tracecase: {
    title: "TraceCase",
    subtitle: "QA automation for B2B SaaS teams",
    problem:
      "Manual requirement-to-test workflows are slow, inconsistent, and hard to audit across releases.",
    highlights: [
      "Requirement snapshots with immutable version history",
      "Asynchronous draft pack generation via Inngest jobs",
      "Role-based review, approvals, and locked immutable packs",
    ],
    images: [
      {
        src: "https://opengraph.githubassets.com/11/anweshhhh/TraceCase",
        caption: "Repository snapshot",
      },
      {
        src: "https://opengraph.githubassets.com/12/anweshhhh/TraceCase",
        caption: "Draft pack generation workflow",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/TraceCase",
    caseStudyUrl: "https://github.com/anweshhhh/TraceCase/blob/main/README.md",
  },
  clob: {
    title: "CLOB Market Maker Lab",
    subtitle: "Resilient orderbook-driven strategy simulation",
    problem:
      "Maker strategies need safe experimentation before risking capital in live market conditions.",
    highlights: [
      "WebSocket market data pipeline with fault-tolerant handling",
      "Paper simulator, risk controls, and PnL accounting",
      "Backtesting workflow with generated reports",
    ],
    images: [
      {
        src: "https://opengraph.githubassets.com/21/anweshhhh/clob-market-maker-lab",
        caption: "Repository snapshot",
      },
      {
        src: "https://raw.githubusercontent.com/anweshhhh/clob-market-maker-lab/main/assets/architecture.svg",
        caption: "System architecture",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/clob-market-maker-lab",
    caseStudyUrl: "https://github.com/anweshhhh/clob-market-maker-lab/blob/main/docs/ARCHITECTURE.md",
  },
  securityq: {
    title: "SecurityQ Autofill",
    subtitle: "Security questionnaire response acceleration",
    problem:
      "Security reviews often bottleneck vendor onboarding because evidence retrieval is manual.",
    highlights: [
      "Document ingestion and embedding API pipeline",
      "Question answering API for evidence-backed responses",
      "Operator-facing Next.js flows for documents and questionnaires",
    ],
    images: [
      {
        src: "https://opengraph.githubassets.com/31/anweshhhh/securityq-autofill",
        caption: "Repository snapshot",
      },
      {
        src: "https://opengraph.githubassets.com/32/anweshhhh/securityq-autofill",
        caption: "Questionnaire workflow snapshot",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/securityq-autofill",
    caseStudyUrl: "https://github.com/anweshhhh/securityq-autofill/blob/master/docs/build-log.md",
  },
  webhook: {
    title: "Webhook Reliability Platform",
    subtitle: "Durable webhook ingestion and delivery worker",
    problem:
      "Webhook systems silently fail without durable queues, explicit retries, and delivery observability.",
    highlights: [
      "Store-first ingestion with decoupled worker processing",
      "Concurrency-safe claiming using SKIP LOCKED",
      "Retry scheduling and attempt audit logging",
    ],
    images: [
      {
        src: "https://opengraph.githubassets.com/41/anweshhhh/webhook-reliability-platform",
        caption: "Repository snapshot",
      },
      {
        src: "https://opengraph.githubassets.com/42/anweshhhh/webhook-reliability-platform",
        caption: "Delivery worker architecture snapshot",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/webhook-reliability-platform",
    caseStudyUrl: "https://github.com/anweshhhh/webhook-reliability-platform/blob/main/README.md",
  },
  ratelimiter: {
    title: "Distributed Rate Limiter",
    subtitle: "Redis + Lua distributed traffic controls",
    problem:
      "API infrastructure needs deterministic throttling under bursty traffic and distributed deployments.",
    highlights: [
      "Fixed window, sliding window, and token bucket algorithms",
      "Atomic Lua enforcement in Redis single round-trip",
      "Deterministic concurrency validation with miniredis",
    ],
    images: [
      {
        src: "https://opengraph.githubassets.com/51/anweshhhh/distributed-rate-limiter",
        caption: "Repository snapshot",
      },
      {
        src: "https://opengraph.githubassets.com/52/anweshhhh/distributed-rate-limiter",
        caption: "Algorithm implementation snapshot",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/distributed-rate-limiter",
    caseStudyUrl: "https://github.com/anweshhhh/distributed-rate-limiter/blob/main/README.md",
  },
};

const modal = document.querySelector("#projectModal");
const modalTitle = document.querySelector("#modalTitle");
const modalSubtitle = document.querySelector("#modalSubtitle");
const modalImage = document.querySelector("#modalImage");
const modalCaption = document.querySelector("#modalCaption");
const modalProblem = document.querySelector("#modalProblem");
const modalHighlights = document.querySelector("#modalHighlights");
const modalDemo = document.querySelector("#modalDemo");
const modalGithub = document.querySelector("#modalGithub");
const modalCaseStudy = document.querySelector("#modalCaseStudy");
const carouselPrev = document.querySelector("#carouselPrev");
const carouselNext = document.querySelector("#carouselNext");

let activeProjectId = null;
let activeImageIndex = 0;
let lastTrigger = null;

function setActionLink(linkNode, url) {
  if (!linkNode) return;
  if (url) {
    linkNode.href = url;
    linkNode.classList.remove("hidden");
  } else {
    linkNode.removeAttribute("href");
    linkNode.classList.add("hidden");
  }
}

function renderCarousel(project) {
  if (!project || !modalImage || !modalCaption || !carouselPrev || !carouselNext) return;
  const items = project.images || [];
  const item = items[activeImageIndex] || items[0];
  if (!item) return;

  modalImage.src = item.src;
  modalImage.alt = `${project.title} visual ${activeImageIndex + 1}`;
  modalCaption.textContent = item.caption || "";

  const hasMany = items.length > 1;
  carouselPrev.disabled = !hasMany;
  carouselNext.disabled = !hasMany;
}

function renderModal(projectId) {
  const project = PROJECT_LIBRARY[projectId];
  if (!project || !modal) return;

  activeProjectId = projectId;
  activeImageIndex = 0;

  if (modalTitle) modalTitle.textContent = project.title;
  if (modalSubtitle) modalSubtitle.textContent = project.subtitle;
  if (modalProblem) modalProblem.textContent = project.problem;

  if (modalHighlights) {
    modalHighlights.innerHTML = "";
    for (const point of project.highlights) {
      const item = document.createElement("li");
      item.textContent = point;
      modalHighlights.appendChild(item);
    }
  }

  setActionLink(modalDemo, project.demoUrl);
  setActionLink(modalGithub, project.githubUrl);
  setActionLink(modalCaseStudy, project.caseStudyUrl);
  renderCarousel(project);
}

function openModal(projectId, triggerNode) {
  if (!modal || !PROJECT_LIBRARY[projectId]) return;
  renderModal(projectId);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lastTrigger = triggerNode || null;
  const closeNode = modal.querySelector(".modal-close");
  if (closeNode) closeNode.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeProjectId = null;
  activeImageIndex = 0;
  if (lastTrigger) lastTrigger.focus();
}

function moveCarousel(step) {
  if (!activeProjectId) return;
  const project = PROJECT_LIBRARY[activeProjectId];
  const total = (project.images || []).length;
  if (total <= 1) return;
  activeImageIndex = (activeImageIndex + step + total) % total;
  renderCarousel(project);
}

function trapFocus(event) {
  if (!modal || !modal.classList.contains("open") || event.key !== "Tab") return;
  const focusables = modal.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.querySelectorAll(".quick-view-btn").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.project, button);
  });
});

document.querySelectorAll(".project-shot").forEach((shot) => {
  shot.addEventListener("click", () => {
    const card = shot.closest(".project-card");
    const quickView = card?.querySelector(".quick-view-btn");
    if (quickView) openModal(quickView.dataset.project, quickView);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((node) => {
  node.addEventListener("click", closeModal);
});

if (carouselPrev) carouselPrev.addEventListener("click", () => moveCarousel(-1));
if (carouselNext) carouselNext.addEventListener("click", () => moveCarousel(1));

document.addEventListener("keydown", (event) => {
  if (!modal || !modal.classList.contains("open")) return;
  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") moveCarousel(-1);
  if (event.key === "ArrowRight") moveCarousel(1);
  trapFocus(event);
});
