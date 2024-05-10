window.onload = function () {
	var userLang = navigator.language || navigator.userLanguage;
	var rtlLanguages = ["ar", "he", "fa", "ur"];

	if (rtlLanguages.includes(userLang)) {
		document.querySelector("html").setAttribute("dir", "rtl");
	}

	if (
		rtlLanguages.some(function (l) {
			return userLang.startsWith(l);
		})
	) {
		var offcanvasMenu = document.getElementById("offcanvasExample");
		offcanvasMenu.classList.remove("offcanvas-start");
		offcanvasMenu.classList.add("offcanvas-end");
	}
};

document.addEventListener("DOMContentLoaded", function () {
	fetch("data/data.json")
		.then((response) => response.json())
		.then((data) => {
			const tableBody = document.getElementById("data-table").getElementsByTagName("tbody")[0];
			const countryFilter = document.getElementById("country-filter");
			const companyFilter = document.getElementById("company-filter");

			data.forEach((item) => {
				let row = tableBody.insertRow();
				let cell1 = row.insertCell(0);
				let cell2 = row.insertCell(1);
				let cell3 = row.insertCell(2);
				let cell4 = row.insertCell(3);
				cell1.textContent = item.country;
				cell2.textContent = item.company;
				cell3.textContent = item.co2_emitted;
				cell4.textContent = item.year;

				if (!countryFilter.querySelector(`option[value="${item.country}"]`)) {
					let option = document.createElement("option");
					option.value = item.country;
					option.textContent = item.country;
					countryFilter.appendChild(option);
				}
				if (!companyFilter.querySelector(`option[value="${item.company}"]`)) {
					let option = document.createElement("option");
					option.value = item.company;
					option.textContent = item.company;
					companyFilter.appendChild(option);
				}
			});
		})
		.catch((error) => console.error("Fehler beim Laden der Daten:", error));
});

function sortTable(columnIndex) {
	var table,
		rows,
		switching,
		i,
		x,
		y,
		shouldSwitch,
		dir,
		switchcount = 0;
	table = document.getElementById("data-table");
	switching = true;
	dir = "asc";
	updateSortArrow(columnIndex, dir);

	while (switching) {
		switching = false;
		rows = table.rows;
		for (i = 1; i < rows.length - 1; i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[columnIndex];
			y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
			if (dir === "asc") {
				if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			} else if (dir === "desc") {
				if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
					shouldSwitch = true;
					break;
				}
			}
		}
		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount++;
		} else {
			if (switchcount === 0 && dir === "asc") {
				dir = "desc";
				updateSortArrow(columnIndex, dir);
				switching = true;
			}
		}
	}

	function updateSortArrow(column, isAscending) {
		var arrows = table.getElementsByClassName("sort-arrow");
		for (var j = 0; j < arrows.length; j++) {
			arrows[j].classList.remove("asc", "desc");
		}
		if (isAscending === "asc") {
			arrows[column].classList.add("asc");
		} else {
			arrows[column].classList.add("desc");
		}
	}
}

function filterTable() {
	const countryFilter = document.getElementById("country-filter").value;
	const companyFilter = document.getElementById("company-filter").value;
	const rows = document.getElementById("data-table").getElementsByTagName("tr");

	let validCountries = new Set();
	let validCompanies = new Set();

	for (let i = 1; i < rows.length; i++) {
		const countryCell = rows[i].getElementsByTagName("td")[0].innerText.trim();
		const companyCell = rows[i].getElementsByTagName("td")[1].innerText.trim();
		const shouldDisplay = (countryFilter === "" || countryCell === countryFilter) && (companyFilter === "" || companyCell === companyFilter);

		rows[i].style.display = shouldDisplay ? "" : "none";

		if (countryFilter === "" || shouldDisplay) {
			validCompanies.add(companyCell);
		}
		if (companyFilter === "" || shouldDisplay) {
			validCountries.add(countryCell);
		}
	}
	updateFilterOptions();
}

function updateFilterOptions(filterElement, validOptions, currentSelection) {
	let preserveCurrentSelection = false;

	Array.from(filterElement.options).forEach((option) => {
		if (validOptions.has(option.value)) {
			option.style.display = "";
			if (option.value === currentSelection) {
				preserveCurrentSelection = true;
			}
		} else {
			option.style.display = "none";
		}
	});

	if (!preserveCurrentSelection && currentSelection !== "") {
		filterElement.value = "";
		filterTable();
	}
}

function resetFilters() {
	const countryFilter = document.getElementById("country-filter");
	const companyFilter = document.getElementById("company-filter");

	Array.from(countryFilter.options).forEach((option) => (option.style.display = ""));
	Array.from(companyFilter.options).forEach((option) => (option.style.display = ""));

	countryFilter.value = "";
	companyFilter.value = "";

	const rows = document.getElementById("data-table").getElementsByTagName("tr");
	for (let i = 1; i < rows.length; i++) {
		rows[i].style.display = "";
	}

	filterTable();
}

let globalData = [];

document.addEventListener("DOMContentLoaded", function () {
	fetch("data/data.json")
		.then((response) => response.json())
		.then((data) => {
			globalData = data;
		})
		.catch((error) => console.error("Fehler beim Laden der Daten:", error));
});

function collectValidOptions(data, currentCountry, currentCompany) {
	let validCountries = new Set();
	let validCompanies = new Set();

	data.forEach((item) => {
		if (currentCompany === "" || item.company === currentCompany) {
			validCountries.add(item.country);
		}
		if (currentCountry === "" || item.country === currentCountry) {
			validCompanies.add(item.company);
		}
	});

	return { validCountries, validCompanies };
}

function updateFilterOptions() {
	const currentCountry = document.getElementById("country-filter").value;
	const currentCompany = document.getElementById("company-filter").value;
	const { validCountries, validCompanies } = collectValidOptions(globalData, currentCountry, currentCompany);

	updateDropdown("country-filter", validCountries);
	updateDropdown("company-filter", validCompanies);
}

function updateDropdown(dropdownId, validOptions) {
	const dropdown = document.getElementById(dropdownId);
	Array.from(dropdown.options).forEach((option) => {
		option.style.display = validOptions.has(option.value) ? "" : "none";
	});
}
