function getCart() {
    return JSON.parse(localStorage.getItem('savora_cart')) || [];
}
function saveCart(cart) {
    localStorage.setItem('savora_cart', JSON.stringify(cart));
}
const cartItemsEl = document.getElementById('cartItems');
const emptyCartEl = document.getElementById('emptyCart');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('total');
const deliveryFee = 3;
function renderCart() {
    const cart = getCart();
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
        emptyCartEl.style.display = 'flex';
        cartItemsEl.style.display = 'none';
        subtotalEl.innerText = '$0.00';
        totalEl.innerText = '$0.00';
        return;
    }
    emptyCartEl.style.display = 'none';
    cartItemsEl.style.display = 'block';
    let subtotal = 0;
    cart.forEach((item, index) => {
        subtotal += item.price * item.qty;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <span class="item-price">$${item.price.toFixed(2)}</span>
            </div>
            <div class="qty-controls">
                <button class="decrease" data-index="${index}">-</button>
                <span>${item.qty}</span>
                <button class="increase" data-index="${index}">+</button>
            </div>
            <button class="remove-item" data-index="${index}">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsEl.appendChild(itemEl);
    });
    subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
    totalEl.innerText = `$${(subtotal + deliveryFee).toFixed(2)}`;

    document.querySelectorAll('.increase').forEach(btn => {
        btn.onclick = () => {
            const cart = getCart();
            cart[btn.dataset.index].qty += 1;
            saveCart(cart);
            renderCart();
        };
    });
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.onclick = () => {
            const cart = getCart();
            const idx = btn.dataset.index;
            cart[idx].qty -= 1;
            if (cart[idx].qty <= 0) cart.splice(idx, 1);
            saveCart(cart);
            renderCart();
        };
    });
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.onclick = () => {
            const cart = getCart();
            cart.splice(btn.dataset.index, 1);
            saveCart(cart);
            renderCart();
        };
    });
}
renderCart();
const cashLabel = document.getElementById('cashLabel');
const visaLabel = document.getElementById('visaLabel');
const visaForm = document.getElementById('visaForm');

cashLabel.addEventListener('click', () => {
    cashLabel.classList.add('active');
    visaLabel.classList.remove('active');
    visaForm.classList.remove('show');
});

visaLabel.addEventListener('click', () => {
    visaLabel.classList.add('active');
    cashLabel.classList.remove('active');
    visaForm.classList.add('show');
});

const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', () => {
    let value = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
    cardNumberInput.value = value.replace(/(.{4})/g, '$1 ').trim();
});

const cardExpiryInput = document.getElementById('cardExpiry');
cardExpiryInput.addEventListener('input', () => {
    let value = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    cardExpiryInput.value = value;
});

const cardCvvInput = document.getElementById('cardCvv');
cardCvvInput.addEventListener('input', () => {
    cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').slice(0, 3);
});

const checkoutBtn = document.getElementById('checkoutBtn');

checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

    if (selectedPayment === 'visa') {
        const name = document.getElementById('cardName').value.trim();
        const number = document.getElementById('cardNumber').value.trim();
        const expiry = document.getElementById('cardExpiry').value.trim();
        const cvv = document.getElementById('cardCvv').value.trim();

        if (!name || number.replace(/\s/g, '').length < 16 || expiry.length < 5 || cvv.length < 3) {
            alert('Please fill in valid card details.');
            return;
        }
    }

    checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
    checkoutBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        localStorage.removeItem('savora_cart');
        showSuccessAlert(selectedPayment);
        renderCart();
        checkoutBtn.innerHTML = '<i class="fa-solid fa-lock"></i> Confirm Order';
        checkoutBtn.style.pointerEvents = 'auto';
    }, 2000);
});

function showSuccessAlert(method) {
    const alertBox = document.createElement('div');
    alertBox.className = 'success-alert';
    alertBox.innerHTML = `
        <div class="alert-content">
            <i class="fa-solid fa-circle-check"></i>
            <h3>Order Confirmed!</h3>
            <p>${method === 'cash' ? 'Pay with cash on delivery.' : 'Your card payment was processed.'}</p>
        </div>
    `;
    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.5s ease forwards';
        setTimeout(() => alertBox.remove(), 500);
    }, 3000);
}
