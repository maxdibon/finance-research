# Portfolio preview — design source

The private preview page of docs/marketing/portfolio.md is built from these
files. It is a hand-built preview, not yet generated from the Markdown
(FS-251).

    template.html   the page, with __LOGO__ where the logo is embedded
    figures.js      draws the eight product diagrams into the page

Build, from this folder, with the logo as base64 in logo.b64:

    cp template.html page.html
    node figures.js page.html
    # then replace __LOGO__ with the contents of logo.b64

The page uses the Dibon deck's frame: amber brand accent, aubergine-and-amber
heading rules, amber corner line-art, an aubergine footer band (FS-257,
FS-261). The diagrams share one visual language (FS-253): a solid green line is money
moving; a dashed line is Dibon instructing or reading; a green-edged box is
where funds rest; a plum box is Dibon's software. Green never passes through
plum.
