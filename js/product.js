//Declaring variables
let products = [];
const cart = [];

// Fetch products from JSON file
fetch("products.json")
  .then((response) => response.json())
  .then((data) => {
    products = data;
    renderProducts();
  })
  .catch((error) => console.error("Error loading products:", error));

  // Function to render product cards on the page
function renderProducts() {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  //HTML for product card
  products.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.className = "col-md-4 mb-4";
    productCard.innerHTML = `
      <div class="card">
        <div class="card-img-container">
          <img src="${product.image.mobile}" class="card-img-top" alt="${
      product.name
    }">
          <div class="add-to-cart-container">
            <button class="btn btn-prim add-to-cart-btn" onclick="addToCart(${index})">
              <i class="bi bi-cart-plus"></i> Add to Cart
            </button>
            <div class="input-group quantity-input-group">
              <button class="btn" type="button" onclick="decreaseQuantity(${index})">-</button>
              <span class="quantity-display">1</span>
              <button class="btn" type="button" onclick="increaseQuantity(${index})">+</button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <p class="category">${product.category}</p>
          <h5 class="card-title">${product.name}</h5>
          <p class="price">$${product.price.toFixed(2)}</p>
        </div>
      </div>
    `;
    productList.appendChild(productCard);
  });
}

// Function to add a product to the cart
function addToCart(index) {
  const product = products[index];
  const card = document.querySelectorAll(".card")[index];
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  const quantityInputGroup = card.querySelector(".quantity-input-group");

  // Check if the product is already in the cart
  const existingItem = cart.find((item) => item.name === product.name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Update UI
  addToCartBtn.style.display = "none";
  quantityInputGroup.style.display = "flex";

  renderCart();
  updateProductQuantityDisplay(index);
}

// Function to decrease the quantity of a product in the cart
function decreaseQuantity(index) {
  const item = cart.find((item) => item.name === products[index].name);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else if (item && item.quantity === 1) {
    const itemIndex = cart.indexOf(item);
    cart.splice(itemIndex, 1);
    resetProductCard(index);
  }
  renderCart();
  updateProductQuantityDisplay(index);
}

// Function to increase the quantity of a product in the cart
function increaseQuantity(index) {
  const item = cart.find((item) => item.name === products[index].name);
  if (item) {
    item.quantity += 1;
  }
  renderCart();
  updateProductQuantityDisplay(index);
}

// Function to update the quantity display on a product card
function updateProductQuantityDisplay(index) {
  const card = document.querySelectorAll(".card")[index];
  const quantityDisplay = card.querySelector(".quantity-display");
  const item = cart.find((item) => item.name === products[index].name);

  if (item) {
    quantityDisplay.textContent = item.quantity;
  }
}

// Function to reset a product card to its initial state
function resetProductCard(index) {
  const card = document.querySelectorAll(".card")[index];
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  const quantityInputGroup = card.querySelector(".quantity-input-group");
  const quantityDisplay = card.querySelector(".quantity-display");

  addToCartBtn.style.display = "block";
  quantityInputGroup.style.display = "none";
  quantityDisplay.textContent = "1";
}

// Function to render the cart contents
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const emptyCart = document.getElementById("empty-cart");
  const confirmOrderBtn = document.querySelector(".confirm-order-btn");
  const carbonNeutral = document.getElementById("carbon-neutral");
  cartItems.innerHTML = "";

  let total = 0;
  let uniqueItemCount = cart.length;

  // Display appropriate elements based on cart contents
  if (cart.length === 0) {
    // Cart is empty
    emptyCart.style.display = "block";
    cartTotal.style.display = "none";
    confirmOrderBtn.style.display = "none";
    carbonNeutral.style.display = "none";
  } else {
    // Cart has items
    emptyCart.style.display = "none";
    cartTotal.style.display = "block";
    confirmOrderBtn.style.display = "block";
    carbonNeutral.style.display = "block";

    // Render each cart item/Cart item HTML structure
    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="mb-0">${item.name}</h6>
            <small>
              <span class="cart-item-quantity">${
                item.quantity
              }x</span> @ $${item.price.toFixed(2)}
            </small>
          </div>
          <div class="d-flex align-items-center">
            <span class="cart-item-price me-2">$${(
              item.price * item.quantity
            ).toFixed(2)}</span>
            <button class="btn btn-sm btn-outline" onclick="removeFromCart(${index})">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);

      total += item.price * item.quantity;
    });

    // Update cart total
    cartTotal.innerHTML = `
      <div style="display: flex; justify-content: space-between; width: 100%;">
        <span>Order Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    `;
  }

  // Update cart count
  cartCount.textContent = uniqueItemCount;
}

