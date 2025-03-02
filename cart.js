let cart = [];

function addToCart(name, price) {
    let item = cart.find(i => i.name === name);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCart();
    updateCheckoutButton(); // Update checkout button state
}

function updateCart() {
    let cartContainer = document.getElementById('cart-items');
    let totalContainer = document.getElementById('cart-total');
    let checkoutBtn = document.getElementById("checkout-btn");
    
    cartContainer.innerHTML = '';

    let totalPrice = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartContainer.innerHTML += `
        <div class='bg-white border-4 border-[#966A4C] rounded-lg p-3 mb-2'>
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">₱ ${item.price.toFixed(2)}</p>
                </div>
                <p class="font-bold"></p>
                <p class="font-bold">₱ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>
    
            <div class="flex justify-between items-center mt-2">
                <button class="border-2 bg-red-500 border-red-500 text-black px-3 py-1 rounded-lg" onclick="removeItem(${index})">
                    X
                </button>
                <div class="flex items-center space-x-2">
                    <button class="bg-yellow-500 px-3 py-1 rounded-lg" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="px-3 py-1 border rounded-lg">${item.quantity}</span>
                    <button class="bg-yellow-500 px-3 py-1 rounded-lg" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
        </div>
    `;
    });

    // Display total price
    totalContainer.innerHTML = `<strong>Total: ₱ ${totalPrice.toFixed(2)}</strong>`;

    updateCheckoutButton(); // Update checkout button state
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Cart modal and Aside
const stickyAside = document.getElementById("stickyAside");
const cartContainer = document.getElementById("cart-container");

function toggleCart() {
    if (cartContainer.classList.contains("hidden")) {
        cartContainer.classList.remove("hidden"); // Show cart modal
        stickyAside.classList.add("hidden"); // Hide aside
    } else {
        cartContainer.classList.add("hidden"); // Hide cart modal
        stickyAside.classList.remove("hidden"); // Show aside again
    }
}


// Checkout
async function checkout() {
    let checkoutBtn = document.getElementById("checkout-btn");

    // Prevent multiple clicks
    if (checkoutBtn.disabled) return;
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("opacity-50", "cursor-not-allowed"); // Make button look disabled

    // Prevent checkout if the cart is empty
    if (cart.length === 0) {
        return; // No alert, just keep button disabled
    }

    try {
        // Generate order number from an API
        let response = await fetch("https://www.random.org/integers/?num=1&min=100&max=999&col=1&base=10&format=plain&rnd=new");
        let orderNumber = await response.text();
        orderNumber = orderNumber.trim(); // Clean whitespace

        // Load jsPDF
        const { jsPDF } = window.jspdf;
        let doc = new jsPDF();

        // Set background color like your image
        doc.setFillColor(250, 247, 240); // background
        doc.rect(0, 0, 210, 297, "F"); // Full page color

        // Text formatting
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");

        // Order Text
        doc.setFontSize(30);
        doc.text("Your order number is", 50, 60);

        // Order Number
        doc.setFontSize(30);
        doc.text(orderNumber, 100, 110);

        // Thank you message
        doc.setFontSize(20);
        doc.text("Thank you! Please proceed to the counter", 35, 160);

        // Save as PDF
        doc.save(`Order_${orderNumber}.pdf`);

        // Clear cart after checkout
        cart = [];
        updateCart();

        // Redirect to homepage after a short delay
        setTimeout(() => {
            window.location.href = "index.html"; // Change to your homepage URL
        }, 1000);

    } catch (error) {
        console.error("Error generating order number:", error);
        alert("Failed to generate order number. Please try again.");
        checkoutBtn.disabled = false; // Re-enable button on error
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
}

// Function to update the checkout button state
function updateCheckoutButton() {
    let checkoutBtn = document.getElementById("checkout-btn");
    if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed"); // Make it look disabled
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed"); // Restore normal state
    }
}

// Ensure checkout button updates on page load
document.addEventListener("DOMContentLoaded", updateCheckoutButton);