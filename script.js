const products = {
  "chicken-pasta": {
    id: "chicken-pasta", name: "Creamy Garlic Chicken Pasta", price: 9.49, time: "20 minutes", difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=900&q=85",
    detailImage: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=500&q=82",
    description: "Enjoy a comforting, creamy garlic chicken pasta made with fresh, pre-portioned ingredients. Designed for busy university students, this meal is quick to prepare, requires minimal cooking equipment and provides exactly enough ingredients for one serving.",
    ingredients: ["Pre-portioned pasta", "Chicken breast", "Fresh spinach", "Garlic", "Cream", "Parmesan cheese", "Seasoning blend", "Step-by-step recipe card"],
    allergens: "Wheat and dairy",
    instructions: ["Cook the pasta according to the recipe instructions.", "Prepare and thoroughly cook the chicken.", "Prepare the creamy garlic sauce.", "Combine the ingredients and add spinach.", "Serve and enjoy."],
    equipment: "Frying pan, saucepan, knife, cutting board and stirring spoon.",
    inventory: 8
  },
  "teriyaki-bowl": {
    id: "teriyaki-bowl", name: "Teriyaki Chicken Rice Bowl", price: 9.99, time: "25 minutes", difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
    detailImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=82",
    description: "A balanced teriyaki chicken rice bowl with sweet-savory sauce, crisp vegetables and exactly one serving of everything you need.",
    ingredients: ["Pre-portioned rice", "Chicken breast", "Broccoli", "Carrot", "Teriyaki sauce", "Green onion", "Sesame seasoning", "Recipe card"],
    allergens: "Soy, sesame and wheat",
    instructions: ["Cook the rice until tender.", "Prepare and cook the chicken thoroughly.", "Sauté broccoli and carrot.", "Warm the teriyaki sauce.", "Layer rice, chicken and vegetables, then add toppings."],
    equipment: "Saucepan, frying pan, knife, cutting board and stirring spoon.",
    inventory: 6
  },
  "black-bean-bowl": {
    id: "black-bean-bowl", name: "Southwest Black Bean Bowl", price: 7.99, time: "15 minutes", difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=900&q=85",
    detailImage: "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=500&q=82",
    description: "A colourful vegetarian bowl featuring seasoned black beans, corn, peppers and lime. Vegetarian and ready in about fifteen minutes.",
    ingredients: ["Cooked rice", "Black beans", "Sweet corn", "Bell pepper", "Avocado", "Lime", "Southwest seasoning", "Recipe card"],
    allergens: "May contain traces of soy",
    instructions: ["Warm the rice and black beans.", "Sauté corn and bell pepper.", "Prepare the avocado and lime.", "Combine the grains, beans and vegetables.", "Finish with lime and southwest seasoning."],
    equipment: "Saucepan or microwave-safe bowl, frying pan and knife.",
    inventory: 0
  },
  "pesto-pasta": {
    id: "pesto-pasta", name: "Tomato and Basil Pesto Pasta", price: 8.49, time: "20 minutes", difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=900&q=85",
    detailImage: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=500&q=82",
    description: "Fresh basil pesto, cherry tomatoes and tender pasta make an easy vegetarian dinner for a busy campus evening.",
    ingredients: ["Pre-portioned pasta", "Fresh basil pesto", "Cherry tomatoes", "Spinach", "Parmesan cheese", "Garlic", "Seasoning blend", "Recipe card"],
    allergens: "Wheat, dairy and pine nuts",
    instructions: ["Cook the pasta according to the recipe card.", "Halve the tomatoes and prepare the spinach.", "Warm the pesto gently with a little pasta water.", "Combine pasta, tomatoes and spinach.", "Top with Parmesan and serve."],
    equipment: "Saucepan, frying pan, knife, cutting board and stirring spoon.",
    inventory: 5
  }
};

