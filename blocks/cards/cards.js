import { createOptimizedPicture } from '../../scripts/aem.js';
export default function decorate(block) {

  block.classList.add('services', 'equal', 'hover-anime', 'hardbg', 'border-grids');
  const ul = document.createElement('ul');
  ul.className = 'row';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'col-sm-4';

    // move all row content into li
    while (row.firstElementChild) li.append(row.firstElementChild);

    const divs = [...li.children];
    let textDiv;

    // detect which div has image and which has text
    divs.forEach((div) => {
      if (div.querySelector('picture')) {
        div.className = 'views-field views-field-nothing';
      } else {
        textDiv = div;
      }
    });

    // process text div separately
    if (textDiv) {
      const strong = textDiv.querySelector('strong');
      const ps = textDiv.querySelectorAll('p');

      // remove original textDiv
      textDiv.remove();

      // create service-title
      if (strong) {
        const serviceTitle = document.createElement('div');
        serviceTitle.className = 'service-title';
        const a = document.createElement('a');
        a.textContent = strong.textContent;
        serviceTitle.appendChild(a);
        li.appendChild(serviceTitle);
      }

      // create description
      if (ps.length > 1) {
        const desc = document.createElement('div');
        desc.className = 'text';
        desc.appendChild(ps[1].cloneNode(true));
        li.appendChild(desc);
      }
    }

    ul.appendChild(li);
  });

  // optimize all pictures
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  });

  block.textContent = '';
  block.append(ul);
}
