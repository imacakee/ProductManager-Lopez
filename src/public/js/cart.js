let cartId;
let authToken;

const getCookies = () => {
  const pairs = document.cookie.split(";");
  const cookies = {};
  pairs.forEach((pair) => {
    const splittedPairs = pair.split("=");
    cookies[splittedPairs[0].trim()] = splittedPairs[1].trim();
  });
  return cookies;
};

window.addEventListener("load", (event) => {
  const cookies = getCookies();
  cartId = localStorage.getItem("cartId") || cookies.cartId;
  authToken = localStorage.getItem("authToken") || cookies.jwtCookieToken;
  fetch(`/api/carts/${cartId}?populate=true`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => loadCartItems(res));
});

const loadCartItems = (response) => {
  const itemsContainer = document.getElementById("cart_items_container");
  const items = response.items;
  items.forEach((item) => {
    itemsContainer.innerHTML += `
        <tr>
            <td>${item.product.title}</td>
            <td>${item.product.description}</td>
            <td>${item.product.code}</td>
            <td>${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>
                <button class="btn btn-success" onClick="modifyProductFromCart('${item.product._id}', '1')">
                    <i class="bi bi-plus-square-fill"></i>
                </button>
                <button class="btn btn-secondary" onClick="modifyProductFromCart('${item.product._id}', '-1')">
                    <i class="bi bi-dash-square-fill"></i>
                </button>
                <button class="btn btn-danger" onClick="modifyProductFromCart('${item.product._id}','-${item.quantity}')">
                    <i class="bi bi-trash3-fill"></i>
                </button>
            </td>
            </tr>
        </tr>
    `;
  });
};

const modifyProductFromCart = (prdId, amount) => {
  fetch(`/api/carts/${cartId}/product/${prdId}?amount=${amount}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  }).then((result) => location.reload());
};

const purchase = () => {
  fetch(`/api/carts/${cartId}/purchase`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.error) {
        alert(`${res.message}: ${res.products.toString()}`);
      } else {
        alert(res.message);
      }
      location.reload();
    });
};
