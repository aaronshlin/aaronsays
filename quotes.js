(function () {
  const form = document.querySelector(".quote-tools");
  if (!form) return;

  const input = document.getElementById("quote-search");
  const buttons = Array.from(form.querySelectorAll("[data-filter]"));
  const items = Array.from(document.querySelectorAll(".quote-list > li"));
  const countEl = document.querySelector(".quote-count");
  const emptyEl = document.querySelector(".quote-empty");
  const valid = new Set(buttons.map(function (button) {
    return button.getAttribute("data-filter");
  }));

  let category = "all";

  function normalize(value) {
    return value.toLowerCase().normalize("NFKD");
  }

  function apply() {
    const query = normalize(input.value.trim());
    let visible = 0;

    items.forEach(function (item) {
      const matchesCategory = category === "all" || item.getAttribute("data-category") === category;
      const matchesQuery = !query || normalize(item.textContent).indexOf(query) !== -1;
      const show = matchesCategory && matchesQuery;
      item.hidden = !show;
      if (show) visible += 1;
    });

    countEl.textContent = visible === 1 ? "1 quote" : visible + " quotes";
    emptyEl.hidden = visible !== 0;
    document.body.setAttribute("data-quote-cat", category);
    syncUrl();
  }

  function syncUrl() {
    const url = new URL(window.location.href);
    if (category === "all") {
      url.searchParams.delete("cat");
    } else {
      url.searchParams.set("cat", category);
    }

    const query = input.value.trim();
    if (query) {
      url.searchParams.set("q", query);
    } else {
      url.searchParams.delete("q");
    }

    history.replaceState(null, "", url);
  }

  function setCategory(next) {
    category = next;
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === category));
    });
    apply();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  });

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      setCategory(button.getAttribute("data-filter"));
    });
  });

  input.addEventListener("input", apply);

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("cat");
  const initialQuery = params.get("q");
  if (initialQuery) input.value = initialQuery;
  if (initialCategory && valid.has(initialCategory)) {
    setCategory(initialCategory);
  } else {
    apply();
  }
})();
