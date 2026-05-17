let users = JSON.parse(localStorage.getItem("users")) || [];
let issues = JSON.parse(localStorage.getItem("issues")) || [];

/* =========================
   REGISTER
========================= */
function register() {

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  let existing = users.find(u => u.email === email);

  if (existing) {
    alert("User already exists");
    return;
  }

  users.push({ name, email, password });

  localStorage.setItem("users", JSON.stringify(users));

  alert("Registration successful");

  window.location.href = "login.html";
}

/* =========================
   LOGIN
========================= */
function login() {

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  /* ADMIN LOGIN */
  if (email === "admin@civic.com" && password === "admin123") {
    window.location.href = "admin.html";
    return;
  }

  let user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid login");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));

  window.location.href = "user.html";
}

/* =========================
   ADD ISSUE
========================= */
function addIssue() {

  let title = document.getElementById("title").value.trim();
  let desc = document.getElementById("desc").value.trim();
  let category = document.getElementById("category").value;
  let priority = document.getElementById("priority").value;
  let address = document.getElementById("address").value.trim();
  let landmark = document.getElementById("landmark").value.trim();
  let pincode = document.getElementById("pincode").value.trim();

  if (
    !title ||
    !desc ||
    !category ||
    !priority ||
    !address ||
    !landmark ||
    !pincode
  ) {
    alert("Please fill all fields");
    return;
  }

  let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

  issues.push({
    user: currentUser.email,
    title,
    desc,
    category,
    priority,
    address,
    landmark,
    pincode,
    status: "Submitted",
    remarks: "Pending",
    time: new Date().toLocaleString()
  });

  localStorage.setItem("issues", JSON.stringify(issues));

  alert("Issue submitted successfully");

  document.getElementById("title").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("category").value = "";
  document.getElementById("priority").value = "";
  document.getElementById("address").value = "";
  document.getElementById("landmark").value = "";
  document.getElementById("pincode").value = "";

  loadUser();
}

/* =========================
   USER DASHBOARD
========================= */
function loadUser() {

  let div = document.getElementById("list");

  if (!div) return;

  let currentUser =
    JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) return;

  div.innerHTML = "";

  let userIssues = issues.filter(
    i => i.user === currentUser.email
  );

  if (userIssues.length === 0) {
    div.innerHTML = "<p style='text-align:center;'>No issues submitted yet</p>";
    return;
  }

  userIssues.forEach(i => {

    div.innerHTML += `
      <div class="card">

        <h3>${i.title}</h3>

        <p><b>Description:</b> ${i.desc}</p>

        <p><b>Category:</b> ${i.category}</p>

        <p><b>Priority:</b> ${i.priority}</p>

        <p><b>Address:</b> ${i.address}</p>

        <p><b>Landmark:</b> ${i.landmark}</p>

        <p><b>Pincode:</b> ${i.pincode}</p>

        <p><b>Status:</b> ${i.status}</p>

        <p><b>Admin Remarks:</b> ${i.remarks}</p>

        <small>${i.time}</small>

      </div>
    `;
  });
}

/* =========================
   ADMIN DASHBOARD
========================= */
function loadAdmin() {

  let table = document.getElementById("adminTable");

  if (!table) return;

  table.innerHTML = "";

  issues.forEach((i, index) => {

    table.innerHTML += `
      <tr>

        <td>${i.user}</td>

        <td>${i.title}</td>

        <td>${i.category}</td>

        <td>${i.priority}</td>

        <td>${i.address}</td>

        <td>${i.status}</td>

        <td>
          <input
            value="${i.remarks}"
            onchange="saveRemark(${index}, this.value)"
          >
        </td>

        <td>
          <button onclick="next(${index})">
            Next Step
          </button>
        </td>

      </tr>
    `;
  });
}

/* =========================
   SAVE REMARK
========================= */
function saveRemark(index, value) {

  issues[index].remarks = value;

  localStorage.setItem("issues", JSON.stringify(issues));
}

/* =========================
   STATUS WORKFLOW
========================= */
function next(i) {

  if (issues[i].status === "Submitted") {
    issues[i].status = "Under Review";
  }

  else if (issues[i].status === "Under Review") {
    issues[i].status = "Department Assigned";
  }

  else if (issues[i].status === "Department Assigned") {
    issues[i].status = "Work Started";
  }

  else if (issues[i].status === "Work Started") {
    issues[i].status = "Resolved";
  }

  localStorage.setItem("issues", JSON.stringify(issues));

  loadAdmin();
}

/* =========================
   AUTO LOAD
========================= */
window.onload = function () {

  loadUser();

  loadAdmin();
};