const socket = io();

const form = document.getElementById("frm_product");

form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    price: parseInt(formData.get("price")),
    thumbnail: formData.get("thumbnail"),
    code: formData.get("code"),
    stock: parseInt(formData.get("stock")),
    category: formData.get("category"),
  };

  socket.emit("product_send", product);
  form.reset();
});

socket.on("products", (data) => {
  const table = document.querySelector(".tbl_productos");
  data.forEach((prod) => {
    const tr = document.createElement("tr");
    const title = document.createElement("td");
    const description = document.createElement("td");
    const price = document.createElement("td");
    const status = document.createElement("td");
    const thumbnail = document.createElement("td");
    const code = document.createElement("td");
    const stock = document.createElement("td");
    const category = document.createElement("td");
    const id = document.createElement("td");

    title.innerHTML = prod.title;
    description.innerHTML = prod.description;
    price.innerHTML = prod.price;
    status.innerHTML = prod.status;
    code.innerHTML = prod.code;
    stock.innerHTML = prod.stock;
    thumbnail.innerHTML = prod.thumbnail;
    category.innerHTML = prod.category;
    id.innerHTML = prod.id;

    tr.appendChild(title);
    tr.appendChild(description);
    tr.appendChild(price);
    tr.appendChild(status);
    tr.appendChild(thumbnail);
    tr.appendChild(code);
    tr.appendChild(stock);
    tr.appendChild(category);
    tr.appendChild(id);

    table.appendChild(tr);
  });
});
