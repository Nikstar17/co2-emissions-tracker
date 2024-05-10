document.addEventListener("DOMContentLoaded", function () {
	var countryFilter = document.getElementById("country-filter");
	var companyFilter = document.getElementById("company-filter");
	var resetButton = document.getElementById("reset-button");
	var sortableColumns = document.querySelectorAll(".sortable");

	// Event-Listener für Filter- und Reset-Button
	countryFilter.addEventListener("change", filterTable);
	companyFilter.addEventListener("change", filterTable);
	resetButton.addEventListener("click", resetFilters);

	// Hinzufügen von Event-Listenern zu sortierbaren Spalten
	sortableColumns.forEach(function (column) {
		column.addEventListener("click", function () {
			sortTable(column.getAttribute("data-column"));
		});
	});

	// Daten aus JSON-Datei laden
	fetch("data/data.json")
		.then((response) => response.json())
		.then((data) => {
			globalData = data;
			const tableBody = document.getElementById("data-table").getElementsByTagName("tbody")[0];

			// Füllen der Tabelle mit Daten
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

				// Hinzufügen von einzigartigen Filteroptionen
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

// Sortiert die Tabelle nach einem bestimmten Spaltenindex
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

	// Tabellen-Referenz und Sortierrichtung
	table = document.getElementById("data-table");
	switching = true;
	dir = "asc";
	updateSortArrow(columnIndex, dir);

	// Durchläuft die Zeilen und sortiert die Tabelle
	while (switching) {
		switching = false;
		rows = table.rows;

		for (i = 1; i < rows.length - 1; i++) {
			shouldSwitch = false;
			x = rows[i].getElementsByTagName("TD")[columnIndex];
			y = rows[i + 1].getElementsByTagName("TD")[columnIndex];

			// Vergleich von Werten, um die Sortierreihenfolge festzustellen
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

		// Austausch der Reihenfolge der Zeilen, wenn nötig
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

	// Aktualisiert den Sortierpfeil basierend auf der Sortierrichtung
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

// Filtert die Tabelle basierend auf den ausgewählten Filteroptionen
function filterTable() {
	const countryFilter = document.getElementById("country-filter").value;
	const companyFilter = document.getElementById("company-filter").value;
	const rows = document.getElementById("data-table").getElementsByTagName("tr");

	let validCountries = new Set();
	let validCompanies = new Set();

	// Überprüft jede Zeile, ob sie den ausgewählten Filtern entspricht
	for (let i = 1; i < rows.length; i++) {
		const countryCell = rows[i].getElementsByTagName("td")[0].innerText.trim();
		const companyCell = rows[i].getElementsByTagName("td")[1].innerText.trim();
		const shouldDisplay = (countryFilter === "" || countryCell === countryFilter) && (companyFilter === "" || companyCell === companyFilter);

		// Zeigt oder versteckt die Zeilen basierend auf den Filterbedingungen
		rows[i].style.display = shouldDisplay ? "" : "none";

		// Füllt die Sets der gültigen Optionen basierend auf den gefilterten Ergebnissen
		if (countryFilter === "" || shouldDisplay) {
			validCompanies.add(companyCell);
		}
		if (companyFilter === "" || shouldDisplay) {
			validCountries.add(countryCell);
		}
	}
	updateFilterOptions();
}

// Aktualisiert die Dropdown-Optionen basierend auf den gültigen Auswahlmöglichkeiten
function updateFilterOptions() {
	const currentCountry = document.getElementById("country-filter").value;
	const currentCompany = document.getElementById("company-filter").value;
	const { validCountries, validCompanies } = collectValidOptions(globalData, currentCountry, currentCompany);

	updateDropdown("country-filter", validCountries);
	updateDropdown("company-filter", validCompanies);
}

// Aktualisiert die Dropdown-Elemente mit den neuen gültigen Optionen
function updateDropdown(dropdownId, validOptions) {
	const dropdown = document.getElementById(dropdownId);
	Array.from(dropdown.options).forEach((option) => {
		option.style.display = validOptions.has(option.value) ? "" : "none";
	});
}

// Setzt alle Filter und zeigt alle Zeilen in der Tabelle wieder an
function resetFilters() {
	const countryFilter = document.getElementById("country-filter");
	const companyFilter = document.getElementById("company-filter");

	// Zeigt alle Optionen in den Dropdowns an
	Array.from(countryFilter.options).forEach((option) => (option.style.display = ""));
	Array.from(companyFilter.options).forEach((option) => (option.style.display = ""));

	// Setzt die Dropdown-Auswahl auf leer
	countryFilter.value = "";
	companyFilter.value = "";

	// Zeigt alle Zeilen in der Tabelle an
	const rows = document.getElementById("data-table").getElementsByTagName("tr");
	for (let i = 1; i < rows.length; i++) {
		rows[i].style.display = "";
	}

	filterTable();
}

// Sammelt gültige Länder- und Unternehmensoptionen basierend auf aktuellen Filtern
function collectValidOptions(data, currentCountry, currentCompany) {
	let validCountries = new Set();
	let validCompanies = new Set();

	// Durchläuft alle Daten und fügt gültige Länder und Unternehmen zu den Sets hinzu
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
