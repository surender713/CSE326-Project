// Beginner-friendly JavaScript: array of ticket objects and nested history arrays.
const STORAGE_KEY = "labMaintenanceTickets";

const sampleTickets = [
  {
    id: "LAB-1001",
    equipment: "Microscope MS-04",
    location: "Biology Lab",
    issue: "Magnification lens is loose and the fine focus knob is slipping.",
    priority: "High",
    reporter: "Dr. Priya Raman",
    reporterEmail: "priya@college.edu",
    dateReported: "2026-11-18",
    supervision: "Yes",
    technician: "Alex Kumar",
    status: "In Progress",
    comments: [
      { author: "Alex Kumar", text: "Lens assembly inspected; replacement parts requested.", timestamp: "2026-11-19 09:30" }
    ],
    repairHistory: [
      { action: "Ticket opened", details: "Initial fault reported by Dr. Priya Raman.", timestamp: "2026-11-18 14:10" },
      { action: "Technician assigned", details: "Assigned to Alex Kumar.", timestamp: "2026-11-18 16:20" }
    ],
    closure: null
  },
  {
    id: "LAB-1002",
    equipment: "Autoclave AC-12",
    location: "Chemistry Lab",
    issue: "Pressure gauge is fluctuating and door seal appears damaged.",
    priority: "Critical",
    reporter: "M. Chen",
    reporterEmail: "",
    dateReported: "2026-11-20",
    supervision: "Yes",
    technician: "Rina Shah",
    status: "Open",
    comments: [],
    repairHistory: [
      { action: "Ticket opened", details: "Equipment isolated pending technician assessment.", timestamp: "2026-11-20 08:45" }
    ],
    closure: null
  },
  {
    id: "LAB-1003",
    equipment: "Desktop PC CL-27",
    location: "Computer Lab",
    issue: "Computer does not start and power indicator flashes amber.",
    priority: "Medium",
    reporter: "Sam Wilson",
    reporterEmail: "sam@college.edu",
    dateReported: "2026-11-15",
    supervision: "No",
    technician: "Jordan Lee",
    status: "Resolved",
    comments: [
      { author: "Jordan Lee", text: "Power supply replaced and stress test passed.", timestamp: "2026-11-21 11:15" }
    ],
    repairHistory: [
      { action: "Ticket opened", details: "Power fault reported.", timestamp: "2026-11-15 10:05" },
      { action: "Repair completed", details: "Power supply replaced.", timestamp: "2026-11-21 11:15" }
    ],
    closure: null
  },
  {
    id: "LAB-1004",
    equipment: "Fume Hood FH-03",
    location: "Chemistry Lab",
    issue: "Airflow alarm activates when sash is below the safe working height.",
    priority: "High",
    reporter: "Leah Jones",
    reporterEmail: "",
    dateReported: "2026-11-12",
    supervision: "Yes",
    technician: "Rina Shah",
    status: "Closed",
    comments: [
      { author: "Rina Shah", text: "Sensor cleaned and airflow recalibrated.", timestamp: "2026-11-14 13:40" }
    ],
    repairHistory: [
      { action: "Ticket opened", details: "Fume hood airflow warning reported.", timestamp: "2026-11-12 09:00" },
      { action: "Repair completed", details: "Sensor cleaned and calibration completed.", timestamp: "2026-11-14 13:40" },
      { action: "Ticket closed", details: "Closed by supervisor A. Martin.", timestamp: "2026-11-14 15:20" }
    ],
    closure: { supervisor: "A. Martin", confirmed: true, timestamp: "2026-11-14 15:20" }
  },
  {
    id: "LAB-1005",
    equipment: "Laser Bench LB-02",
    location: "Physics Lab",
    issue: "Alignment warning light remains on after startup.",
    priority: "Medium",
    reporter: "Dr. K. Verma",
    reporterEmail: "verma@college.edu",
    dateReported: "2026-11-22",
    supervision: "Yes",
    technician: "Unassigned",
    status: "Open",
    comments: [],
    repairHistory: [
      { action: "Ticket opened", details: "Alignment warning reported and laser isolated.", timestamp: "2026-11-22 12:25" }
    ],
    closure: null
  }
];

let tickets = loadTickets();
let selectedTicketId = null;

// Restore saved tickets; use a fresh copy of the samples when no valid save exists.
function loadTickets() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  // Clone the fixtures so edits to live tickets never change the sample data.
  return sampleTickets.map(function (ticket) {
    return JSON.parse(JSON.stringify(ticket));
  });
}

