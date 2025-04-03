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

            $row.attr("data-code", countryObj._code_alpha3); // ajout de l'attribut (pour identifier le pays)
            $row.on('click', function() {
                afficheDetails(countryObj._code_alpha3);
            });

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
        gestionPagination(page);
    }

    function gestionPagination(page) {
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

    function afficheDetails(codeAlpha3) {
        $('#cache').css('display', 'flex');
    
        const pays = Array.from(Country.all_countries.values()).find(country => {
            return country._code_alpha3 === codeAlpha3;
        });
    
        let $articleDetails = $('#boite-details');
        let $headerPopup = $articleDetails.find('header');
    
        let $imgHeader = $headerPopup.find('img');
        $imgHeader.attr('src', pays.getFlags());
    
        let $titreHeader = $headerPopup.find('h2');
        $titreHeader.text(pays._nom);
    
        /* INFORMATIONS GÉNÉRALES */
        let $infosGenerales = $articleDetails.find('#general');
        $infosGenerales.find('#location').text(pays._continent ?? "N/a");
        $infosGenerales.find('#capital').text(pays._capitale ?? "N/a");
        $infosGenerales.find('#population').text(pays._population ?? "N/a");
        $infosGenerales.find('#area').text(pays.getSurface() ?? "N/a");
        $infosGenerales.find('#density').text(pays.getPopDensity() ?? "N/a");
    
        /* LANGUES */
        let $listeLangues = $articleDetails.find('#languages ul').empty();
        pays.getLanguages().forEach(langue => {
            $('<li>', {
                text: langue.toString(),
                class: 'popup-list-item'
            }).appendTo($listeLangues);
        });
    
        /* MONNAIES */
        let $listeMonnaies = $articleDetails.find('#currency ul').empty();
        pays.getCurrencies().forEach(currency => {
            $('<li>', {
                text: currency.toString(),
                class: 'popup-list-item'
            }).appendTo($listeMonnaies);
        });
    
        /* PAYS FRONTALIERS */
        let $tableauVoisins = $articleDetails.find('#borders tbody').empty();
        let voisins = pays.getBorders();
        
        if (voisins.length === 0) {
            $('<tr>').append(
                $('<td>', {
                    text: "Aucun voisin trouvé pour ce pays",
                    attr: { colspan: 4 },
                    class: 'text-center'
                })
            ).appendTo($tableauVoisins);
        } else {
            voisins.forEach(voisin => {
                $('<tr>').append(
                    $('<td>').text(voisin._code_alpha3),
                    $('<td>').text(voisin._nom),
                    $('<td>').text(voisin._continent),
                    $('<td>').html(`<img src="${voisin.getFlags()}" alt="${voisin._nom}">`)
                ).appendTo($tableauVoisins);
            });
        }
    
        /* GESTION DE LA CROIX */
        $articleDetails.find('#close-popup').off('click').on('click', function() {
            $('#cache').css('display', 'none');
        });
    }
    
    
    

    // on affiche la première table au chargement de la page
    afficheTable(currentPage);

});