// Function to remove an item from the cart
function removeFromCart(index) {
  const removedItem = cart.splice(index, 1)[0];
  const productIndex = products.findIndex(
    (product) => product.name === removedItem.name
  );
  if (productIndex !== -1) {
    resetProductCard(productIndex);
  }
  renderCart();
}

// Get both modal elements
const orderConfirmPromptModal = document.getElementById(
  "orderConfirmPromptModal"
);
const orderConfirmationModal = document.getElementById(
  "orderConfirmationModal"
);

// Add click event listener to the "Confirm Order" button
document
  .querySelector(".confirm-order-btn")
  .addEventListener("click", showOrderConfirmPrompt);

  // Function to show the order confirmation prompt
function showOrderConfirmPrompt() {
  orderConfirmPromptModal.style.display = "block";
  orderConfirmPromptModal.classList.add("show");
}

// Add click event listeners for the new modal buttons
document
  .getElementById("cancelOrderBtn")
  .addEventListener("click", closeConfirmPrompt);
document
  .getElementById("confirmOrderBtn")
  .addEventListener("click", proceedWithOrder);

  // Function to close the confirmation prompt
function closeConfirmPrompt() {
  orderConfirmPromptModal.style.display = "none";
  orderConfirmPromptModal.classList.remove("show");
}

// Function to proceed with the order
function proceedWithOrder() {
  closeConfirmPrompt();
  finalizeOrder();
}

// Function to finalize the order
function finalizeOrder() {
  showOrderConfirmationModal();
}

// Function to show the order confirmation modal
function showOrderConfirmationModal() {
  const modalOrderDetails = document.getElementById("modalOrderDetails");
  const modalOrderTotal = document.getElementById("modalOrderTotal");

  modalOrderDetails.innerHTML = "";
  let total = 0;

  // Render each item in the order confirmation/order item html
  cart.forEach((item) => {
    const itemDetail = document.createElement("div");
    itemDetail.className = "order-item";
    itemDetail.innerHTML = `
      <img src="${item.image.thumbnail}" alt="${
      item.name
    }" class="item-thumbnail">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>${item.quantity}x @ $${item.price.toFixed(2)}</p>
      </div>
      <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    modalOrderDetails.appendChild(itemDetail);
    total += item.price * item.quantity;
  });

  // Update order total in the modal
  modalOrderTotal.innerHTML = `
    <span>Order Total</span>
    <span>$${total.toFixed(2)}</span>
  `;

  // Show the modal
  orderConfirmationModal.style.display = "block";
  orderConfirmationModal.classList.add("show");
}

  // Function to start a new order
function startNewOrder() {
  cart.length = 0;
  renderCart();
  closeModal();

  // Reset all product cards to their initial state
  document.querySelectorAll(".card").forEach((card, index) => {
    resetProductCard(index);
  });
}

// Function to close the modal
function closeModal() {
  orderConfirmationModal.style.display = "none";
  orderConfirmationModal.classList.remove("show");
}

// Add click event listener to the "Start New Order" button
document
  .getElementById("startNewOrderBtn")
  .addEventListener("click", startNewOrder);

// Initial render
renderCart();
