# Portfolio diagrams — design source

    figures.js   one mechanism diagram per product

The portfolio build (design/portfolio-pdf/build.js) draws these into both
the PDF and the web preview. The web preview used to be a hand-built page
in this folder; it is now generated from the PDF's own pages, so the two
cannot drift (FS-323).

The diagrams share one visual language (FS-253): a solid green line is money
moving; a dashed line is Dibon instructing or reading; a green-edged box is
where funds rest; a plum box is Dibon's software. Green never passes through
plum.