const inventoryKey = "campusKitsInventory";
const cartKey = "campusKitsCart";
const analyticsKey = "campusKitsAnalytics";
const ordersKey = "campusKitsOrders";
const staffQueueKey = "campusKitsStaffQueue";
const emailLogKey = "campusKitsSimulatedEmails";

function getInventory() {
  const saved = JSON.parse(localStorage.getItem(inventoryKey) || "null");
  if (!saved) {
    const initial = Object.fromEntries(Object.values(products).map(p => [p.id, p.inventory]));
    localStorage.setItem(inventoryKey, JSON.stringify(initial));
    return initial;
  }
  return saved;
}
function setInventory(inventory) { localStorage.setItem(inventoryKey, JSON.stringify(inventory)); }
function getCart() { return JSON.parse(localStorage.getItem(cartKey) || "[]"); }
function setCart(cart) { localStorage.setItem(cartKey, JSON.stringify(cart)); renderCart(); }
function getOrders() { return JSON.parse(localStorage.getItem(ordersKey) || "[]"); }
function money(value) { return `$${value.toFixed(2)} CAD`; }
function logEvent(event, details = {}) {
  const events = JSON.parse(localStorage.getItem(analyticsKey) || "[]");
  events.push({ event, details, timestamp: new Date().toISOString() });
  localStorage.setItem(analyticsKey, JSON.stringify(events));
}

function openCart() {
  document.querySelector("[data-cart-panel]")?.classList.add("open");
  document.querySelector("[data-cart-overlay]")?.classList.add("open");
  document.querySelector("[data-cart-panel]")?.setAttribute("aria-hidden", "false");
}
function closeCart() {
  document.querySelector("[data-cart-panel]")?.classList.remove("open");
  document.querySelector("[data-cart-overlay]")?.classList.remove("open");
  document.querySelector("[data-cart-panel]")?.setAttribute("aria-hidden", "true");
}
function cartQuantityForDate(date) {
  return getCart().filter(item => item.date === date).reduce((sum, item) => sum + item.quantity, 0);
}
function renderCart() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => el.textContent = count);
  document.querySelectorAll("[data-cart-subtotal]").forEach(el => el.textContent = money(cart.reduce((sum, item) => sum + item.price * item.quantity, 0)));
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  if (!cart.length) {
    container.innerHTML = '<div class="empty-cart"><strong>Your cart is empty</strong><p>Add a meal to start an order.</p></div>';
  } else {
    container.innerHTML = cart.map((item, index) => `
      <article class="cart-item">
        <img src="${products[item.id].image}" alt="${products[item.id].name}">
        <div><h3>${products[item.id].name}</h3><p>Qty: ${item.quantity} · ${money(item.price)}</p><p>${item.date || "No date"} · ${item.time || "No time"}</p></div>
        <button class="remove-item" type="button" data-remove-index="${index}" aria-label="Remove ${products[item.id].name}">×</button>
      </article>`).join("");
  }
  container.querySelectorAll("[data-remove-index]").forEach(button => button.addEventListener("click", () => {
    const next = getCart();
    next.splice(Number(button.dataset.removeIndex), 1);
    setCart(next);
  }));
}

function setupNavAndCart() {
  document.querySelectorAll("[data-open-cart]").forEach(button => button.addEventListener("click", openCart));
  document.querySelectorAll("[data-close-cart]").forEach(button => button.addEventListener("click", closeCart));
  document.querySelector("[data-cart-overlay]")?.addEventListener("click", closeCart);
  document.querySelector(".nav-toggle")?.addEventListener("click", event => {
    const toggle = event.currentTarget;
    const links = document.querySelector(".nav-links");
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    links.classList.toggle("open", !open);
  });
  document.querySelectorAll(".nav-links a").forEach(link => link.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.remove("open");
    document.querySelector(".nav-toggle")?.setAttribute("aria-expanded", "false");
  }));
  document.querySelectorAll("[data-policy]").forEach(link => link.addEventListener("click", event => event.preventDefault()));
  renderCart();
}