// Keep the current ticket list in the browser so it survives a page reload.
function saveTickets() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

// Show a temporary message in the page's accessible status area.
function showStatus(message) {
  const status = document.getElementById("status-message");
  status.textContent = message;
  status.classList.add("visible");
  window.setTimeout(function () {
    status.classList.remove("visible");
  }, 2600);
}

// Convert a date value into a short, readable date for ticket details.
function formatDate(dateString) {
  if (!dateString) return "Not set";
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Create the timestamp format used in ticket history and comments.
function formatTimestamp(date) {
  const now = date || new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
}

// Find the largest existing ticket number and return the next one.
function getNextTicketId() {
  const numbers = tickets.map(function (ticket) {
    return Number(ticket.id.replace("LAB-", ""));
  });
  const highest = numbers.reduce(function (current, next) {
    return next > current ? next : current;
  }, 1000);
  return "LAB-" + (highest + 1);
}

// Validate the report form, create a ticket, then refresh the page sections.
function createTicket(event) {
  event.preventEvent ? event.preventEvent() : event.preventDefault();
  const form = event.target;

  if (!form.checkValidity()) {
    form.reportValidity();
    showStatus("Please complete all required fields.");
    return;
  }

  // FormData reads each control by its HTML name attribute.
  const data = new FormData(form);
  const ticket = {
    id: getNextTicketId(),
    equipment: String(data.get("equipment")).trim(),
    location: String(data.get("location")).trim(),
    issue: String(data.get("issue")).trim(),
    priority: String(data.get("priority")).trim(),
    reporter: String(data.get("reporter")).trim(),
    reporterEmail: String(data.get("reporterEmail")).trim(),
    dateReported: String(data.get("dateReported")).trim(),
    supervision: String(data.get("supervision")).trim(),
    technician: "Unassigned",
    status: "Open",
    comments: [],
    repairHistory: [
      { action: "Ticket opened", details: "Reported by " + String(data.get("reporter")).trim() + ".", timestamp: formatTimestamp() }
    ],
    closure: null
  };

  tickets.push(ticket);
  saveTickets();
  form.reset();
  document.getElementById("date-reported").value = new Date().toISOString().slice(0, 10);
  selectedTicketId = ticket.id;
  renderTickets();
  renderTicketDetail();
  generateReport();
  showStatus(ticket.id + " submitted successfully.");
}

// Apply the search text and all selected filters to the ticket list.
function getFilteredTickets() {
  const searchText = document.getElementById("search").value.trim().toLowerCase();
  const statusFilter = document.getElementById("status-filter").value;
  const priorityFilter = document.getElementById("priority-filter").value;
  const locationFilter = document.getElementById("location-filter").value;

  // Returning true for every match makes the active filters combine with AND.
  return tickets.filter(function (ticket) {
    const searchable = (ticket.id + " " + ticket.equipment + " " + ticket.issue + " " + ticket.reporter).toLowerCase();
    const matchesSearch = searchText === "" || searchable.includes(searchText);
    const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter;
    const matchesLocation = locationFilter === "All" || ticket.location === locationFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesLocation;
  });
}

// Build the visible table rows from the currently filtered tickets.
function renderTickets() {
  const tableBody = document.getElementById("ticket-table-body");
  const filtered = getFilteredTickets();

  tableBody.innerHTML = filtered.map(function (ticket) {
    return `
      <tr>
        <td><span class="ticket-id">${ticket.id}</span></td>
        <td class="equipment-name">${ticket.equipment}</td>
        <td>${ticket.location}</td>
        <td><span class="badge" data-priority="${ticket.priority}">${ticket.priority}</span></td>
        <td>${ticket.technician}</td>
        <td><span class="badge" data-status="${ticket.status}">${ticket.status}</span></td>
        <td>
          <div class="action-stack">
            <button class="button ghost small" type="button" data-action="select" data-id="${ticket.id}" aria-label="View ${ticket.id}">View</button>
          </div>
        </td>
      </tr>`;
  }).join("");

  document.getElementById("table-result-count").textContent =
    filtered.length + " of " + tickets.length + " tickets displayed";
}

// Assign a technician and record the assignment in the repair history.
function assignTechnician(ticketId, technicianName) {
  const ticket = tickets.find(function (item) {
    return item.id === ticketId;
  });
  if (!ticket) return;

  const cleanName = technicianName.trim();
  if (cleanName === "") {
    showStatus("Enter a technician name.");
    return;
  }

  ticket.technician = cleanName;
  if (ticket.status === "Open") ticket.status = "In Progress";
  ticket.repairHistory.push({
    action: "Technician assigned",
    details: "Assigned to " + cleanName + ".",
    timestamp: formatTimestamp()
  });
  saveTickets();
  renderTickets();
  renderTicketDetail();
  generateReport();
  showStatus("Technician assigned to " + ticketId + ".");
}

// Change a ticket's status; closing requires the separate verification flow.
function updateStatus(ticketId, newStatus) {
  const ticket = tickets.find(function (item) {
    return item.id === ticketId;
  });
  if (!ticket) return;

  switch (newStatus) {
    case "Open":
    case "In Progress":
    case "Resolved":
      if (newStatus === "Closed") break;
      ticket.status = newStatus;
      ticket.repairHistory.push({
        action: "Status updated",
        details: "Status changed to " + newStatus + ".",
        timestamp: formatTimestamp()
      });
      break;
    case "Closed":
      showStatus("Use closure verification to close this ticket.");
      return;
  }

  saveTickets();
  renderTickets();
  renderTicketDetail();
  generateReport();
  showStatus(ticket.id + " status updated to " + newStatus + ".");
}

// Add a comment to the ticket and preserve it in the repair history.
function addComment(ticketId, text) {
  const ticket = tickets.find(function (item) {
    return item.id === ticketId;
  });
  if (!ticket) return;

  const cleanText = text.trim();
  if (cleanText === "") {
    showStatus("Comment cannot be empty.");
    return;
  }

  ticket.comments.push({
    author: ticket.technician === "Unassigned" ? "User" : ticket.technician,
    text: cleanText,
    timestamp: formatTimestamp()
  });
  ticket.repairHistory.push({
    action: "Comment added",
    details: cleanText,
    timestamp: formatTimestamp()
  });
  saveTickets();
  renderTicketDetail();
  showStatus("Comment added to " + ticketId + ".");
}

// Close a resolved ticket only after supervisor details and confirmation are provided.
function verifyAndCloseTicket(ticketId, supervisorName, confirmed) {
  const ticket = tickets.find(function (item) {
    return item.id === ticketId;
  });
  if (!ticket) return;

  const cleanSupervisor = supervisorName.trim();
  if (ticket.status !== "Resolved") {
    showStatus("Only a Resolved ticket can be closed.");
    return;
  }
  if (cleanSupervisor === "" || !confirmed) {
    showStatus("Supervisor name and confirmation are required.");
    return;
  }

  ticket.status = "Closed";
  ticket.closure = {
    supervisor: cleanSupervisor,
    confirmed: true,
    timestamp: formatTimestamp()
  };
  ticket.repairHistory.push({
    action: "Ticket closed",
    details: "Verified and closed by supervisor " + cleanSupervisor + ".",
    timestamp: formatTimestamp()
  });
  saveTickets();
  renderTickets();
  renderTicketDetail();
  generateReport();
  showStatus(ticketId + " has been closed and verified.");
}

// Render the selected ticket's details, history, comments, and available controls.
function renderTicketDetail() {
  const container = document.getElementById("ticket-detail-content");
  const ticket = tickets.find(function (item) {
    return item.id === selectedTicketId;
  });

  if (!ticket) {
    container.innerHTML = "<p>Select a ticket to view assignment, history, comments, and closure controls.</p>";
    return;
  }

  const historyItems = ticket.repairHistory.map(function (entry) {
    return "<li><strong>" + entry.action + "</strong><br>" + entry.timestamp + " - " + entry.details + "</li>";
  }).join("");
  const commentItems = ticket.comments.length
    ? ticket.comments.map(function (entry) {
        return "<li><strong>" + entry.author + "</strong> (" + entry.timestamp + ")<br>" + entry.text + "</li>";
      }).join("")
    : "<li>No comments yet.</li>";

  // Replace the previous details markup with the selected ticket's current data.
  container.innerHTML = `
    <h3>${ticket.id} - ${ticket.equipment}</h3>
    <p>${ticket.issue}</p>
    <div class="detail-meta">
      <span><strong>REPORTED</strong>${formatDate(ticket.dateReported)} by ${ticket.reporter}</span>
      <span><strong>LOCATION</strong>${ticket.location}</span>
      <span><strong>PRIORITY</strong>${ticket.priority}</span>
      <span><strong>STATUS</strong>${ticket.status}</span>
    </div>
    <div class="detail-controls">
      <label for="technician-name">Assigned technician</label>
      <input id="technician-name" type="text" value="${ticket.technician === "Unassigned" ? "" : ticket.technician}" placeholder="Technician name">
      <button class="button primary" type="button" data-action="assign" data-id="${ticket.id}">Assign Technician</button>
      <label for="status-update">Update status</label>
      <select id="status-update" data-id="${ticket.id}">
        <option ${ticket.status === "Open" ? "selected" : ""}>Open</option>
        <option ${ticket.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${ticket.status === "Resolved" ? "selected" : ""}>Resolved</option>
        <option ${ticket.status === "Closed" ? "selected" : ""}>Closed</option>
      </select>
    </div>
    <h3>Repair History</h3>
    <ol class="history-list">${historyItems}</ol>
    <h3>Comments</h3>
    <ul class="comment-list">${commentItems}</ul>
    <form id="comment-form" class="comment-form">
      <label for="comment-text">Add technician/user comment</label>
      <textarea id="comment-text" minlength="2" maxlength="300" required placeholder="Type a repair update"></textarea>
      <button class="button ghost" type="submit">Add Comment</button>
    </form>
    ${ticket.status === "Resolved" ? `
      <form id="closure-form" class="closure-box">
        <strong>Closure Verification</strong>
        <label for="supervisor-name">Supervisor name</label>
        <input id="supervisor-name" type="text" minlength="2" maxlength="50" required>
        <label><input id="closure-confirmed" type="checkbox" required> I confirm the repair was verified.</label>
        <button class="button danger" type="submit">Verify and Close Ticket</button>
      </form>` : ""}
  `;

  const commentForm = document.getElementById("comment-form");
  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addComment(ticket.id, document.getElementById("comment-text").value);
  });

  const closureForm = document.getElementById("closure-form");
  if (closureForm) {
    closureForm.addEventListener("submit", function (event) {
      event.preventDefault();
      verifyAndCloseTicket(
        ticket.id,
        document.getElementById("supervisor-name").value,
        document.getElementById("closure-confirmed").checked
      );
    });
  }
}

