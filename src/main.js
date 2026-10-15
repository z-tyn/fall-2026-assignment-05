import products from './data/products.json';

/**
 * Artisan Roast Co. - Storefront Client Logic
 * Handles dynamic product card rendering and client-side pagination.
 */
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');
  const pageIndicator = document.getElementById('page-indicator');

  // If we are not on the Store page, exit cleanly
  if (!productGrid || !prevButton || !nextButton || !pageIndicator) {
    return;
  }

  const ITEMS_PER_PAGE = 5;
  const TOTAL_PAGES = Math.ceil(products.length / ITEMS_PER_PAGE);
  let currentPage = 1;

  /**
   * Render product cards for a specified page number.
   * @param {number} page
   */
  function renderProducts(page) {
    // Slicing dataset for client-side pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = products.slice(startIndex, endIndex);

    // Build product card markup
    const cardsHtml = currentProducts
      .map(
        (product) => `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-image-container">
            <img 
              src="${product.imageUrl}" 
              alt="${product.name}" 
              class="product-image" 
              loading="lazy"
            />
          </div>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">${product.category}</span>
              <span class="product-price">$${product.price.toFixed(2)}</span>
            </div>
            <h2 class="product-title">${product.name}</h2>
            <p class="product-description">${product.description}</p>
          </div>
        </article>
      `,
      )
      .join('');

    productGrid.innerHTML = cardsHtml;

    // Update pagination status indicator
    pageIndicator.textContent = `Page ${page} of ${TOTAL_PAGES}`;
    pageIndicator.setAttribute(
      'aria-label',
      `Current page ${page} of ${TOTAL_PAGES}`,
    );

    // Update boundary guardrails
    prevButton.disabled = page <= 1;
    nextButton.disabled = page >= TOTAL_PAGES;
    prevButton.setAttribute('aria-disabled', String(page <= 1));
    nextButton.setAttribute('aria-disabled', String(page >= TOTAL_PAGES));
  }

  // Event handler for Previous page button
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts(currentPage);
      // Smooth scroll back to top of product grid for better UX
      productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Event handler for Next page button
  nextButton.addEventListener('click', () => {
    if (currentPage < TOTAL_PAGES) {
      currentPage++;
      renderProducts(currentPage);
      // Smooth scroll back to top of product grid for better UX
      productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Initial render on page load
  renderProducts(currentPage);
});
