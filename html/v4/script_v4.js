$(document).ready(function() {
    const $tableBody = $("#countries-list");
    const $continentFilter = $("#continent");
    const $languageFilter = $("#language");
    const $countryNameFilter = $("#country-name");
    const $cacheDiv = $("#cache");
    const itemsPerPage = 25;
    let currentPage = 1;
    let filteredCountries = [];

    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    function populateFilters() {
        const continents = new Set();
        const languages = new Set();

        Country.all_countries.forEach(country => {
            if (country._continent) continents.add(country._continent);
        });

        Language.all_languages.forEach(language => {
            languages.add(language._nom);
        });

        // Ajout des continents dans le filtre
        continents.forEach(continent => {
            $continentFilter.append(new Option(continent, continent));
        });

        // Ajout des langues dans le filtre
        languages.forEach(language => {
            $languageFilter.append(new Option(language, language));
        });
    }

    function getFilteredCountries() {
        return Array.from(Country.all_countries.values()).filter(country => {
            const matchesContinent = !$continentFilter.val() || country._continent === $continentFilter.val();
            const matchesLanguage = !$languageFilter.val() || (country._languages && Object.values(country._languages).some(lang => lang.name === $languageFilter.val()));
            const matchesName = !$countryNameFilter.val() || removeAccents(country._nom.toLowerCase()).includes(removeAccents($countryNameFilter.val().toLowerCase()));
            return matchesContinent && matchesLanguage && matchesName;
        });
    }

    function afficheTable(page) {
        $tableBody.empty();
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            const languages = country._languages ? Object.values(country._languages).map(lang => lang.name).join(", ") : "N/A";
            const row = `
                <tr>
                    <td>${country._nom}</td>
                    <td>${country._population}</td>
                    <td>${country.getLanguages()}</td>
                    <td>${country.getSurface()}</td>
                    <td>${country.getPopDensity()}</td>
                    <td>${country._continent}</td>
                    <td><img src="${country.getFlags()}" alt="Drapeau de ${country._nom}" width="50"></td>
                </tr>
            `;
            $tableBody.append(row);
        });
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);
        $("#pagination").text(`Page : ${currentPage} / ${totalPages}`);
    }

    function updateFilters() {
        filteredCountries = getFilteredCountries();
        currentPage = 1;
        afficheTable(currentPage);
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    // Assurer que #cache est bien masqué dès le chargement de la page
    if ($cacheDiv.length) {
        $cacheDiv.hide();
    }

    // Écouter les événements sur les filtres
    $continentFilter.on("change", updateFilters);
    $languageFilter.on("change", updateFilters);
    $countryNameFilter.on("input", updateFilters);
    
    populateFilters();
    filteredCountries = getFilteredCountries();
    afficheTable(currentPage);
});
