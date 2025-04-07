import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  if (!block) {
    return;
  }
  
  // Locate the <ul class="row"> within the block.
  const ul = block.querySelector('ul.row');
  if (!ul) {
    return;
  }
  
  // For each <li> within the ul, process the images.
  [...ul.querySelectorAll('li')].forEach((li) => {
    // Find any <img> that is not already inside a <picture>
    li.querySelectorAll('img').forEach((img) => {
      if (!img.closest('picture')) {
        // Wrap the <img> with a <picture> element.
        const picture = document.createElement('picture');
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(img);
      }
    });
  });
  
  // Optimize each <picture> element: replace it with the optimized version.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    if (!picture) return;
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [
        { width: '750' },
      ]
    );
    picture.replaceWith(optimizedPic);
  });
}
