import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  block.classList.add('services', 'equal', 'hover-anime', 'hardbg', 'border-grids');

  const ul = document.createElement('ul');
  ul.className = 'row';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'col-sm-4';

    while (row.firstElementChild) li.append(row.firstElementChild);

    const divs = [...li.children];
    let textDiv;

    divs.forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = 'views-field views-field-nothing';
      } else {
        textDiv = div;
      }
    });

    if (textDiv) {
      const paragraphs = textDiv.querySelectorAll('p');
      let title = '';
      let description = '';
      const link = { href: '', text: '' };

      paragraphs.forEach((p) => {
        const strong = p.querySelector('strong');
        const anchor = p.querySelector('a');

        if (strong) {
          title = strong.textContent;
        } else if (anchor) {
          link.href = anchor.getAttribute('href');
          link.text = anchor.textContent;
        } else {
          description = p.textContent;
        }
      });

      textDiv.remove();

      if (title) {
        const titleDiv = document.createElement('div');
        titleDiv.className = 'service-title';
        const a = document.createElement('a');
        a.textContent = title;
        titleDiv.appendChild(a);
        li.appendChild(titleDiv);
      }

      if (description) {
        const descDiv = document.createElement('div');
        descDiv.className = 'text';
        const p = document.createElement('p');
        p.textContent = description;
        descDiv.appendChild(p);
        li.appendChild(descDiv);
      }

      if (block.classList.contains('with-hover') && link.href) {
        const hover = document.createElement('div');
        hover.className = 'hover-text hover-service';

        const a = document.createElement('a');
        a.href = link.href;
        a.id = 'services_';

        a.innerHTML = `
          <span class="valign">
            <span class="name">${link.text || title}</span>
            <span class="cta arrow-cta">&nbsp;</span>
          </span>
        `;

        hover.appendChild(a);
        li.appendChild(hover);
      }
    }

    ul.appendChild(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.appendChild(ul);
}
