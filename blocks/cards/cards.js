import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  if (!block) {
    console.error('No block element provided.');
    return;
  }
  
  // Create a new UL element to hold the transformed card items.
  const ul = document.createElement('ul');
  
  // Iterate directly over the block's children (each representing a row/card)
  [...block.children].forEach((row, index) => {
    if (!row) return;
    const li = document.createElement('li');
    
    // Move all child elements from the current row into the new LI.
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }
    
    // Assign classes based on the content:
    [...li.children].forEach((elem) => {
      if (elem.children.length === 1 && elem.querySelector('picture')) {
        elem.className = 'cards-card-image';
      } else {
        elem.className = 'cards-card-body';
      }
    });
    
    ul.append(li);
  });
  
  // Process each <picture> element by replacing it with an optimized version.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const picture = img.closest('picture');
    if (!picture) {
      console.warn('Picture tag not found for an image:', img);
      return;
    }
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }]
    );
    picture.replaceWith(optimizedPic);
  });
  
  // Clear the original block content and append the new UL.
  block.textContent = '';
  block.append(ul);
}
