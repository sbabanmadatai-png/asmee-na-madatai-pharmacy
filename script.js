let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let cart = [];
let total = 0;

function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }
    updateCarousel();
}

function updateCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

// Optional: Auto-slide every 5 seconds
if (slides.length > 0) {
    setInterval(() => {
        moveSlide(1);
    }, 5000);
}

function addToCart(product, price) {
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product, price, quantity: 1 });
    }
    total += price;
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total');
    cartItems.innerHTML = '';
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button onclick="decreaseQuantity(${index})">-</button>
            ${item.quantity} x ${item.product} - ₦${item.price.toLocaleString()}
            <button onclick="increaseQuantity(${index})">+</button>
        `;
        cartItems.appendChild(li);
    });
    totalSpan.textContent = total.toLocaleString();
}

function increaseQuantity(index) {
    if (cart[index].quantity < 100) {
        cart[index].quantity += 1;
        total += cart[index].price;
        updateCart();
    }
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        total -= cart[index].price;
        updateCart();
    } else {
        total -= cart[index].price;
        cart.splice(index, 1);
        updateCart();
    }
}

function proceedToPayment() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    document.getElementById('payment-section').style.display = 'block';
}

document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const method = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Hide payment form
    document.getElementById('payment-section').style.display = 'none';
    
    // Show receipt
    document.getElementById('receipt').style.display = 'block';
    document.getElementById('receipt-name').textContent = name;
    document.getElementById('receipt-email').textContent = email;
    document.getElementById('receipt-method').textContent = method === 'card' ? 'Credit/Debit Card' : 'Bank Transfer';
    
    const receiptItems = document.getElementById('receipt-items');
    receiptItems.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantity} x ${item.product} - ₦${item.price.toLocaleString()}`;
        receiptItems.appendChild(li);
    });
    
    document.getElementById('receipt-total').textContent = total.toLocaleString();
    document.getElementById('receipt-date').textContent = new Date().toLocaleString();
    
    // Clear cart
    cart = [];
    total = 0;
    updateCart();
});

// Handle payment method change
document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
    radio.addEventListener('change', function() {
        const cardDetails = document.getElementById('card-details');
        const transferDetails = document.getElementById('transfer-details');
        if (this.value === 'card') {
            cardDetails.style.display = 'block';
            transferDetails.style.display = 'none';
        } else {
            cardDetails.style.display = 'none';
            transferDetails.style.display = 'block';
        }
    });
});