function setupHomepage() {
  const form = document.querySelector("#newsletter-form");
  form?.addEventListener("submit", event => {
    event.preventDefault();
    const email = document.querySelector("#newsletter-email").value.trim();
    if (!email) return;
    const simulatedEmails = JSON.parse(localStorage.getItem(emailLogKey) || "[]");
    simulatedEmails.push({
      email,
      type: "welcome-discount",
      code: "CAMPUS15",
      status: "simulated-not-sent",
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(emailLogKey, JSON.stringify(simulatedEmails));
    document.querySelector("#newsletter-message").textContent = "Success! Use code CAMPUS15 for 15% off your first order.";
    logEvent("newsletter_signup", { discountCode: "CAMPUS15", prototype: true });
    form.reset();
  });
  document.querySelectorAll(".meal-card [href*='meal=']").forEach(link => link.addEventListener("click", () => {
    const id = new URL(link.href).searchParams.get("meal");
    logEvent("product_view", { mealId: id });
  }));
}

function setupProductPage() {
  let selectedId = "chicken-pasta";
  const params = new URLSearchParams(location.search);
  if (products[params.get("meal")]) selectedId = params.get("meal");

  const selector = document.querySelector("#meal-selector");
  Object.values(products).forEach(product => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "meal-option";
    button.dataset.meal = product.id;
    button.textContent = `${product.name}${getInventory()[product.id] === 0 ? " · Sold out" : ""}`;
    button.setAttribute("aria-pressed", "false");
    selector.appendChild(button);
  });

  const dateInput = document.querySelector("#pickup-date");
  const tomorrow = new Date();
  tomorrow.setHours(12, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 2);
  dateInput.min = tomorrow.toISOString().slice(0, 10);

  function selectProduct(id) {
    selectedId = id;
    const product = products[id];
    const stock = getInventory()[id];
    document.querySelector("#product-name").textContent = product.name;
    document.querySelector("#product-price").innerHTML = `$${product.price.toFixed(2)} <span>CAD</span>`;
    document.querySelector("#product-time").textContent = product.time;
    document.querySelector("#product-difficulty").textContent = product.difficulty;
    document.querySelector("#product-description").textContent = product.description;
    document.querySelector("#product-main-image").src = product.image;
    document.querySelector("#product-main-image").alt = `${product.name} prepared meal`;
    document.querySelector("#product-detail-image").src = product.detailImage;
    document.querySelector("#product-detail-image").alt = `Fresh pre-portioned ingredients for ${product.name}`;
    document.querySelector("#ingredient-list").innerHTML = product.ingredients.map(item => `<li>${item}</li>`).join("");
    document.querySelector("#allergens").textContent = product.allergens;
    document.querySelector("#cooking-instructions").innerHTML = product.instructions.map(item => `<li>${item}</li>`).join("");
    document.querySelector("#equipment").textContent = product.equipment;
    const availability = document.querySelector("#availability");
    const alternative = Object.values(products).find(item => item.id !== id && getInventory()[item.id] > 0);
    availability.textContent = stock > 0
      ? `● In stock · ${stock} available`
      : `● Sold out — please choose another meal${alternative ? `, such as ${alternative.name}` : ""}.`;
    availability.className = stock > 0 ? "availability in-stock" : "availability sold-out";
    document.querySelector("#add-to-cart").disabled = stock === 0;
    document.querySelectorAll(".meal-option").forEach(button => {
      const option = products[button.dataset.meal];
      button.textContent = `${option.name}${getInventory()[option.id] === 0 ? " · Sold out" : ""}`;
      const selected = button.dataset.meal === id;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateTotal();
    logEvent("meal_selection", { mealId: id });
    logEvent("product_view", { mealId: id });
  }
  selector.addEventListener("click", event => {
    const button = event.target.closest("[data-meal]");
    if (button && !button.disabled) selectProduct(button.dataset.meal);
  });

  function updateTotal() {
    const quantity = Number(document.querySelector("#quantity").value);
    const total = products[selectedId].price * quantity;
    document.querySelector("#order-total").textContent = money(total);
  }
  document.querySelector("#quantity").addEventListener("change", updateTotal);

  document.querySelector("#add-to-cart").addEventListener("click", () => {
    const quantity = Number(document.querySelector("#quantity").value);
    const date = dateInput.value;
    const time = document.querySelector("#pickup-time").value;
    const stock = getInventory()[selectedId];
    const limitMessage = document.querySelector("#daily-limit");

    if (!date) { limitMessage.textContent = "Please select a pickup date at least two days in advance."; limitMessage.style.color = "#A23B32"; dateInput.focus(); return; }
    if (date < dateInput.min) { limitMessage.textContent = "Pickup must be at least two days from today."; limitMessage.style.color = "#A23B32"; dateInput.focus(); return; }
    if (!time) { limitMessage.textContent = "Please select a pickup time."; limitMessage.style.color = "#A23B32"; document.querySelector("#pickup-time").focus(); return; }
    const existingForMeal = getCart()
      .filter(item => item.id === selectedId)
      .reduce((sum, item) => sum + item.quantity, 0);
    if (quantity + existingForMeal > stock) {
      limitMessage.textContent = `Only ${stock} of this meal are available. Try another meal.`;
      limitMessage.style.color = "#A23B32";
      return;
    }
    if (cartQuantityForDate(date) + quantity > 3) {
      limitMessage.textContent = "You can order up to three meals per pickup day.";
      limitMessage.style.color = "#A23B32";
      return;
    }
    const cart = getCart();
    const existing = cart.find(item => item.id === selectedId && item.date === date && item.time === time);
    if (existing) existing.quantity += quantity;
    else cart.push({ id: selectedId, quantity, price: products[selectedId].price, date, time });
    setCart(cart);
    limitMessage.textContent = "Meal added to your cart.";
    limitMessage.style.color = "#245C43";
    logEvent("add_to_cart", { mealId: selectedId, quantity, pickupDate: date, pickupTime: time });
    openCart();
  });

  setupCheckout(() => selectProduct(selectedId));
  selectProduct(selectedId);
}

function setupCheckout(refreshProductAvailability) {
  const modal = document.querySelector("#checkout-modal");
  const openButton = document.querySelector("#open-checkout");
  const cartButton = document.querySelector("#cart-checkout");
  const closeButton = document.querySelector("#close-checkout");
  const form = document.querySelector("#checkout-form");
  const confirmButton = document.querySelector("#confirm-order");
  const errorMessage = document.querySelector("#checkout-error");
  const reviewCartButton = document.querySelector("#review-cart-after-stock");
  const promoInput = document.querySelector("#promo-code");
  const promoButton = document.querySelector("#apply-promo-code");
  const promoMessage = document.querySelector("#promo-code-message");
  let promoApplied = false;

  function getCheckoutTotals() {
    const subtotal = getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = promoApplied ? subtotal * 0.15 : 0;
    return { subtotal, discount, total: subtotal - discount };
  }

  function renderCheckoutSummary() {
    const cart = getCart();
    const summary = document.querySelector("#checkout-summary");
    const { subtotal, discount, total } = getCheckoutTotals();
    summary.innerHTML = cart.map(item =>
      `<div class="checkout-line"><strong>${item.quantity} × ${products[item.id].name}</strong><br>${item.date} · ${item.time}<br>${money(item.price * item.quantity)}</div>`
    ).join("") +
      `<div class="checkout-line"><strong>Subtotal: ${money(subtotal)}</strong></div>` +
      (promoApplied ? `<div class="checkout-line promo-discount"><strong>Promo discount (15%): −${money(discount)}</strong></div>` : "") +
      `<div class="checkout-line"><strong>Total: ${money(total)}</strong></div>`;
  }

  function renderOrderProgress() {
    const latestOrder = getOrders().at(-1);
    const panel = document.querySelector("#order-progress");
    if (!latestOrder || !panel) return;
    panel.hidden = false;
    document.querySelector("#order-progress-details").textContent =
      `${latestOrder.orderNumber} · ${money(latestOrder.total)} · ${latestOrder.items.map(item => `${item.quantity} × ${products[item.id].name} (${item.date}, ${item.time})`).join("; ")}`;
    const status = document.querySelector("#order-progress-status");
    const action = document.querySelector("#order-progress-action");
    if (latestOrder.status === "confirmed") {
      status.textContent = "Confirmed. Campus Kits staff have been notified to prepare and verify the order.";
      action.textContent = "Simulate Staff Preparation & Verification";
      action.hidden = false;
      action.disabled = false;
    } else if (latestOrder.status === "ready") {
      status.textContent = "Prepared and verified by staff. The order is ready for pickup.";
      action.textContent = "Simulate Customer Pickup";
      action.hidden = false;
      action.disabled = false;
    } else {
      status.textContent = `Fulfilled on ${new Date(latestOrder.fulfilledAt).toLocaleString()}. The customer pickup is complete.`;
      action.textContent = "Order Fulfilled";
      action.hidden = false;
      action.disabled = true;
    }
  }

  function openCheckout() {
    const cart = getCart();
    if (!cart.length) {
      openCart();
      return;
    }
    closeCart();
    promoApplied = false;
    promoInput.value = "";
    promoMessage.textContent = "";
    promoMessage.className = "";
    renderCheckoutSummary();
    document.querySelector("#confirmation").hidden = true;
    form.hidden = false;
    errorMessage.textContent = "";
    reviewCartButton.hidden = true;
    confirmButton.textContent = "Confirm Order";
    modal.showModal();
    logEvent("checkout_initiation", { itemCount: cart.length });
  }
  openButton?.addEventListener("click", openCheckout);
  cartButton?.addEventListener("click", openCheckout);
  function applyPromoCode() {
    const code = promoInput.value.trim().toUpperCase();
    if (code === "CAMPUS15") {
      promoApplied = true;
      promoMessage.textContent = "CAMPUS15 applied: 15% off your order.";
      promoMessage.className = "promo-success";
      logEvent("promo_code_applied", { code: "CAMPUS15" });
      renderCheckoutSummary();
    } else {
      promoApplied = false;
      promoMessage.textContent = code ? "That promo code is not valid." : "Enter a promo code.";
      promoMessage.className = "promo-error";
      logEvent("promo_code_rejected", { code });
      renderCheckoutSummary();
    }
  }
  promoButton?.addEventListener("click", applyPromoCode);
  promoInput?.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyPromoCode();
    }
  });
  closeButton?.addEventListener("click", () => modal.close());
  document.querySelector("#cancel-checkout")?.addEventListener("click", () => modal.close());
  reviewCartButton?.addEventListener("click", () => {
    modal.close();
    openCart();
  });
  document.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener("change", () => {
    errorMessage.textContent = "";
    confirmButton.textContent = "Confirm Order";
  }));
  document.querySelector("#order-progress-action")?.addEventListener("click", () => {
    const orders = getOrders();
    const order = orders.at(-1);
    if (!order) return;
    const staffQueue = JSON.parse(localStorage.getItem(staffQueueKey) || "[]");
    const staffNotice = staffQueue.find(item => item.orderNumber === order.orderNumber);
    if (order.status === "confirmed") {
      order.status = "ready";
      order.preparedAt = new Date().toISOString();
      if (staffNotice) staffNotice.status = "prepared-and-verified";
      logEvent("staff_prepared_and_verified", { orderNumber: order.orderNumber });
    } else if (order.status === "ready") {
      order.status = "fulfilled";
      order.fulfilledAt = new Date().toISOString();
      if (staffNotice) staffNotice.status = "fulfilled";
      logEvent("customer_pickup_fulfilled", { orderNumber: order.orderNumber });
    }
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    localStorage.setItem(staffQueueKey, JSON.stringify(staffQueue));
    renderOrderProgress();
  });

  form?.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const cart = getCart();
    const inventory = getInventory();
    const requested = cart.reduce((totals, item) => {
      totals[item.id] = (totals[item.id] || 0) + item.quantity;
      return totals;
    }, {});
    const unavailable = Object.entries(requested)
      .filter(([id, quantity]) => !products[id] || (inventory[id] || 0) < quantity)
      .map(([id]) => products[id]?.name || id);
    if (unavailable.length) {
      errorMessage.textContent = `${unavailable.join(", ")} is no longer available in the requested quantity. Please remove it and choose another meal. Your cart is saved.`;
      reviewCartButton.hidden = false;
      logEvent("inventory_conflict", { mealIds: Object.keys(requested) });
      return;
    }
    // Replace the demo result with a payment provider response; never collect card data here.
    if (new FormData(form).get("payment") === "failure") {
      errorMessage.textContent = "Demo payment unsuccessful. No charge was made. Retry by selecting successful payment, or cancel checkout. Your cart is saved.";
      confirmButton.textContent = "Retry Payment";
      return;
    }

    const customerEmail = new FormData(form).get("email");
    const orderNumber = `CK-${Date.now().toString().slice(-8)}`;
    const { subtotal, discount, total } = getCheckoutTotals();
    const order = {
      orderNumber,
      items: cart.map(item => ({ ...item })),
      subtotal,
      discount,
      promoCode: promoApplied ? "CAMPUS15" : null,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString()
    };
    cart.forEach(item => { inventory[item.id] = Math.max(0, inventory[item.id] - item.quantity); });
    setInventory(inventory);
    const orders = getOrders();
    orders.push(order);
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    // These local queues simulate future order-management and email integrations.
    const staffQueue = JSON.parse(localStorage.getItem(staffQueueKey) || "[]");
    staffQueue.push({
      orderNumber,
      status: "prepare-and-verify",
      items: order.items.map(({ id, quantity }) => ({ id, quantity })),
      pickups: order.items.map(({ date, time }) => ({ date, time })),
      createdAt: order.createdAt
    });
    localStorage.setItem(staffQueueKey, JSON.stringify(staffQueue));
    const simulatedEmails = JSON.parse(localStorage.getItem(emailLogKey) || "[]");
    simulatedEmails.push({ orderNumber, type: "customer-confirmation", status: "simulated-not-sent", createdAt: order.createdAt });
    localStorage.setItem(emailLogKey, JSON.stringify(simulatedEmails));

    form.hidden = true;
    document.querySelector("#confirmation").hidden = false;
    document.querySelector("#confirmation-details").textContent = `Confirmation ${orderNumber} · ${cart.reduce((sum, item) => sum + item.quantity, 0)} meal(s) · ${money(total)} · Pickup: ${cart.map(item => `${item.date}, ${item.time}`).join("; ")}`;
    document.querySelector("#confirmation-email").textContent = `A simulated confirmation email is ready for ${customerEmail}. Nothing was actually sent.`;
    document.querySelector("#staff-notice").textContent = "Campus Kits staff have been notified in the local demo order queue to prepare and verify this order.";
    setCart([]);
    refreshProductAvailability();
    renderOrderProgress();
    logEvent("simulated_confirmation_email", { orderNumber });
    logEvent("staff_order_notification", { orderNumber });
    logEvent("successful_order", { orderNumber, itemCount: cart.length });
  });
  document.querySelector("#finish-order")?.addEventListener("click", () => {
    modal.close();
    document.querySelector("#order-progress")?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  renderOrderProgress();
}

setupNavAndCart();
setupHomepage();
if (document.querySelector(".product-layout")) setupProductPage();
