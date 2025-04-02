$(document).ready(function() {
    const $tableBody = $("#countries-list");

    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    const $fragment = $(document.createDocumentFragment());

    // Cconversion de la Map en tableau
    const rows = Array.from(Country.all_countries.values()).map(countryObj => {
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
        const $flagCellule = $("<td>");
        const $flagImg = $("<img>").attr({
            src: countryObj.getFlags(),
            alt: `Drapeau de ${countryObj._nom}`
        }).css({ width: "50px", height: "auto" });

        $flagCellule.append($flagImg);

        // Ajout des td au tr
        $row.append(...columns, $flagCellule);

        return $row;
    });

    // Ajout des lignes au fragment puis au tableau
    $fragment.append(rows);
    $tableBody.append($fragment);
});