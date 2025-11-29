export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row, index) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';

    const titleCell = row.children[0];
    const contentCells = [...row.children].slice(1);
    const title = titleCell ? titleCell.textContent.trim() : `Section ${index + 1}`;

    const heading = document.createElement('h3');
    heading.className = 'accordion-title';

    const button = document.createElement('button');
    const panelId = `accordion-panel-${index + 1}`;
    const buttonId = `accordion-trigger-${index + 1}`;

    button.id = buttonId;
    button.type = 'button';
    button.className = 'accordion-trigger';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    button.innerHTML = `<span>${title}</span>`;

    heading.append(button);

    const panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'accordion-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', buttonId);
    panel.hidden = true;

    const contentSource = contentCells.length ? contentCells : [titleCell];
    contentSource.filter(Boolean).forEach((cell) => {
      while (cell.firstChild) {
        panel.append(cell.firstChild);
      }
    });

    const toggle = () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      item.classList.toggle('is-open', !expanded);
    };

    button.addEventListener('click', toggle);

    item.append(heading, panel);
    block.append(item);
  });
}
