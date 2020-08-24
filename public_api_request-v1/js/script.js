const gallery = document.getElementById("gallery");
const usersURL = "https://randomuser.me/api/?results=12&nat=us,au,gb,ca";

/**
 * Function to fetch data, check the status of response and parse data from response
 * @param {string} url - the url of the site data is requested from
 * @returns {promise} returns a promise containing the parsed data
 */
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

/**
 * Creates new modal window with the data from the selected profile card
 * @param {object} data - parsed data from fetch request
 * @param {object} employeeInfo - Information of the selected employee profile
 */
function createModal(data, employeeInfo) {
	gallery.insertAdjacentHTML(
		"afterend",
		`<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
							employeeInfo.picture.medium
						}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${employeeInfo.name.first} ${
			employeeInfo.name.last
		}</h3>
            <p class="modal-text">${employeeInfo.email}</p>
            <p class="modal-text cap">${employeeInfo.location.city}</p>
            <hr>
            <p class="modal-text">${formatPhoneNumber(employeeInfo.cell)}</p>
            <p class="modal-text">${employeeInfo.location.street.number} ${
			employeeInfo.location.street.name
		}, ${employeeInfo.location.city}, ${employeeInfo.location.state} ${
			employeeInfo.location.postcode
		}</p>
            <p class="modal-text">Birthday: ${formatBirthday(
							employeeInfo.dob.date
						)}</p>
        </div>
    </div>
    <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
</div>`
	);
	// Select close button and add listener
	const closeBtn = document.querySelector("button.modal-close-btn");
	const modalContainer = document.querySelector("div.modal-container");

	closeBtn.addEventListener("click", () => {
		modalContainer.remove();
	});

	// Select prev and next buttons and add functionality
	let index = data.indexOf(employeeInfo);
	const nextButton = document.getElementById("modal-next");
	const prevButton = document.getElementById("modal-prev");

	nextButton.addEventListener("click", () => {
		if (index + 1 < 12) {
			modalContainer.remove();
			createModal(data, data[index + 1]);
		}
	});
	prevButton.addEventListener("click", () => {
		if (index > 0) {
			modalContainer.remove();
			createModal(data, data[index - 1]);
		}
	});
}

/**
 * Generates employee profile cards with data parsed from fetch request
 * @param {object} data - parsed data from fetch request
 */
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
				createModal(data, data[i]);
			}
		});
	}
}

/**
 * Checks status of the response from fetch request
 * @param {response} response - the response from the fetch request
 * @returns {promise} returns either a resolved or rejected promise based on the fetch request
 */
function checkStatus(response) {
	if (response.ok) {
		return Promise.resolve(response);
	} else {
		gallery.innerHTML = "<h1>Oops, it looks like there was a problem!</h1>";
		gallery.style.color = "red";
		return Promise.reject(new Error(response.statusText));
	}
}

/**
 * Takes phone number from request and formats it correctly
 * @param {string} number - number stored in data from request
 * @returns {string} returns formatted number if correct data input else returns an empty string
 */
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

/**
 * Takes birthday from request and formats correctly
 * @param {string} birthday - birthday data from request
 * @returns {promise} returns a promise containing the parsed data
 */
function formatBirthday(birthday) {
	// Select birth date substring only
	let formattedBirthday = birthday.substr(0, 10);

	// Remove dashes from birthday
	formattedBirthday = formattedBirthday.replace(/[-]/g, "");
	// Return formatted birthday with slashes
	return formattedBirthday.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}

// THE BELOW CODE IS FOR THE EXCEEDS EXPECTATIONS REQUIREMENTS :)

/**
 * Inserts search bar html dynamically
 */
function insertSearch() {
	const searchContainer = document.querySelector("div.search-container");
	searchContainer.innerHTML = `<form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
</form>`;
}

/**
 * Compares user input in search bar to employee profile names and displays profiles with match
 * @param {HTMLElement} searchInput - the search bar input field
 */
// select search input field and search button
const searchInput = document.getElementById("search-input");
const searchButton = document.querySelector("#search-submit");
function searchName(searchInput) {
	// select displayed employee profiles
	const users = document.querySelectorAll("div.card");
	// if search bar input empty then display all results
	if (searchInput.value.length === 0) {
		for (let j = 0; j < users.length; j++) {
			users[j].style.display = "";
		}
	} else {
		// filter results based on user input
		for (let i = 0; i < users.length; i++) {
			users[i].style.display = "none";
			const name = users[
				i
			].lastElementChild.firstElementChild.textContent.toLowerCase();
			const input = searchInput.value.toLowerCase();
			if (input.length !== 0 && name.includes(input)) {
				users[i].style.display = "";
			}
		}
	}
}

// Event listener for search Button to search and display results, if any
searchButton.addEventListener("click", () => {
	searchName(searchInput);
});

// Event listener for keyup in input field to search and display results, if any
searchInput.addEventListener("keyup", () => {
	searchName(searchInput);
});

// Event listener for click in input field to search and display results, if any
searchInput.addEventListener("click", () => {
	searchName(searchInput);
});
