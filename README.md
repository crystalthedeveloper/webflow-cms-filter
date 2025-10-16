# webflow-cms-filter

Tiny, attribute-based filtering for **Webflow CMS** lists.  
Filter any type of CMS item — categories, tags, years, etc. — using simple `data-filter` attributes.  
The script shows/hides items, highlights the active button, supports multiple scopes, and works with “All” filters out of the box.

---

## ✨ Features
- 👉 Now supports **multiple tags per CMS item** (e.g. `blog, case-study`)
- 🔘 Filter by any value (not just year)
- 🧭 Optional deep-linking via `?filter=value` or `#filter=value`
- 🧩 Multiple sections on one page using `data-filter-scope`
- ✅ Active button state with built-in color attributes
- 🕳️ Custom empty state (`[data-empty]`)
- ⚡ 100% Webflow compatible, no jQuery or dependencies

---

## 🧱 Markup Example

Wrap your buttons and CMS items in a single **scope**:

```html
<div data-filter-scope data-active-bg="#000" data-active-color="#ffe600">
  <div class="buttons">
    <button data-filter="all">All</button>
    <button data-filter="webflow">Webflow</button>
    <button data-filter="wordpress">WordPress</button>
  </div>

  <div class="cards">
    <article class="card" data-filter-value="webflow">Webflow Project</article>
    <article class="card" data-filter-value="wordpress">WordPress Project</article>
  </div>

  <p data-empty>No items found.</p>
</div>
```

✅ Put `data-filter-value` on the **Collection Item wrapper** (the element that repeats), not an inner text block.

---

## ⚙️ Usage

### 1️⃣ Include the script
```html
<script src="https://cdn.jsdelivr.net/gh/crystalthedeveloper/webflow-cms-filter@v1.0.2/webflow-cms-filter.js" defer></script>
```
It **auto-initializes** when the page loads — no setup needed.

---

## 🎨 Customization (via attributes)
You can style the **active button** directly in Webflow using these optional attributes:

| Attribute | Example | Description |
|------------|----------|-------------|
| `data-active-bg` | `#000` | Background color when active |
| `data-active-color` | `#ffe600` | Text color when active |
| `data-active-border` | `1px solid #ffe600` | Optional border for active button |

If you prefer CSS:
```css
[data-filter][aria-pressed="true"] {
  background-color: #000;
  color: #ffe600;
}
```

---

## 🧩 Options (Advanced)
If you want to initialize manually:

```html
<script>
  WebflowCMSFilter.init({
    scopeSelector: "[data-filter-scope]",
    buttonSelector: "[data-filter]",
    itemSelector: "[data-filter-value]",
    emptySelector: "[data-empty]",
    readURL: true,      // Enables ?filter=webflow or #filter=wordpress
    defaultToAll: true, // Show all items on load
    createEmptyIfMissing: false,
    emptyText: "No items found."
  });
</script>
```

---

## 🗂️ Multiple Sections

You can have many independent filter groups on one page.  
Just wrap each group in its own container with `data-filter-scope` — they’ll work separately.

---

## 🪄 Webflow CMS Setup (Plain Text Field for Multi-Tags)

When using **Webflow CMS**, the easiest way to support **multiple filters per post** (like “Blog + Case Study”) is to use a **Plain Text field**.

---

### 🧱 Steps

1️⃣ **Add a Plain Text field**  
Go to your CMS Collection and add a new Plain Text field called something like `Filter Tags`.

2️⃣ **Enter comma-separated tags**  
For each post, enter your tags in a single line separated by commas, like this:

```
blog, case-study, webflow
```

3️⃣ **Bind the field to your collection item**  
In your **Collection List Item**, add a custom attribute:

```
Name: data-filter-value
Value: Filter Tags
```

(Bind it dynamically to your `Filter Tags` field.)

---

### ✅ Done!
The script will automatically detect and match each tag individually — for example, a card with:

```html
data-filter-value="blog, case-study, webflow"
```

will appear when **any** of those filter buttons are clicked.

---

## 🪄 Webflow Tips

- **Pagination:** Turn it off or use a “Load All” plugin (like Finsweet CMS Load).  
- **Placement:** Add the script in **Before </body>** in Page Settings or Site Settings.  
- **CMS Binding:** Works with text, number, or date fields as filter values.

---

## 🧩 Example

```html
<div data-filter-scope data-active-bg="#000" data-active-color="#ffe600">
  <button data-filter="all">All</button>
  <button data-filter="2025">2025</button>
  <button data-filter="2024">2024</button>

  <div>
    <article data-filter-value="2025">Item A (2025)</article>
    <article data-filter-value="2024">Item B (2024)</article>
  </div>

  <p data-empty>No items found.</p>
</div>

<script src="webflow-cms-filter.js" defer></script>
```

---

## 📜 License
MIT © [Crystal The Developer](https://www.crystalthedeveloper.ca)
