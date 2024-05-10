window.onload = function () {
	// Holen der vom Benutzer verwendeten Sprache
	var userLang = navigator.language || navigator.userLanguage;

	// Definieren von Sprachen, die von rechts nach links geschrieben werden
	var rtlLanguages = ["ar", "he", "fa", "ur"];

	// Ändern der Seitenrichtung auf 'rtl', wenn die Sprache eine der RTL-Sprachen ist
	if (rtlLanguages.includes(userLang)) {
		document.querySelector("html").setAttribute("dir", "rtl");
	}

	// Verschieben des Offcanvas-Menüs an das rechte Ende, wenn die Sprache RTL ist
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
