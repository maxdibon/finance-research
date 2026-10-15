---
kind: patch
for: team
rows: [FS-856]
by: Chief Technology and Innovation Officer
---

In the reader, every path written as plain text is now a link: short names
in a list ("docs/regulation.md, compliance.md"), relative paths
("modules/access.md") and folders ("docs/customers/", which opens a page
listing what the folder holds). Folders outside the documents, such as
tools/, read as code. The checks fail a path that names no document, or a
short name two documents share with nothing to say which.
