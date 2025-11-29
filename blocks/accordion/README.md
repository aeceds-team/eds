# Accordion block authoring

Use these steps to author the Accordion block in Google Docs (or Word) so it renders correctly in Franklin:

1. Insert a table. In the first row, type `Accordion` in the first cell and leave any other cells in that row empty. This parent cell names the block, similar to how the Columns block uses `Columns`.
2. Each subsequent row represents one accordion item. In every row:
   - Put the accordion title in the first cell.
   - Add the accordion body content in the cells to the right. All cells to the right of the title are concatenated into the panel content.
3. Add more rows for additional accordion items. The published page will render each title as a toggle button that opens and closes its corresponding content.
4. Avoid extra styling in the doc; the block styles handle spacing, borders, and the open/closed indicator.

Tip: If you leave a title cell blank, the block will auto-label it (for example, "Section 1"), but providing explicit titles keeps the accordion easy to scan.
