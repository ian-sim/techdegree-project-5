const gallery = document.getElementById("gallery");
const usersURL = "https://randomuser.me/api/?results=12";

// Fetch function to request and parse data
function fetchData(url) {
	return fetch(url)
		.then(checkStatus)
		.then((response) => response.json())
		.catch((error) =>
			console.log("Oops, looks like there was a problem!", error)
		);
}

// Request profile data and generate cards
fetchData(usersURL).then((data) => generateProfiles(data.results));

// Function to generate profiles with data from fetch request
function generateProfiles(data) {
	let profilesHTML = ``;
	console.log(data);
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
				gallery.innerHTML += `<div class="modal-container">
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
                    <p class="modal-text">${formatPhoneNumber(data[i].cell)}</p>
                    <p class="modal-text">${data[i].location.street.number} ${
					data[i].location.street.name
				}, ${data[i].location.city}, ${data[i].location.state} ${
					data[i].location.postcode
				}</p>
                    <p class="modal-text">Birthday: ${formatBirthday(
											data[i].dob.date
										)}</p>
                </div>
            </div>`;

				// Select close button and add listener
				const closeBtn = document.querySelector("#modal-close-btn");
				const modalContainer = document.querySelector("div.modal-container");

				closeBtn.addEventListener("click", () => {
					gallery.removeChild(modalContainer);
				});
			}
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

function formatPhoneNumber(number) {
	//remove any non-digit characters
	number = number.replace(/[^\d]/g, "");

	//check if number length equals to 10
	if (number.length === 10) {
		//reformat and return phone number
		return number.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
	}

	return "";
}

function formatBirthday(birthday) {
	// Select birth date substring only
	let formattedBirthday = birthday.substr(0, 10);

	// Remove dashes from birthday
	formattedBirthday = formattedBirthday.replace(/[-]/g, "");
	// Return formatted birthday with slashes
	return formattedBirthday.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}
