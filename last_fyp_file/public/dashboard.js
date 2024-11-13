const baseUrl = "http://localhost:5005";

document.addEventListener("DOMContentLoaded", function () {
  fetchPendingOrdersCount();
  fetchOngoingOrdersCount();
  fetchCompletedOrdersCount();
  fetchCustomerPendingOrders();
  fetchCustomerOngoingOrders();
  fetchTechnicians();
  fetchLastLogin();

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    updateLastLogin();
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});

function fetchPendingOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/pending/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const pendingOrdersCount = data.count;
      console.log("Pending Orders Count:", pendingOrdersCount);
      countPendingOrders(pendingOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching pending orders count:", error);
    });
}

function fetchOngoingOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/ongoing/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const ongoingOrdersCount = data.count;
      console.log("Ongoing Orders Count:", ongoingOrdersCount);
      countOngoingOrders(ongoingOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching ongoing orders count:", error);
    });
}

function fetchCompletedOrdersCount() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders/completed/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "./login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const completedOrdersCount = data.count;
      console.log("Completed Orders Count:", completedOrdersCount);
      countCompletedOrders(completedOrdersCount); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching completed orders count:", error);
    });
}

function countPendingOrders(count) {
  const countElement = document.getElementById("pending-count");
  countElement.textContent = count;
}

function countOngoingOrders(count) {
  const countElement = document.getElementById("ongoing-count");
  countElement.textContent = count;
}

function countCompletedOrders(count) {
  const countElement = document.getElementById("completed-count");
  countElement.textContent = count;
}

// Display Pending Orders
function customerPendingOrders(orders) {
  const container = document.getElementById("customer-pending-orders");
  container.innerHTML = ""; // Clear existing content

  if (orders.length === 0) {
    container.innerHTML = "<tr><td colspan='4'>No pending orders found.</td></tr>";
    return;
  }

  orders.forEach((order) => {
    // Calculate days ago
    const orderDate = new Date(order.order_date); // Assuming order_date is in a format like 'YYYY-MM-DD'
    const today = new Date();
    const diffTime = Math.abs(today - orderDate);
    const daysAgo = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // Determine display text for days ago
    let daysAgoText;
    if (daysAgo === 0) {
      daysAgoText = "Today";
    } else if (daysAgo === 1) {
      daysAgoText = "1 day ago";
    } else {
      daysAgoText = `${daysAgo} days ago`;
    }

    container.innerHTML += `
      <tr>
        <td>#000${order.order_id}</td>
        <td>${order.problem_type}</td>
        <td class="${order.urgency_level.toLowerCase()}">
          ${order.urgency_level[0].toUpperCase() + order.urgency_level.substring(1)} ( ${daysAgoText})
        </td>
        <td><a href="requests.html"><button>View</button></a></td>
      </tr>
    `;
  });
}


// Display Ongoing Orders
function customerOngoingOrders(orders) {
  const container = document.getElementById("customer-ongoing-orders");
  console.log(orders);
  if (orders.length === 0) {
    container.innerHTML = "No ongoing orders found.";
    return;
  }
  orders.forEach((order) => {
    container.innerHTML += `
    <tr>
    <td>#000${order.order_id}</td>
    <td>${
      order.technician_specialization[0].toUpperCase() +
      order.technician_specialization.substring(1)
    }</td>
    <td class="${order.urgency_level.toLowerCase()}">${
      order.urgency_level[0].toUpperCase() + order.urgency_level.substring(1)
    }</td>
    <td><a href="view_requests.html?id=${
      order.order_id
    }"><button>View</button></td></a>
</tr>
        `;
  });
}

// Display Technician List
function fetchTechnicians() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }

  fetch(`${baseUrl}/dashboarddatabase/admin/technicians`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.status === 401) {
        window.location.href = "login.html";
      }
      const list = document.getElementById("technician_list");
      list.innerHTML = "";
      console.log(data.result);
      data.result.forEach((item) => {
        const row = `<tr>
                    <td>${item.technician_id}</td>
                    <td>${item.name}</td>
                    <td>${item.status}</td>
                    <td>${item.email}</td>
                    <td>${item.specialization}</td>
                    <td>${item.phone_number}</td>
                </tr>`;
        list.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error fetching pending orders:", error);
    });
}

function fetchCustomerPendingOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders?status=pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      return response.json();
    })
    .then((data) => {
      const orders = data.result;
      console.log("Pending Orders:", orders);
      customerPendingOrders(orders);
    })
    .catch((error) => {
      console.error("Error fetching pending orders:", error);
    });
}

function fetchCustomerOngoingOrders() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/orders?status=ongoing`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      return response.json();
    })
    .then((data) => {
      const orders = data.result;
      console.log("Ongoing Orders:", orders);
      customerOngoingOrders(orders);
    })
    .catch((error) => {
      console.error("Error fetching ongoing orders:", error);
    });
}

function updateLastLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/last-login`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      const lastLoginDateTime = result.result;
      console.log("Last login time:",lastLoginDateTime);

    })
    .catch((error) => {
      console.error("Error updating last login time:", error);
    });
}

function lastLoginDateTime(datetime) {
  const countElement = document.getElementById("last-datetime");
  countElement.textContent = datetime;
}

function fetchLastLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    window.location.href = "login.html";
  }
  fetch(`${baseUrl}/dashboarddatabase/fetch-last-login`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => {
      if (response.status === 401) {
        window.location.href = "login.html";
      }
      if (response.status === 404) {
        console.log("404 error");
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const datetime = new Date(data.lastLogin);
      const localDate = datetime.toLocaleString();
      lastLoginDateTime(localDate); // Call the function to update UI with count
    })
    .catch((error) => {
      console.error("Error fetching last login datetime:", error);
    });
}