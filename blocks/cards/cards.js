import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'row';

  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols.length !== 2) return;

    const li = document.createElement('li');
    li.className = 'col-sm-4';

    const wrapper = document.createElement('div');
    wrapper.className = 'views-field views-field-nothing';

    const img = cols[0].querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      wrapper.appendChild(picture);
    }

    const strong = cols[1].querySelector('strong');
    if (strong) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'service-title';
      const anchor = document.createElement('a');
      anchor.textContent = strong.textContent;
      titleDiv.appendChild(anchor);
      wrapper.appendChild(titleDiv);
    }

    const descP = cols[1].querySelector('p:nth-of-type(2)');
    if (descP) {
      const textDiv = document.createElement('div');
      textDiv.className = 'text';
      textDiv.appendChild(descP.cloneNode(true));
      wrapper.appendChild(textDiv);
    }

    li.appendChild(wrapper);
    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);
}
