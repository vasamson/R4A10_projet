$(document).ready(function() {
    const tableBody = $("#countries-list");
    const continentFilter = $("#continent");
    const languageFilter = $("#language");
    const countryNameFilter = $("#country-name");
    const cacheDiv = $("#cache");
    const itemsPerPage = 25;
    let currentPage = 1;
    let filteredCountries = [];

    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    // Remplir les filtres avec les continents et langues
    function populateFilters() {
        const continents = new Set();
        const languages = new Set();

        Country.all_countries.forEach(country => {
            if (country._continent) continents.add(country._continent);
        });

        Language.all_languages.forEach(language => {
            languages.add(language._nom);
        });

        // Remplir le filtre des continents
        continents.forEach(continent => {
            continentFilter.append(new Option(continent, continent));
        });

        // Remplir le filtre des langues
        languages.forEach(language => {
            languageFilter.append(new Option(language, language));
        });
    }

    // Récupérer les pays filtrés en fonction des critères
    function getFilteredCountries() {
        return Array.from(Country.all_countries.values()).filter(country => {
            const matchesContinent = !continentFilter.val() || country._continent === continentFilter.val();

            // Vérifie si la langue sélectionnée est contenue dans la liste des langues du pays
            const matchesLanguage = !languageFilter.val() || 
                (country._languages && Object.values(country._languages).some(lang => 
                    lang.name.toLowerCase() === languageFilter.val().toLowerCase()
                ));

            const matchesName = !countryNameFilter.val() || removeAccents(country._nom.toLowerCase()).includes(removeAccents(countryNameFilter.val().toLowerCase()));

            return matchesContinent && matchesLanguage && matchesName;
        });
    }

    // Afficher le tableau des pays
    function afficheTable(page) {
        tableBody.empty();  // Vider le tableau avant de le remplir
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            // Récupération des noms des langues sans le code ISO
            const languages = country.getLanguages().split(",").map(lang => lang.split(" (")[0]).join(", ");

            const row = $(`
                <tr>
                    <td>${country._nom}</td>
                    <td>${country._population}</td>
                    <td>${languages}</td>
                    <td>${country.getSurface()}</td>
                    <td>${country.getPopDensity()}</td>
                    <td>${country._continent}</td>
                    <td><img src="${country.getFlags()}" alt="Drapeau de ${country._nom}" width="50"></td>
                </tr>
            `);
            tableBody.append(row);
        });

        updatePagination();
    }

    // Mettre à jour la pagination
    function updatePagination() {
        const paginationContainer = $("#pagination");
        paginationContainer.html(`Page : ${currentPage} / ${Math.ceil(filteredCountries.length / itemsPerPage)}`);
    }

    // Mettre à jour les filtres
    function updateFilters() {
        filteredCountries = getFilteredCountries();
        currentPage = 1;
        afficheTable(currentPage);
    }

    // Supprimer les accents des caractères
    function removeAccents(str) {
        return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    // Masquer le div de cache au démarrage
    if (cacheDiv.length) {
        cacheDiv.hide();
    }

    // Ajouter les écouteurs d'événements pour les filtres
    continentFilter.change(updateFilters);
    languageFilter.change(updateFilters);
    countryNameFilter.on("input", updateFilters);

    // Initialiser les filtres et afficher le tableau
    populateFilters();
    filteredCountries = getFilteredCountries();
    afficheTable(currentPage);
});
