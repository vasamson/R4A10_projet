$(document).ready(function() {
    const tableBody = $("#countries-list");
    const continentFilter = $("#continent");
    const languageFilter = $("#language");
    const countryNameFilter = $("#country-name");
    const cacheDiv = $("#cache");
    const itemsPerPage = 25;
    let currentPage = 1;
    let filteredCountries = [];
    let currentSortColumn = null;
    let currentSortOrder = 'desc'; // Par défaut, tri décroissant (Z → A ou du plus grand au plus petit)

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

        continents.forEach(continent => {
            continentFilter.append(new Option(continent, continent));
        });

        languages.forEach(language => {
            languageFilter.append(new Option(language, language));
        });
    }

    function getFilteredCountries() {
        return Array.from(Country.all_countries.values()).filter(country => {
            const matchesContinent = !continentFilter.val() || country._continent === continentFilter.val();
            const matchesLanguage = !languageFilter.val() || 
                (country._languages && Object.values(country._languages).some(lang => 
                    lang.name && lang.name.toLowerCase() === languageFilter.val().toLowerCase()
                ));
            const matchesName = !countryNameFilter.val() || removeAccents(country._nom.toLowerCase()).includes(removeAccents(countryNameFilter.val().toLowerCase()));
            return matchesContinent && matchesLanguage && matchesName;
        });
    }

    function afficheTable(page) {
        tableBody.empty();
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            const row = $(
                `<tr>
                    <td>${country._nom}</td>
                    <td>${country._population}</td>
                    <td>${country.getLanguages()}</td>
                    <td>${country.getSurface()}</td>
                    <td>${country.getPopDensity()}</td>
                    <td>${country._continent}</td>
                    <td><img src="${country.getFlags()}" alt="Drapeau de ${country._nom}" width="50"></td>
                </tr>`
            );
            tableBody.append(row);
        });

        updatePagination();
    }

    function updatePagination() {
        const paginationContainer = $("#pagination");
        paginationContainer.html(`Page : ${currentPage} / ${Math.ceil(filteredCountries.length / itemsPerPage)}`);
    }

    function updateFilters() {
        filteredCountries = getFilteredCountries();
        currentPage = 1;
        afficheTable(currentPage);
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    function sortCountries(column) {
        if (currentSortColumn === column) {
            // Inverser l'ordre si on clique sur la même colonne
            currentSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
        } else {
            // Si on change de colonne, on commence toujours par un tri décroissant (Z → A)
            currentSortColumn = column;
            currentSortOrder = 'desc';
        }

        filteredCountries.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            if (valA == null) valA = "";
            if (valB == null) valB = "";

            // Tri numérique ou alphabétique inversé
            return currentSortOrder === 'desc'
                ? valB.toString().localeCompare(valA.toString(), 'fr', { ignorePunctuation: true })
                : valA.toString().localeCompare(valB.toString(), 'fr', { ignorePunctuation: true });
        });

        // En cas d'égalité, trier par nom (A → Z)
        filteredCountries.sort((a, b) => {
            if (a[currentSortColumn] === b[currentSortColumn]) {
                return a._nom.localeCompare(b._nom);
            }
            return 0;
        });

        afficheTable(currentPage);
    }

    // Ajout des événements sur les boutons de tri
    $(document).on("click", "button[data-sort]", function() {
        const column = $(this).data("sort");
        sortCountries(column);
    });

    if (cacheDiv.length) {
        cacheDiv.hide();
    }

    continentFilter.change(updateFilters);
    languageFilter.change(updateFilters);
    countryNameFilter.on("input", updateFilters);

    populateFilters();
    filteredCountries = getFilteredCountries();
    afficheTable(currentPage);
});
