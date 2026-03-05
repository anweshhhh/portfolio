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

    const stars = card.querySelector('[data-field="stars"]');
    const updated = card.querySelector('[data-field="updated"]');
    const pill = card.querySelector(".pill");

    if (stars) stars.textContent = `Stars: ${data.stargazers_count}`;
    if (updated) updated.textContent = `Updated: ${formatDate(data.updated_at)}`;
    if (pill && data.language) pill.textContent = data.language;
  } catch (_error) {
    // Intentionally silent fallback to static card text.
  }
}

for (const card of document.querySelectorAll(".project-card")) {
  hydrateRepoMeta(card);
}
