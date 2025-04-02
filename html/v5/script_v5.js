$(document).ready(function() {
    const tableBody = $("#countries-list");
    const itemsPerPage = 25;
    let currentPage = 1;
    let filteredCountries = [];
    let currentSortColumn = null;
    let currentSortOrder = 'desc'; // On commence par un tri décroissant

    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    function getFilteredCountries() {
        return Array.from(Country.all_countries.values());
    }

    function afficheTable() {
        tableBody.empty();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const countriesToShow = filteredCountries.slice(startIndex, endIndex);

        countriesToShow.forEach(country => {
            const row = $(`
                <tr>
                    <td>${country._nom}</td>
                    <td>${country._population}</td>
                    <td>${country.getLanguages()}</td>
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

    function updatePagination() {
        $("#pagination").html(`Page : ${currentPage} / ${Math.ceil(filteredCountries.length / itemsPerPage)}`);
    }

    function sortCountries(column) {
        if (currentSortColumn === column) {
            currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            currentSortColumn = column;
            currentSortOrder = 'desc'; // Toujours commencer par décroissant
        }

        filteredCountries.sort((a, b) => {
            let valA = getColumnValue(a, column);
            let valB = getColumnValue(b, column);

            if (typeof valA === 'number' && typeof valB === 'number') {
                return currentSortOrder === 'desc' ? valB - valA : valA - valB;
            }

            if (typeof valA === 'string' && typeof valB === 'string') {
                return currentSortOrder === 'desc' 
                    ? valB.localeCompare(valA) 
                    : valA.localeCompare(valB);
            }

            return 0;
        });

        // Départage en cas d'égalité par le nom du pays
        filteredCountries.sort((a, b) => {
            if (getColumnValue(a, column) === getColumnValue(b, column)) {
                return a._nom.localeCompare(b._nom);
            }
            return 0;
        });

        afficheTable();
    }

    function getColumnValue(country, column) {
        switch (column) {
            case "nom": return country._nom;
            case "population": return country._population;
            case "languages": return country.getLanguages();
            case "surface": return country.getSurface();
            case "density": return country.getPopDensity();
            case "continent": return country._continent;
            default: return "";
        }
    }

    $("button[data-sort]").click(function() {
        const column = $(this).data("sort");
        sortCountries(column);
    });

    filteredCountries = getFilteredCountries();
    afficheTable();
});
