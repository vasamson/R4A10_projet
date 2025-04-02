document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("countries-list");
    const continentFilter = document.getElementById("continent");
    const languageFilter = document.getElementById("language");
    const countryNameFilter = document.getElementById("country-name");
    const itemsPerPage = 25;
    let currentPage = 1;
    let filteredCountries = [];
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    function getFilteredCountries() {
        return Array.from(Country.all_countries.values()).filter(country => {
            const matchesContinent = !continentFilter.value || country._continent === continentFilter.value;
            const matchesLanguage = !languageFilter.value || (country._languages && country._languages.includes(languageFilter.value));
            const matchesName = !countryNameFilter.value || removeAccents(country._nom.toLowerCase()).includes(removeAccents(countryNameFilter.value.toLowerCase()));
            return matchesContinent && matchesLanguage && matchesName;
        });
    }

    function afficheTable(page) {
        tableBody.innerHTML = "";
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${country._nom}</td>
                <td>${country._population}</td>
                <td>${country.getSurface()}</td>
                <td>${country.getPopDensity()}</td>
                <td>${country._continent}</td>
                <td><img src="${country.getFlags()}" alt="Drapeau de ${country._nom}" width="50"></td>
            `;
            tableBody.appendChild(row);
        });
        updatePagination();
    }

    function updatePagination() {
        const paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = `Page : ${currentPage} / ${Math.ceil(filteredCountries.length / itemsPerPage)}`;
    }

    function updateFilters() {
        filteredCountries = getFilteredCountries();
        currentPage = 1;
        afficheTable(currentPage);
    }

    function removeAccents(str) {
        return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    }

    continentFilter.addEventListener("change", updateFilters);
    languageFilter.addEventListener("change", updateFilters);
    countryNameFilter.addEventListener("input", updateFilters);
    
    filteredCountries = getFilteredCountries();
    afficheTable(currentPage);
});
