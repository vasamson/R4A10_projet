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
    let currentSortOrder = 'asc'; // 'asc' pour croissant, 'desc' pour décroissant

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
            let languages = country._languages ? country._languages.map(lang => lang.name).join(", ") : "N/A";
            
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
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc'; // Inverse l'ordre du tri
        } else {
            currentSortColumn = column;
            currentSortOrder = 'asc'; // Si on change de colonne, on trie par ordre croissant
        }

        filteredCountries.sort((a, b) => {
            let valA = a[column];
            let valB = b[column];

            // Si la valeur est un nombre, on effectue un tri numérique
            if (typeof valA === 'number' && typeof valB === 'number') {
                return currentSortOrder === 'asc' ? valA - valB : valB - valA;
            }

            // Sinon on effectue un tri alphabétique
            if (typeof valA === 'string' && typeof valB === 'string') {
                return currentSortOrder === 'asc' 
                    ? valA.localeCompare(valB) 
                    : valB.localeCompare(valA);
            }

            return 0; // En cas de types différents ou valeurs non triables
        });

        // Pour départager les égalités, on compare les noms français
        if (currentSortColumn !== 'flags') {
            filteredCountries.sort((a, b) => {
                if (a[currentSortColumn] === b[currentSortColumn]) {
                    return a._nom.localeCompare(b._nom);
                }
                return 0;
            });
        }

        afficheTable(currentPage);
    }

    // Ajouter l'écouteur d'événement pour le tri sur chaque colonne (sauf "drapeau")
    $("th[data-sort]").click(function() {
        const column = $(this).data("sort");

        // Mettre en gras la colonne triée
        $("th").css("font-weight", "normal");
        $(this).css("font-weight", "bold");

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
