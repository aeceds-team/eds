import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'row';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'col-sm-4';

    const wrapper = document.createElement('div');
    wrapper.className = 'views-field views-field-nothing';

    const [imageCell, textCell] = [...row.children];

    // Process image
    const img = imageCell.querySelector('img');
    if (img) {
      const pic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      wrapper.appendChild(pic);
    }

    // Process text: assumes <p><strong>Title</strong></p><p>Desc</p> format
    const paragraphs = textCell.querySelectorAll('p');
    if (paragraphs.length >= 1) {
      const titleDiv = document.createElement('div');
      titleDiv.className = 'service-title';
      const anchor = document.createElement('a');
      anchor.textContent = paragraphs[0].textContent;
      titleDiv.appendChild(anchor);
      wrapper.appendChild(titleDiv);
    }

    if (paragraphs.length >= 2) {
      const descDiv = document.createElement('div');
      descDiv.className = 'text';
      descDiv.appendChild(paragraphs[1].cloneNode(true));
      wrapper.appendChild(descDiv);
    }

    li.appendChild(wrapper);
    ul.appendChild(li);
  });

  block.textContent = '';
  block.appendChild(ul);
}
