let cartId;

window.addEventListener("load", (event) => {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get("page") || null;
  fetch(`/api/products${page ? `?page=${page}` : ""}`)
    .then((result) => result.json())
    .then((res) => loadProducts(res));

  fetch("/api/carts")
    .then((result) => result.json())
    .then((res) => (cartId = res.docs[0]._id));
});

const submitForm = () => {
  const title = document.getElementById("prd_title").value;
  const description = document.getElementById("prd_description").value;
  const price = document.getElementById("prd_price").value;
  const thumbnail = document.getElementById("prd_thumbnail").value;
  const code = document.getElementById("prd_code").value;
  const stock = document.getElementById("prd_stock").value;
  const category = document.getElementById("prd_category").value;
  fetch(`/api/products`, {
    method: "POST",
    body: JSON.stringify({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      category,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => location.reload());
};

const loadProducts = (response) => {
  console.log(response);
  const pagesContainer = document.getElementById("product_pages");
  for (let page = 1; page <= response.totalPages; page++) {
    pagesContainer.innerHTML += `<a href="/products?page=${page}">${page}</a>`;
  }
  const container = document.getElementById("product_container");
  response.docs.forEach((prd) => {
    container.innerHTML += `
        <tr>
        <td>${prd.title}</td>
        <td>${prd.price}</td>
        <td>${prd.status}</td>
        <td>${prd.code}</td>
        <td>${prd.stock}</td>
        <td>${prd.category}</td>
        <td><button onClick="addProduct('${prd._id}')" >add to cart</button>
        <button onClick="deleteProduct('${prd._id}')">delete</button></td>
        </tr>
        `;
  });
};

const addProduct = (prdId) => {
  console.log(prdId);
  console.log(cartId);
  fetch(`/api/carts/${cartId}/product/${prdId}?amount=1`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => console.log(result));
};

const deleteProduct = (prdId) => {
  fetch(`/api/products/${prdId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => location.reload());
};

// form.addEventListener('submit',e=>{
//     e.preventDefault();
//     const data = new FormData(form);
//     console.log(data);
//     const obj = {};
//     data.forEach((value,key)=>obj[key]=value);
//     console.log("Objeto formado:");
//     console.log(obj);
//     fetch('/api/extend/users/register',{
//         method:'POST',
//         body:JSON.stringify(obj),
//         headers:{
//             'Content-Type':'application/json'
//         }
//     }).then(result=> {
//         if (result.status === 201) {
//             result.json();
//             alert("Usuario creado con exito!");
//             window.location.replace('/users/login');
//         }else {
//             alert("No se pudo crear el usuario!");
//         }
//     }).then(
//         json=>console.log(json));
// // })