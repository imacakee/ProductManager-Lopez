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
