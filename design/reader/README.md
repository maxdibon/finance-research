# The reader's template

FS-1165. **The look and the frame of every page of the reader**, the
repository built as linked HTML by `node tools/site.js` into build/site/,
which git ignores. These two files are in git; every rebuild reads them,
so the reader looks the same on every machine and after every build.

| File | What it is |
|---|---|
| [page.html](page.html) | The frame of every page: its head, the header with the navigation and the release, a note when the reader is built without the protected names, the page's content, the footer |
| [reader.css](reader.css) | The reader's styles, light and dark, inlined into each page |

**The placeholders in page.html**, each filled by tools/site.js:
`{{title}}` the page's title; `{{style}}` reader.css; `{{nav}}` the
navigation links; `{{release}}` the release it was built from;
`{{note}}` the reader's note, when there is one; `{{content}}` the page;
`{{footer}}` the footer's links. A placeholder missing from page.html
stops the build.

**Change the look here,** never in build/ (which every build replaces) and
never in tools/site.js; then `node tools/site.js`, or commit, and the hook
rebuilds it.
