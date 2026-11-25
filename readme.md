# Laboratory Maintenance Reporting System

A browser-based laboratory equipment maintenance dashboard. Users can report equipment issues, track maintenance tickets, assign technicians, record repair updates, and review basic maintenance analytics.

## Features

- Submit maintenance tickets with equipment, location, priority, reporter, date, and issue details.
- Search and filter tickets by text, status, priority, and lab location.
- View ticket details, repair history, and comments.
- Assign technicians and update ticket statuses.
- Verify resolved tickets before closing them.
- View ticket totals, open and closed counts, critical issues, and location breakdowns.
- Print the analytics summary.

## Run locally

No build tools or dependencies are required.

1. Download or clone this project.
2. Open `index.html` in a modern web browser.
3. Use the dashboard to create and manage maintenance tickets.

For the most consistent browser behavior, serve the folder with any local static web server and open the provided local URL.

## Data storage

Ticket data is stored in the browser's `localStorage` under the key `labMaintenanceTickets`. Data is local to the browser and device; it is not synchronized to a server or shared with other users.

## How the app works

When the page opens, `script.js` loads saved tickets or copies the sample tickets, fills in today's date, and renders the ticket table, details area, and report. Creating or updating a ticket saves the updated list to `localStorage` and refreshes the relevant page sections.

Each ticket includes its equipment, lab, issue, priority, reporter, date, supervision requirement, assigned technician, and status. It also keeps a `comments` list, a `repairHistory` list of dated actions, and a `closure` record when a supervisor verifies closure.

The normal ticket workflow is **Open → In Progress → Resolved → Closed**. A ticket can only be closed after it is resolved and a supervisor name and confirmation are provided.

## Code guide

In `script.js`, the main functions are grouped by their job:

- **Persistence and helpers:** `loadTickets`, `saveTickets`, `formatDate`, `formatTimestamp`, and `getNextTicketId`.
- **Ticket actions:** `createTicket`, `assignTechnician`, `updateStatus`, `addComment`, and `verifyAndCloseTicket`.
- **Display and reporting:** `getFilteredTickets`, `renderTickets`, `renderTicketDetail`, and `generateReport`.
- **Feedback:** `showStatus` displays temporary messages when an action succeeds or needs attention.

The HTML supplies stable element IDs for JavaScript to update. Event listeners are attached to the forms and page containers; click events on the ticket table and detail panel use event delegation so they continue to work when their contents are re-rendered.

## Layout and accessibility

The page uses semantic landmarks such as `header`, `nav`, `main`, `section`, `aside`, and `footer` to describe its structure. Form labels are associated with their inputs, and required fields use native browser validation. The status message uses `role="status"` and `aria-live="polite"` so assistive technologies can announce updates.

The CSS starts with a two-column desktop layout. At 980px, the main content stacks while the supplementary panels stay side by side; at 720px, forms, filters, and supplementary panels stack; at 480px, navigation and report cards become more compact. The ticket table can scroll horizontally on narrow screens. Print styles hide interactive sections and leave the analytics summary available to print.

## Project files

- `index.html` — page structure, forms, ticket table, details panel, and reports.
- `styles.css` — responsive layout, visual styling, accessibility states, and print styles.
- `script.js` — ticket management, validation, filtering, local storage, reporting, and UI interactions.

## Browser support

Use a current version of Chrome, Edge, Firefox, or Safari with JavaScript enabled.
