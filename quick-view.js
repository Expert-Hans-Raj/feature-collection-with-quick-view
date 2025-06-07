document.addEventListener('DOMContentLoaded', () => {
  const quickViewOverlay = document.querySelector('.quick-view-overlay');
  const modalTitle = document.querySelector('.quick-view-title');
  const modalImageContainer = document.querySelector('.quick-view-image');
  const modalPrice = document.querySelector('.quick-view-price');
  const addToCartBtn = document.querySelector('.quick-view-add-to-cart');
  const modalSwatchesContainer = document.createElement('div');
  modalSwatchesContainer.className = 'quick-view-color-swatches';
  modalSwatchesContainer.style.display = 'flex';
  modalSwatchesContainer.style.gap = '10px';
  modalSwatchesContainer.style.marginBottom = '15px';

  modalPrice.insertAdjacentElement('afterend', modalSwatchesContainer);

  let currentProduct = null;
  let selectedVariantId = null;

  function createSwatch(variant, isSelected) {
    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.cssText = `
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: ${isSelected ? '2px solid #007bff' : '1px solid #ccc'};
      cursor: pointer;
      background-color: ${variant.options[0].toLowerCase()};
    `;
    swatch.title = variant.title;
    swatch.dataset.variantId = variant.id;
    swatch.dataset.image = variant.featured_image?.src || currentProduct.featured_image;

    swatch.addEventListener('click', () => {
      selectedVariantId = variant.id;
      modalImageContainer.innerHTML = `<img src="${swatch.dataset.image}" alt="${modalTitle.textContent}" style="width:100%;">`;
      modalPrice.textContent = `₹${(variant.price / 100).toFixed(2)}`;
      [...modalSwatchesContainer.children].forEach(s => s.style.border = '1px solid #ccc');
      swatch.style.border = '2px solid #007bff';
    });

    return swatch;
  }

  // Handle Quick View Button Click
  document.querySelectorAll('.btn-quick-view').forEach(button => {
    button.addEventListener('click', async () => {
      const handle = button.getAttribute('data-product-handle');
      try {
        const res = await fetch(`/products/${handle}.js`);
        const product = await res.json();
        currentProduct = product;

        modalTitle.textContent = product.title;
        modalImageContainer.innerHTML = `<img src="${product.featured_image}" alt="${product.title}" style="width:100%;">`;
        modalSwatchesContainer.innerHTML = '';
        selectedVariantId = null;

        const hasVariants = product.variants.length > 1 || product.variants[0].title !== "Default Title";

        if (hasVariants) {
          product.variants.forEach((variant, idx) => {
            const swatch = createSwatch(variant, idx === 0);
            modalSwatchesContainer.appendChild(swatch);
            if (idx === 0) {
              selectedVariantId = variant.id;
              modalPrice.textContent = `₹${(variant.price / 100).toFixed(2)}`;
            }
          });
          modalSwatchesContainer.style.display = 'flex';
        } else {
          selectedVariantId = product.variants[0].id;
          modalPrice.textContent = `₹${(product.variants[0].price / 100).toFixed(2)}`;
          modalSwatchesContainer.style.display = 'none';
        }

        quickViewOverlay.style.display = 'flex';
      } catch (err) {
        console.error('Quick view error:', err);
        alert('Unable to load product. Try again.');
      }
    });
  });

  // Quick View Close
  document.querySelector('.quick-view-close').addEventListener('click', () => {
    quickViewOverlay.style.display = 'none';
    modalSwatchesContainer.innerHTML = '';
    modalSwatchesContainer.style.display = 'flex';
    modalImageContainer.innerHTML = '';
    modalPrice.textContent = '';
    selectedVariantId = null;
  });

  // Quick View Add to Cart
  addToCartBtn.addEventListener('click', async () => {
    // If no variant selected,
    const variantIdToAdd = selectedVariantId;
    if (!variantIdToAdd) {
      
      return;
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantIdToAdd, quantity: 1 })
      });

      if (res.ok) {
        alert('Added to cart!');
        quickViewOverlay.style.display = 'none';
      } else {
        const err = await res.json();
        alert('Error: ' + (err.description || 'Failed to add to cart.'));
      }
    } catch (err) {
      console.error('Cart error:', err);
      alert('Something went wrong. Try again.');
    }
  });

  // --- Collection Page Swatch and Cart ---
  document.querySelectorAll('.product-card').forEach(card => {
    const productId = card.dataset.productId;
    const defaultVariant = card.dataset.defaultVariant;  
    const imgEl = card.querySelector('.product-card__image');

    card.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const variantId = swatch.dataset.variantId;
        const image = swatch.dataset.image;

        card.dataset.selectedVariant = variantId;

        if (imgEl && image) imgEl.src = image;

        card.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
    });

    const btn = card.querySelector('.btn-add-to-cart');
    if (btn) {
      btn.addEventListener('click', async () => {
        const variantToAdd = card.dataset.selectedVariant || defaultVariant;


        if (!variantToAdd) {
          return;
        }

        try {
          const res = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantToAdd, quantity: 1 })
          });

          if (res.ok) {
            alert('Added to cart!');
          } else {
            const err = await res.json();
            alert('Error: ' + (err.description || 'Unable to add to cart.'));
          }
        } catch (err) {
          console.error('Cart error:', err);
          alert('Something went wrong.');
        }
      });
    }
  });
});
