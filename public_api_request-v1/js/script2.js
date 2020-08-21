const gallery = document.getElementById("gallery");
const usersUrl = "https://randomuser.me/api/?results=12";
let modalOpen = false;

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
fetchData(usersUrl).then((data) => generateProfiles(data.results));

// Select cards and add listener
gallery.addEventListener("click", (e) => {
	if (!modalOpen) {
		gallery.innerHTML += `<div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src="${
							data[i].picture.medium
						}" alt="profile picture">
            <h3 id="name" class="modal-name cap">${data[i].name.first} ${
			data[i].name.last
		}</h3>
            <p class="modal-text">${data[i].email}</p>
            <p class="modal-text cap">${data[i].location.city}</p>
            <hr>
            <p class="modal-text">${formatPhoneNumber(data[i].phone)}</p>
            <p class="modal-text">${data[i].location.street.number} ${
			data[i].location.street.name
		}, ${data[i].location.city}, ${data[i].location.state} ${
			data[i].location.postcode
		}</p>
            <p class="modal-text">Birthday: 10/21/2015</p>
        </div>
    </div>`;
	}
});

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

	return null;
}

function formatBirthday(birthday) {
	//remove dashes from birthday
	birthday = birthday.replace(/[-]/g, "");
	//return formatted birthday with slashes
	return birthday.replace(/(\d{4})(\d{2})(\d{2})/, "$2/$3/$1");
}
console.log(formatBirthday("1954-02-27"));
