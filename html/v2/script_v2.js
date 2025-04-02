$(document).ready(function() {
    const $tableBody = $("#countries-list");
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    /*
    * PAGINATION
    */
    
    const nbParPage = 25;
    let currentPage = 1;
    const totalPages = Math.ceil(Country.all_countries.size / nbParPage);

    function afficheTable(page) {
        $tableBody.empty(); // le tableau est vidé pour être rempli par les nouvelles valeurs, au cas où

        const startIndex = (page - 1) * nbParPage;
        const endIndex = startIndex + nbParPage;
        const countriesToShow = Array.from(Country.all_countries.values()).slice(startIndex, endIndex);

        const $fragment = $(document.createDocumentFragment());

        countriesToShow.forEach(countryObj => {
            const $row = $("<tr>");

            // Cellules de texte
            const columns = [
                countryObj._nom ?? "N/a",
                countryObj._population ?? "N/a",
                countryObj.getSurface() ?? "N/a",
                Number.isFinite(countryObj.getPopDensity()) ? countryObj.getPopDensity() : "N/a",
                countryObj._continent ?? "N/a"
            ].map(text => $("<td>").text(text));

            // Cellule d'image (drapeau)
            const $flagCell = $("<td>");
            const $flagImg = $("<img>").attr({
                src: countryObj.getFlags(),
                alt: `Drapeau de ${countryObj._nom}`
            }).css({ width: "50px", height: "auto" });

            $flagCell.append($flagImg);
            $row.append(...columns, $flagCell);
            $fragment.append($row);
        });

        $tableBody.append($fragment);
        gestionBoutons(page);
    }

    function gestionBoutons(page) {
        const $conteneurBtn = $("#pagination-container").empty(); // les anciens boutons disparaissent

        // bouton "Précédent"
        if (page > 1) {
            const $btnPrecedent = $("<button>").text("PRÉC").on("click", function() {
                currentPage--;
                afficheTable(currentPage);
            });
            $conteneurBtn.append($btnPrecedent);
        }

        $("#pagination").text(`Page : ${currentPage} / ${totalPages}`);

        // bouton "Suivant"
        if (page < totalPages) {
            const $btnSuivant = $("<button>").text("SUIV").on("click", function() {
                currentPage++;
                afficheTable(currentPage);
            });
            $conteneurBtn.append($btnSuivant);
        }
    }

    // on affiche la première table au chargement de la page
    afficheTable(currentPage);
});