import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Create a new <ul> to hold the service items.
  const ul = document.createElement('ul');
  ul.className = 'services-block';

  // Find the original <ul class="row"> within the block.
  const originalUL = block.querySelector('ul.row');
  if (!originalUL) return;

  // Process each service item (<li> element).
  [...originalUL.children].forEach((li) => {
    const newLi = document.createElement('li');
    newLi.className = 'service-item';

    // Locate the container holding the service details.
    const serviceContainer = li.querySelector('div.views-field.views-field-nothing');
    if (!serviceContainer) return;

    // 1. Process the image:
    // Wrap the original <img> in a <picture> tag.
    const img = serviceContainer.querySelector('img');
    if (img) {
      const picture = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      picture.appendChild(imgClone);
      picture.classList.add('service-image');
      newLi.append(picture);
    }

    // 2. Extract the service title.
    const titleAnchor = serviceContainer.querySelector('.service-title a');
    if (titleAnchor) {
      const title = document.createElement('h3');
      title.className = 'service-title';
      title.textContent = titleAnchor.textContent.trim();
      newLi.append(title);
    }

    // 3. Extract the description text.
    const descEl = serviceContainer.querySelector('.text p');
    if (descEl) {
      const description = document.createElement('p');
      description.className = 'service-description';
      description.textContent = descEl.textContent.trim();
      newLi.append(description);
    }

    // 4. Extract the service link.
    const linkEl = serviceContainer.querySelector('.hover-text.hover-service a');
    if (linkEl) {
      const link = document.createElement('a');
      link.className = 'service-link';
      link.href = linkEl.href;
      // Use the text from the span with class "name" if available.
      const spanName = linkEl.querySelector('.valign .name');
      link.textContent = spanName ? spanName.textContent.trim() : 'Learn More';
      newLi.append(link);
    }

    // Append the new service item to our new <ul>.
    ul.append(newLi);
  });

  // Clear the original block and insert the new services list.
  block.textContent = '';
  block.append(ul);

  // Transform all <picture> tags by replacing them with an optimized version.
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(
      img.src,
      img.alt,
      false,
      [{ width: '750' }]
    );
    img.closest('picture').replaceWith(optimizedPic);
  });
}
