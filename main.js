const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

function filterProducts(selectedCategory) {

  filterButtons.forEach(btn => {
    btn.classList.remove('active');

    if (btn.getAttribute('data-category') === selectedCategory) {
      btn.classList.add('active');
    }
  });

  productCards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');

    if (selectedCategory === 'all' || selectedCategory === cardCategory) {
      card.classList.remove('hide');
    } else {
      card.classList.add('hide');
    }
  });
}
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedCategory = button.getAttribute('data-category');
    filterProducts(selectedCategory);
  });
});
const params = new URLSearchParams(window.location.search);
const categoryFromURL = params.get('category');

if (categoryFromURL) {
  filterProducts(categoryFromURL);
}
// menu
productCards.forEach(card => {
    const originalContent = card.innerHTML;
    const title = card.querySelector(".product-title").textContent;
    const category = card.dataset.category;
    const inner = document.createElement("div");
    inner.classList.add("card-inner");
    const front = document.createElement("div");
    front.classList.add("card-front");
    front.innerHTML = originalContent;
    const back = document.createElement("div");
    back.classList.add("card-back");
    back.innerHTML = `
        <button class="back-btn">×</button>
        <div>
            <h3 class="back-title">
                ${title}
            </h3>
            <p class="back-description">
                ${getDescription(title, category)}
            </p>
            <h4 class="size-title">
                Choose Size
            </h4>
            <div class="size-options">
                <button class="size-btn" data-price="9.99">
                    Small
                </button>
                <button class="size-btn active" data-price="10.99">
                    Medium
                </button>
                <button class="size-btn" data-price="12.99">
                    Large
                </button>
            </div>
            <h4 class="quantity-title">
                Quantity
            </h4>
            <div class="quantity-box">
                <button class="quantity-btn minus">
                    −
                </button>
                <span class="quantity">
                    1
                </span>
                <button class="quantity-btn plus">
                    +
                </button>
            </div>
        </div>
        <div>
            <div class="total-price">
                $10.99
            </div>
            <button class="cart-btn">
                Add to Cart
            </button>
        </div>
    `;
    inner.appendChild(front);
    inner.appendChild(back);
    card.innerHTML = "";
    card.appendChild(inner);
    card.addEventListener("click", function (event) {
        if (event.target.closest(".add-btn")) {
            event.stopPropagation();
            card.classList.add("flipped");
            return;
        }
        if (event.target.closest("button")) {
            return;
        }
        card.classList.toggle("flipped");
    });
    const backButton = back.querySelector(".back-btn");
    backButton.addEventListener("click", function (event) {
        event.stopPropagation();
        card.classList.remove("flipped");
    });
    const sizeButtons = back.querySelectorAll(".size-btn");
    const totalPrice = back.querySelector(".total-price");
    let selectedPrice = 10.99;
    sizeButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            sizeButtons.forEach(btn => {
                btn.classList.remove("active");
            });
            button.classList.add("active");
            selectedPrice =
                Number(button.dataset.price);
            updateTotal();
        });
    });
    const plusButton = back.querySelector(".plus");
    const minusButton = back.querySelector(".minus");
    const quantityElement =
        back.querySelector(".quantity");
    let quantity = 1;
    plusButton.addEventListener("click", function (event) {
        event.stopPropagation();
        quantity++;
        quantityElement.textContent =
            quantity;
        updateTotal();
    });
    minusButton.addEventListener("click", function (event) {
        event.stopPropagation();
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent =
                quantity;
            updateTotal();
        }
    });
    function updateTotal() {
        const total =
            selectedPrice * quantity;
        totalPrice.textContent =
            `$${total.toFixed(2)}`;

    }
    const cartButton =
        back.querySelector(".cart-btn");
    cartButton.addEventListener("click", function (event) {
        event.stopPropagation();
        const selectedSize =
            back.querySelector(".size-btn.active")
                .textContent;
        const total =
            selectedPrice * quantity;
        alert(
            `${title}\n` +
            `Size: ${selectedSize}\n` +
            `Quantity: ${quantity}\n` +
            `Total: $${total.toFixed(2)}`
        );
    });
});
filterButtons.forEach(button => {
    button.addEventListener("click", function () {
        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });
        button.classList.add("active");
        const selectedCategory =
            button.dataset.category;
        productCards.forEach(card => {
            const cardCategory =
                card.dataset.category;
            if (
                selectedCategory === "all" ||
                selectedCategory === cardCategory
            ) {
                card.classList.remove("hide");

            } else {
                card.classList.add("hide");
                card.classList.remove("flipped");
            }
        });
    });
});
function getDescription(title, category) {
    const descriptions = {
        pizza:
            `Freshly baked ${title} made with delicious ingredients, rich cheese and our special sauce.`,
        burgers:
            `A juicy ${title} prepared with fresh ingredients, a soft bun and our special restaurant sauce.`,

        chicken:
            `Tender and flavorful ${title}, freshly prepared with our special seasoning.`,

        pasta:
            `Delicious ${title} prepared with perfectly cooked pasta and a rich, flavorful sauce.`,

        salad:
            `A fresh ${title} made with crisp vegetables and delicious ingredients.`,

        drink:
            `A refreshing ${title} prepared with fresh ingredients and served chilled.`,

        dessert:
            `A delicious ${title} made with sweet and fresh ingredients, perfect for ending your meal.`
    };
    return descriptions[category] ||
        `A delicious ${title} prepared fresh by Savora.`;
}
//contact us
const contactForm = document.querySelector('.contact-form');
const submitBtn = contactForm.querySelector('.btn-submit');

contactForm.onsubmit = (event) => {
    event.preventDefault();

    submitBtn.innerText = "Sending...";
    submitBtn.style.opacity = "0.7";
    submitBtn.style.pointerEvents = "none";

    setTimeout(() => {
        submitBtn.innerText = "Send Message";
        submitBtn.style.opacity = "1";
        submitBtn.style.pointerEvents = "auto";

        showSuccessAlert();

        contactForm.reset();

    }, 2000);
}

function showSuccessAlert() {
    const alertBox = document.createElement('div');
    alertBox.className = 'success-alert';
    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="fa-solid fa-circle-check"></i>
            <h3>Success!</h3>
            <p>Your message has been sent successfully.</p>
        </div>
    `;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.animation = "fadeOut 0.5s ease forwards";
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}
