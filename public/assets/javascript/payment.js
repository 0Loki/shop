document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutButton = document.querySelector('.checkout-button');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const conversionRate = 35; // Example conversion rate from USD to THB

    window.addToCart = function(name, price, imageUrl) {
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, imageUrl, quantity: 1 });
        }
        updateCart();
        animateCartIcon();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'block';
        } else {
            cartCountElement.style.display = 'none';
        }
    }

    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon i');
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate-bounce');
        }, 500);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear existing content
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="images/${item.imageUrl}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="cart-item-title">${item.name}</p>
                    <p class="cart-item-price">฿${item.price}</p>
                    <div class="quantity-controls">
                        <button class="quantity-button decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-button increase">+</button>
                    </div>
                </div>
                <button class="remove-button" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);

            const quantityInput = cartItem.querySelector('.quantity-input');
            cartItem.querySelector('.increase').addEventListener('click', () => {
                item.quantity++;
                quantityInput.value = item.quantity;
                updateCart();
            });

            cartItem.querySelector('.decrease').addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                    quantityInput.value = item.quantity;
                    updateCart();
                }
            });

            quantityInput.addEventListener('change', (event) => {
                const newQuantity = parseInt(event.target.value);
                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                    updateCart();
                } else {
                    event.target.value = item.quantity;
                }
            });

            cartItem.querySelector('.remove-button').addEventListener('click', () => {
                removeFromCart(index);
            });
        });

        updateTotal();
    }

    function updateCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart(); // Re-render the cart
        updateCartCount(); // Update cart count

        // Disable checkout button if cart is empty
        if (cart.length === 0) {
            checkoutButton.disabled = true;
        } else {
            checkoutButton.disabled = false;
        }
    }

    function updateTotal() {
        const total = cart.reduce((acc, item) => {
            const price = parseFloat(item.price);
            return acc + price * item.quantity;
        }, 0);
        cartTotalElement.textContent = `฿${total.toFixed(2)}`;
    }

    function removeFromCart(index) {
        cart.splice(index, 1); // Remove the item at the specified index
        updateCart(); // Update the cart and re-render
    }

    async function checkout() {
        const button = document.querySelector('.checkout-button');
        const error = document.getElementById('error');
        const frontend_url = 'https://shop-76ece.web.app/';
        error.style.display = 'none';
        button.disabled = true;

        try {
            const response = await fetch('https://tools.mbasic.io/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: cart.map(item => ({
                        name: item.name,
                        description: `สินค้า ${item.name}`,
                        price: item.price,
                        quantity: item.quantity || 1
                    })),
                    redirectUrl: `${frontend_url}/index.html?payment=success`,
                    frontend_url: frontend_url
                })
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.paymentUrl;
            } else {
                throw new Error(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
            }
        } catch (err) {
            error.textContent = err.message;
            error.style.display = 'block';
        } finally {
            button.disabled = false;
        }
    }

    window.checkout = checkout;

    // Initial render
    renderCart();
    updateCartCount(); // Initial update of cart count

    // Check for payment success
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <p>การชำระเงินสำเร็จ! <br>ขอบคุณที่ใช้บริการ</p>
                <button style="background-color: #ff4d4d; color: white;" id="close-popup">ปิด</button>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('close-popup').addEventListener('click', () => {
            popup.remove();
            window.history.replaceState({}, document.title, window.location.pathname);
        });

        // ล้างตะกร้าสินค้า
        localStorage.removeItem('cart');
        cart = [];
        updateCart();
    }

    // Toggle cart dropdown
    document.querySelector('.cart-icon').addEventListener('click', function(event) {
        event.stopPropagation();
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const cartDropdown = document.getElementById('cart-dropdown');
        if (!cartDropdown.contains(event.target) && !event.target.closest('.cart-icon')) {
            cartDropdown.classList.remove('show');
        }
    });

    // Prevent dropdown from closing when clicking inside
    document.getElementById('cart-dropdown').addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Show payment popup
    function showPaymentPopup() {
        const cartDropdown = document.getElementById('cart-dropdown');
        cartDropdown.classList.remove('show'); // Close the cart dropdown

        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <p>ยืนยันการชำระเงิน?</p>
                <button id="confirm-payment">ยืนยัน</button>
                <button id="cancel-payment">ยกเลิก</button>
            </div>
        `;
        document.body.appendChild(popup);

        // Prevent clicking outside the popup from closing it
        popup.addEventListener('click', function(event) {
            event.stopPropagation();
        });

        document.getElementById('confirm-payment').addEventListener('click', function() {
            checkout();
            popup.remove();
        });

        document.getElementById('cancel-payment').addEventListener('click', function() {
            popup.remove();
        });
    }

    // Bind checkout button to show payment popup
    if (checkoutButton) {
        checkoutButton.addEventListener('click', showPaymentPopup);
    } else {
        console.error('Checkout button not found.');
    }
});