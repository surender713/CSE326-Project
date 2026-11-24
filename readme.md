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

Use **Reset sample data** to restore the five example tickets. Use **Print Summary** in the Reports & Analytics panel to print the current report.

## Project files

- `index.html` — page structure, forms, ticket table, details panel, and reports.
- `styles.css` — responsive layout, visual styling, accessibility states, and print styles.
- `script.js` — ticket management, validation, filtering, local storage, reporting, and UI interactions.

## Browser support

Use a current version of Chrome, Edge, Firefox, or Safari with JavaScript enabled.
