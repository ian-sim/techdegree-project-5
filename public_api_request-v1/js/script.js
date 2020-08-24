const gallery = document.getElementById("gallery");
const usersURL = "https://randomuser.me/api/?results=12&nat=us,au,gb,ca";

// Fetch function to request and parse data
function fetchData(url) {
	return fetch(url)
		.then(checkStatus)
		.then((response) => response.json())
		.catch((error) =>
			console.log("Oops, looks like there was a problem!", error)
		);
}
insertSearch();
// Request profile data and generate cards
fetchData(usersURL).then((data) => generateProfiles(data.results));

// Function to generate profiles with data from fetch request
function generateProfiles(data) {
	let profilesHTML = ``;

	for (let i = 0; i < data.length; i++) {
		profilesHTML += `<div class="card">
        <div class="card-img-container">
            <img class="card-img" src="${data[i].picture.medium}" alt="profile picture">
        </div>
        <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
            <p class="card-text">${data[i].email}</p>
            <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
        </div>
    </div>`;
	}
	gallery.innerHTML = profilesHTML;

	// Select all profile cards and add event listeners
	const profileCards = document.querySelectorAll("div.card");
	const modal = document.querySelectorAll("div.modal-container");

	for (let i = 0; i < profileCards.length; i++) {
		profileCards[i].addEventListener("click", () => {
			if (modal.length === 0) {
				gallery.insertAdjacentHTML(
					"afterend",
					`<div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${
													data[i].picture.medium
												}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${
													data[i].name.first
												} ${data[i].name.last}</h3>
                        <p class="modal-text">${data[i].email}</p>
                        <p class="modal-text cap">${data[i].location.city}</p>
                        <hr>
                        <p class="modal-text">${formatPhoneNumber(
													data[i].cell
												)}</p>
                        <p class="modal-text">${
													data[i].location.street.number
												} ${data[i].location.street.name}, ${
						data[i].location.city
					}, ${data[i].location.state} ${data[i].location.postcode}</p>
                        <p class="modal-text">Birthday: ${formatBirthday(
													data[i].dob.date
												)}</p>
                    </div>
                </div>`
				);
			}
			// Select close button and add listener
			const closeBtn = document.querySelector("button.modal-close-btn");
			const modalContainer = document.querySelector("div.modal-container");
			const parent = modalContainer.parentNode;

			closeBtn.addEventListener("click", () => {
				parent.removeChild(modalContainer);
			});
		});
	}
}

// Function to check response status
function checkStatus(response) {
	if (response.ok) {
		return Promise.resolve(response);
	} else {
		return Promise.reject(new Error(response.statusText));
	}
}

// Create function to format phone number data correctly
function formatPhoneNumber(number) {
	// Remove any non-digit characters
	number = number.replace(/[^\d]/g, "");

	// Check if number length equals to 10
	if (number.length === 10) {
		// Reformat and return phone number
		return number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
	}
	// Return empty string if phone number data is incorrect
	return "";
}

// Create function to format birthday data correctly
function formatBirthday(birthday) {
	// Select birth date substring only
	let formattedBirthday = birthday.substr(0, 10);

	// Remove dashes from birthday
	formattedBirthday = formattedBirthday.replace(/[-]/g, "");
	// Return formatted birthday with slashes
	return formattedBirthday.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}

// Create function to insert search bar
function insertSearch() {
	const searchContainer = document.querySelector("div.search-container");
	searchContainer.innerHTML = `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;
}
