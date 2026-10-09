
const bookingSection = document.getElementById("booking-section");
const bookingForm = document.getElementById("booking-form");
const serviceSelect = document.getElementById("service");
const bookingDate = document.getElementById("booking-date");
const bookingMessage = document.getElementById("booking-message");
const cancelButton = document.getElementById("cancel-booking");

// Prevent users from selecting a past date.
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

bookingDate.min = localToday;

// Open the booking form when a service button is clicked.
const bookButtons = document.querySelectorAll(".service-card button");

bookButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".service-card");
        const serviceName = card.querySelector("h3").textContent;

        serviceSelect.value = serviceName;

        bookingMessage.hidden = true;
        bookingMessage.textContent = "";
        bookingForm.reset();

        // Reset clears the form, so select the chosen service again.
        serviceSelect.value = serviceName;

        bookingSection.hidden = false;
        bookingSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        document.getElementById("customer-name").focus();
    });
});

// Cancel the booking.
cancelButton.addEventListener("click", function () {
    bookingForm.reset();
    bookingSection.hidden = true;
    bookingMessage.hidden = true;
});

// Validate and process the booking form.

const STORAGE_KEY = "localServeBookings";

function getBookings() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const bookings = saved ? JSON.parse(saved) : [];

        return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
        console.error("Could not read bookings:", error);
        return [];
    }
}

function renderBookings() {
    const bookings = getBookings();
    const history = document.getElementById("booking-history");
    const emptyMessage = document.getElementById("empty-history");

    history.replaceChildren();
    emptyMessage.hidden = bookings.length > 0;

    bookings.forEach(function (booking) {
        const row = document.createElement("tr");

        [booking.service, booking.name, booking.date].forEach(
            function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            }
        );

        const statusCell = document.createElement("td");
        const status = document.createElement("span");

        status.className = "status-label";
        status.textContent = "Demo request";

      
statusCell.appendChild(status);
row.appendChild(statusCell);

// Create the Actions column.
const actionCell = document.createElement("td");
const cancelRequest = document.createElement("button");

cancelRequest.textContent = "Cancel request";
cancelRequest.type = "button";

cancelRequest.addEventListener("click", function () {
    const confirmed = confirm(
        "Remove this demo booking request?"
    );

    if (!confirmed) {
        return;
    }

    const updatedBookings = getBookings().filter(
        function (item) {
            return item.id !== booking.id;
        }
    );

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updatedBookings)
        );

        renderBookings();
    } catch (error) {
        alert("Unable to update the booking history.");
    }
});

actionCell.appendChild(cancelRequest);
row.appendChild(actionCell);

// Add the completed row to the table.
history.appendChild(row);

    });
}

// Handle booking form submission.
bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!bookingForm.reportValidity()) {
        return;
    }

    const booking = {
        id: Date.now().toString(),
        name: document.getElementById("customer-name").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        service: serviceSelect.value,
        date: bookingDate.value
    };

    const bookings = getBookings();
    bookings.push(booking);

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch (error) {
        bookingMessage.textContent =
            "Could not save this booking in your browser. Please try again.";
        bookingMessage.hidden = false;
        return;
    }

    bookingMessage.textContent =
        "Demo request saved for " + booking.name +
        " — " + booking.service + " on " + booking.date +
        ". No real booking has been sent.";

    bookingMessage.hidden = false;
    bookingForm.reset();
    serviceSelect.value = booking.service;

    renderBookings();

    bookingMessage.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});

// Display saved bookings when the page loads.
renderBookings();

