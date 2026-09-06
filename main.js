const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const selectedCategory = button.getAttribute('data-category');
    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'all' || selectedCategory === cardCategory) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  });
});