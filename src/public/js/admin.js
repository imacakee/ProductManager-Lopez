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
  authToken = localStorage.getItem("authToken") || cookies.jwtCookieToken;
  fetch(`/api/users`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((result) => result.json())
    .then((res) => loadUsers(res));
});

const loadUsers = (userList) => {
  console.log(userList);
  const container = document.getElementById("users_container");
  userList.forEach((user) => {
    container.innerHTML += `
          <tr>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td>
          <select class="form-select" onChange="changeUserRole('${
            user._id
          }',this)">
            <option ${
              user.role === "user" ? "selected" : ""
            } value="user">User</option>
            <option ${
              user.role === "premium" ? "selected" : ""
            } value="premium">Premium</option>
            <option ${
              user.role === "admin" ? "selected" : ""
            } value="admin">Admin</option>
          </select>
          </td>
          <td><button class="btn btn-danger" onClick="deleteUser('${
            user.email
          }')" >Delete User</button>
          </td>
          </tr>
          `;
  });
};

const changeUserRole = (id, select) => {
  fetch(`/api/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({
      role: select.value,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  }).then(() => location.reload());
};

const deleteUser = (email) => {
  fetch(`/api/users/${email}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
  }).then(() => location.reload());
};

// const submitForm = () => {
//   const title = document.getElementById("prd_title").value;
//   const description = document.getElementById("prd_description").value;
//   const price = document.getElementById("prd_price").value;
//   const thumbnail = document.getElementById("prd_thumbnail").value;
//   const code = document.getElementById("prd_code").value;
//   const stock = document.getElementById("prd_stock").value;
//   const category = document.getElementById("prd_category").value;
//   fetch(`/api/products`, {
//     method: "POST",
//     body: JSON.stringify({
//       title,
//       description,
//       price,
//       thumbnail,
//       code,
//       stock,
//       category,
//     }),
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${authToken}`,
//     },
//   }).then(() => location.reload());
// };

// const purchase = () => {
//   fetch(`/api/carts/${cartId}/purchase`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${authToken}`,
//     },
//   })
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.error) {
//         alert(`${res.message}: ${res.products.toString()}`);
//       } else {
//         alert(res.message);
//       }
//       location.reload();
//     });
// };

// const loadProducts = (response) => {
//   const pagesContainer = document.getElementById("product_pages");
//   for (let page = 1; page <= response.totalPages; page++) {
//     pagesContainer.innerHTML += `<a href="/products?page=${page}">${page}</a>`;
//   }
//   const container = document.getElementById("product_container");
//   response.docs.forEach((prd) => {
//     container.innerHTML += `
//         <tr>
//         <td>${prd.title}</td>
//         <td>${prd.price}</td>
//         <td>${prd.status}</td>
//         <td>${prd.code}</td>
//         <td>${prd.stock}</td>
//         <td>${prd.category}</td>
//         <td><button class="btn btn-success" onClick="addProduct('${prd._id}')" >add to cart</button>
//         <button class="btn btn-danger" onClick="deleteProduct('${prd._id}')">delete</button></td>
//         </tr>
//         `;
//   });
// };

// const addProduct = (prdId) => {
//   fetch(`/api/carts/${cartId}/product/${prdId}?amount=1`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${authToken}`,
//     },
//   }).then((result) => console.log(result));
// };

// const deleteProduct = (prdId) => {
//   fetch(`/api/products/${prdId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${authToken}`,
//     },
//   }).then(() => location.reload());
// };
