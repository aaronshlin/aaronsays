# aaronsays

An archive of reflections and thoughts. A static site built with plain HTML and CSS — no build step, no frameworks.

## GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save. The site will be live at `https://<username>.github.io/aaronsays/` (or your custom domain).

## File structure

```
index.html          Homepage — intro and posts grouped by category
post.html           Template for new posts (duplicate this)
posts/              Individual post pages
  luck.html
style.css           Shared stylesheet
```

## Adding a new post

1. Copy `post.html` into `posts/` and rename it (e.g. `posts/my-post.html`).
2. Replace the placeholders:
   - `POST_TITLE` — in the `<title>`, `<h1>`, and anywhere else it appears
   - `CATEGORY` — one of: Ideas, Luck, People, Work, Life (or add your own)
   - `POST_DATE` — e.g. `June 11, 2026`
3. Replace the placeholder paragraphs in `.post-body` with your content. Wrap each paragraph in `<p>...</p>`.
4. Open `index.html` and add a list item under the matching category:

```html
<li>
  <a href="posts/my-post.html">My Post Title</a>
  <span class="post-meta"> — June 11, 2026</span>
</li>
```

If the category does not exist yet, add a new `<details>` block:

```html
<details class="category">
  <summary>Work</summary>
  <ul class="post-list">
    <li>
      <a href="posts/my-post.html">My Post Title</a>
      <span class="post-meta"> — June 11, 2026</span>
    </li>
  </ul>
</details>
```

Add the `open` attribute to `<details>` if you want that section expanded by default.
