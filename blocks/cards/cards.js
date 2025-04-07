import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'row';

  // loop through each row (div inside block)
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols.length !== 2) return; // skip if not a 2-column row

    const li = document.createElement('li');
    li.className = 'col-sm-4';

    const wrapper = document.createElement('div');
    wrapper.className = 'views-field views-field-nothing';

    // process image column
    const img = cols[0].querySelector('img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      wrapper.appendChild(picture);
    }

    // process text column
    const strong = cols[1].querySelector('strong');
    const paragraphs = cols[1].querySelectorAll('p');

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
