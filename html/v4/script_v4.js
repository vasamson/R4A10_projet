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

    if (cacheDiv.length) {
        cacheDiv.hide();
    }

    continentFilter.change(updateFilters);
    languageFilter.change(updateFilters);
    countryNameFilter.on("input", updateFilters);

    populateFilters();
    filteredCountries = getFilteredCountries();
    afficheTable(currentPage);

    function gestionBoutons(page) {
        const $conteneurBtn = $("#btn-pag").empty(); // les anciens boutons disparaissent

        // bouton "Précédent"
        if (page > 1) {
            const $btnPrecedent = $("<button>").text("PRÉC").on("click", function() {
                currentPage--;
                afficheTable(currentPage);
            });
            $conteneurBtn.append($btnPrecedent);
        }

        const $pagination = $("<p>", {
            id: "pagination",
            class: "pagination-text"
        });

        $pagination.text(`${currentPage} sur ${totalPages}`);
        $conteneurBtn.append($pagination);

        // bouton "Suivant"
        if (page < totalPages) {
            const $btnSuivant = $("<button>").text("SUIV").on("click", function() {
                currentPage++;
                afficheTable(currentPage);
            });
            $conteneurBtn.append($btnSuivant);
        }
    }

});
