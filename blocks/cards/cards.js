import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  if (!block) {
    console.error('No block element provided.');
    return;
  }

  // Locate the original UL that contains the card items.
  const originalUL = block.querySelector('ul');
  if (!originalUL) {
    console.warn('No UL found within the block.');
    return;
  }

  // Create a new UL for the transformed content.
  const newUL = document.createElement('ul');

  // Process each child LI of the original UL.
  [...originalUL.children].forEach((child, index) => {
    if (!child) return;
    const newLI = document.createElement('li');

    // Move all child elements from the current LI to the new LI.
    while (child.firstElementChild) {
      newLI.append(child.firstElementChild);
    }

    // Assign classes based on the content:
    // If an element contains only one child and that child is a <picture>,
    // then assign 'cards-card-image'; otherwise, assign 'cards-card-body'.
    [...newLI.children].forEach((elem) => {
      if (elem.children.length === 1 && elem.querySelector('picture')) {
        elem.className = 'cards-card-image';
      } else {
        elem.className = 'cards-card-body';
      }
    });

    newUL.append(newLI);
  });

  // Process each <picture> element by replacing it with an optimized version.
  newUL.querySelectorAll('picture > img').forEach((img) => {
    if (!img) return;
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

  // Clear the original block and append the new UL.
  block.textContent = '';
  block.append(newUL);
}
