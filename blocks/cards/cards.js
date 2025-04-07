import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  if (!block) {
    console.error('No block element provided.');
    return;
  }
  
  // Locate the original UL with class "row" inside the block.
  const originalUL = block.querySelector('ul.row');
  if (!originalUL) {
    console.warn('No UL with class "row" found.');
    return;
  }
  
  // Create a new UL element and preserve the original UL's class.
  const newUL = document.createElement('ul');
  newUL.className = originalUL.className;
  
  // Iterate over each LI in the original UL.
  [...originalUL.children].forEach(originalLI => {
    // Create a new LI element and copy over its class attribute.
    const newLI = document.createElement('li');
    newLI.className = originalLI.className;
    
    // Move all child elements from the original LI to the new LI.
    while (originalLI.firstElementChild) {
      newLI.append(originalLI.firstElementChild);
    }
    
    // For each <img> in the new LI, wrap it in a <picture> if it isn't already.
    newLI.querySelectorAll('img').forEach(img => {
      if (!img.closest('picture')) {
        const picture = document.createElement('picture');
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(img);
      }
    });
    
    newUL.append(newLI);
  });
  
  // Optimize images: Replace each <picture> with an optimized version.
  newUL.querySelectorAll('picture > img').forEach(img => {
    const picture = img.closest('picture');
    if (!picture) return;
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }]
    );
    picture.replaceWith(optimizedPic);
  });
  
  // Clear the original block and append the new UL.
  block.textContent = '';
  block.append(newUL);
}
