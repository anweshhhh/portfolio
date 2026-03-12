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

const PROJECT_LIBRARY = {
  tracecase: {
    title: "TraceCase",
    subtitle: "Generation-first QA workflow for B2B SaaS teams",
    problem:
      "Requirement-to-test workflows slow down when draft generation, review, and release traceability live in separate tools.",
    highlights: [
      "Requirement snapshots with immutable version history",
      "Asynchronous draft-pack generation and export jobs via Inngest",
      "Review, approvals, and audit-friendly pack history",
    ],
    images: [
      {
        src: "assets/projects/tracecase/architecture.svg",
        alt: "TraceCase architecture diagram showing requirements flowing into async generation, review, export, and audit records.",
        caption:
          "Requirement snapshots enter a generation pipeline, then move through review, export, and audit logging before release.",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/TraceCase",
    caseStudyUrl: "https://github.com/anweshhhh/TraceCase/blob/main/README.md",
  },
  clob: {
    title: "CLOB Market Maker Lab",
    subtitle: "Real-time market-making research harness",
    problem:
      "Maker strategies need safe experimentation loops before risking capital in live market conditions.",
    highlights: [
      "WebSocket market data with fault-tolerant feed handling",
      "Paper simulator, risk controls, and PnL accounting",
      "Backtesting workflow with generated reports",
    ],
    images: [
      {
        src: "assets/projects/clob/architecture.svg",
        alt: "CLOB market maker architecture diagram showing discovery, live market feed, strategy, risk controls, simulation, and reporting.",
        caption:
          "Live market discovery and websocket feeds drive a strategy engine, risk controls, paper execution, and reporting outputs.",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/clob-market-maker-lab",
    caseStudyUrl: "https://github.com/anweshhhh/clob-market-maker-lab/blob/main/docs/ARCHITECTURE.md",
  },
  securityq: {
    title: "SecurityQ Autofill",
    subtitle: "OpenAI-backed questionnaire automation",
    problem:
      "Security reviews bottleneck vendor onboarding when draft answers are not grounded in retrievable evidence.",
    highlights: [
      "OpenAI embeddings and chat completions behind the answer engine",
      "Document ingestion, chunking, and retrieval over source evidence",
      "Operator-facing review flows for documents and questionnaires",
    ],
    images: [
      {
        src: "assets/projects/securityq/architecture.svg",
        alt: "SecurityQ architecture diagram showing ingestion, chunking, embeddings, evidence retrieval, and cited answer generation.",
        caption:
          "Uploaded documents are chunked, embedded, and retrieved through OpenAI-backed flows to produce cited draft answers.",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/securityq-autofill",
    caseStudyUrl: "https://github.com/anweshhhh/securityq-autofill/blob/master/docs/build-log.md",
  },
  webhook: {
    title: "Webhook Reliability Platform",
    subtitle: "Durable outbound event delivery",
    problem:
      "Retry-heavy outbound workflows fail silently without store-first durability, explicit retries, and delivery visibility.",
    highlights: [
      "Store-first ingestion with scheduled retry state",
      "Concurrency-safe claiming using SKIP LOCKED",
      "Append-only attempt history for delivery visibility",
    ],
    images: [
      {
        src: "assets/projects/webhook/architecture.svg",
        alt: "Webhook delivery architecture diagram showing durable ingest, scheduling, worker claim locking, retries, and delivery audit.",
        caption:
          "Incoming webhooks are persisted first, claimed safely by workers, retried on schedule, and recorded in an append-only attempt log.",
      },
    ],
    demoUrl: "",
    githubUrl: "https://github.com/anweshhhh/webhook-reliability-platform",
    caseStudyUrl:
      "https://github.com/anweshhhh/webhook-reliability-platform/blob/main/src/main/java/com/webhook/worker/DeliveryWorker.java",
  },
  ratelimiter: {
    title: "Distributed Rate Limiter",
    subtitle: "Distributed traffic policy service",
    problem:
      "API platforms need deterministic throttling across nodes under bursty traffic and shared limits.",
    highlights: [
      "Fixed window, sliding window, and token bucket algorithms",
      "Atomic Redis Lua enforcement in a single round-trip",
      "Deterministic concurrency validation with miniredis",
    ],
    images: [
      {
        src: "assets/projects/ratelimiter/architecture.svg",
        alt: "Distributed rate limiter architecture diagram showing request handling, strategy selection, Redis Lua atomic checks, and allow or deny responses.",
        caption:
          "Each request passes through a Go limiter service that selects an algorithm and executes atomic Redis Lua state transitions before returning allow or deny.",
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
  modalImage.alt = item.alt || `${project.title} visual ${activeImageIndex + 1}`;
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