// Recalculate the summary cards and per-location report from all tickets.
function generateReport() {
  const total = tickets.length;
  const openCount = tickets.filter(function (ticket) {
    return ticket.status === "Open";
  }).length;
  const closedCount = tickets.filter(function (ticket) {
    return ticket.status === "Closed";
  }).length;
  const criticalCount = tickets.filter(function (ticket) {
    return ticket.priority === "Critical";
  }).length;

  document.getElementById("report-cards").innerHTML = `
    <article class="metric-card"><strong>${total}</strong><span>Total Tickets</span></article>
    <article class="metric-card"><strong>${openCount}</strong><span>Open Tickets</span></article>
    <article class="metric-card"><strong>${closedCount}</strong><span>Closed Tickets</span></article>
    <article class="metric-card"><strong>${criticalCount}</strong><span>Critical Issues</span></article>`;

  const locations = ["Chemistry Lab", "Physics Lab", "Computer Lab", "Biology Lab", "Facilities"];
  const locationRows = locations.map(function (location) {
    const count = tickets.filter(function (ticket) {
      return ticket.location === location;
    }).length;
    const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
    // Pass the share to CSS as a custom property for the breakdown bar width.
    return `
      <div class="breakdown-row">
        <span>${location}</span><strong>${count}</strong>
        <div class="breakdown-bar" style="--bar-width:${percentage}%"></div>
      </div>`;
  }).join("");

  document.getElementById("location-breakdown").innerHTML =
    "<h3>Tickets by Lab Location</h3>" + locationRows;
}

// Connect form and button actions to their handlers; delegation also handles
// buttons that are recreated whenever ticket details or table rows are rendered.
document.getElementById("ticket-form").addEventListener("submit", createTicket);

["search", "status-filter", "priority-filter", "location-filter"].forEach(function (id) {
  document.getElementById(id).addEventListener("input", renderTickets);
});

document.getElementById("ticket-table-body").addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  selectedTicketId = button.dataset.id;
  renderTicketDetail();
  document.getElementById("ticket-detail").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("ticket-detail-content").addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "assign") {
    assignTechnician(button.dataset.id, document.getElementById("technician-name").value);
  }
});

document.getElementById("ticket-detail-content").addEventListener("change", function (event) {
  if (event.target.id === "status-update") {
    updateStatus(event.target.dataset.id, event.target.value);
  }
});

// Set today's date and render the initial ticket list, details, and report.
document.getElementById("date-reported").value = new Date().toISOString().slice(0, 10);
renderTickets();
renderTicketDetail();
generateReport();
