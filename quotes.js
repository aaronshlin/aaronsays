(function () {
  const PAGE_SIZE = 8;
  const form = document.querySelector(".quote-tools");
  if (!form) return;

  const input = document.getElementById("quote-search");
  const buttons = Array.from(form.querySelectorAll("[data-filter]"));
  const items = Array.from(document.querySelectorAll(".quote-list > li"));
  const countEl = document.querySelector(".quote-count");
  const emptyEl = document.querySelector(".quote-empty");
  const pager = document.querySelector(".quote-pager");
  const prevBtn = document.querySelector(".quote-pager-prev");
  const nextBtn = document.querySelector(".quote-pager-next");
  const pagerStatus = document.querySelector(".quote-pager-status");
  const valid = new Set(buttons.map(function (button) {
    return button.getAttribute("data-filter");
  }));

  let category = "all";
  let page = 1;

  function normalize(value) {
    return value.toLowerCase().normalize("NFKD");
  }

  function matchedItems() {
    const query = normalize(input.value.trim());
    return items.filter(function (item) {
      const matchesCategory = category === "all" || item.getAttribute("data-category") === category;
      const matchesQuery = !query || normalize(item.textContent).indexOf(query) !== -1;
      return matchesCategory && matchesQuery;
    });
  }

  function apply(options) {
    const matched = matchedItems();
    const totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE) || 1);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    const start = matched.length ? (page - 1) * PAGE_SIZE : 0;
    const visibleSet = new Set(matched.slice(start, start + PAGE_SIZE));

    items.forEach(function (item) {
      item.hidden = !visibleSet.has(item);
    });

    const shown = visibleSet.size;
    if (!matched.length) {
      countEl.textContent = "0 quotes";
    } else if (matched.length <= PAGE_SIZE) {
      countEl.textContent = matched.length === 1 ? "1 quote" : matched.length + " quotes";
    } else {
      countEl.textContent = (start + 1) + "–" + (start + shown) + " of " + matched.length;
    }

    emptyEl.hidden = matched.length !== 0;
    pager.hidden = matched.length <= PAGE_SIZE;
    if (!pager.hidden) {
      pagerStatus.textContent = "Page " + page + " of " + totalPages;
      prevBtn.disabled = page <= 1;
      nextBtn.disabled = page >= totalPages;
    }

    document.body.setAttribute("data-quote-cat", category);
    syncUrl();

    if (options && options.scroll) {
      form.scrollIntoView({ block: "start" });
    }
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

    if (page > 1) {
      url.searchParams.set("page", String(page));
    } else {
      url.searchParams.delete("page");
    }

    history.replaceState(null, "", url);
  }

  function setCategory(next) {
    category = next;
    page = 1;
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

  input.addEventListener("input", function () {
    page = 1;
    apply();
  });

  prevBtn.addEventListener("click", function () {
    if (page <= 1) return;
    page -= 1;
    apply({ scroll: true });
  });

  nextBtn.addEventListener("click", function () {
    page += 1;
    apply({ scroll: true });
  });

  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("cat");
  const initialQuery = params.get("q");
  const initialPage = parseInt(params.get("page"), 10);
  if (initialQuery) input.value = initialQuery;
  if (initialPage >= 1) page = initialPage;
  if (initialCategory && valid.has(initialCategory)) {
    category = initialCategory;
    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-filter") === category));
    });
  }
  apply();
})();
