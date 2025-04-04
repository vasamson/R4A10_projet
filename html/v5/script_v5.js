$(document).ready(function() {
    const tableBody = $("#countries-list");
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    let tableFiltre = Array.from(Country.all_countries.values());

    const nbParPage = 25;
    let currentPage = 1;
    let totalPages = Math.ceil(tableFiltre.length / nbParPage);

    let sortOrder = { // Le tri initial se fait par ordre croissant
        nom: 'asc',
        population: 'asc',
        surface: 'asc',
        densite: 'asc',
        continent: 'asc'
    };

    remplirFiltres();

    const $filtreContinent = $('select[name="continent"]');
    const $filtreLangue = $('select[name="langues"]');
    const $filtreNomPays = $('#country-name');

    let activeFilters = {
        continent: '',
        langue: '',
        nom: ''
    };

    function applyFilters() {
        let filteredTable = Array.from(Country.all_countries.values());

        // on applique tous les filtres de façon cumulative
        if (activeFilters.continent) {
            filteredTable = filtreContinent(filteredTable, activeFilters.continent);
        }
        if (activeFilters.langue) {
            filteredTable = filtreLangue(filteredTable, activeFilters.langue);
        }
        if (activeFilters.nom) {
            filteredTable = filtreNom(filteredTable, activeFilters.nom);
        }

        // On recalcule la pagination (et oui)
        totalPages = Math.ceil(filteredTable.length / nbParPage);
        currentPage = 1; // Revenir à la première page après un changement de filtre
        afficheTable(currentPage, filteredTable);
    }

    $filtreContinent.on('change', function() {
        activeFilters.continent = $filtreContinent.val();
        applyFilters();
    });

    $filtreLangue.on('change', function() {
        activeFilters.langue = $filtreLangue.val();
        applyFilters();
    });

    $filtreNomPays.on('input', function() {
        activeFilters.nom = $filtreNomPays.val().toLowerCase();
        applyFilters();
    });

    function afficheTable(page, filteredTable) {
        tableBody.empty();  // vider la table avant de la remplir

        const startIndex = (page - 1) * nbParPage;
        const endIndex = startIndex + nbParPage;
        const countriesToShow = filteredTable.slice(startIndex, endIndex);

        const fragment = $(document.createDocumentFragment());

        countriesToShow.forEach(countryObj => {
            const row = $("<tr>").attr("data-code", countryObj._code_alpha3);

            row.on('click', function() {
                afficheDetails(countryObj._code_alpha3);
            });

            const columns = [
                countryObj._nom ?? "N/a",
                countryObj._population ?? "N/a",
                countryObj.getSurface() ?? "N/a",
                Number.isFinite(countryObj.getPopDensity()) ? countryObj.getPopDensity() : "N/a",
                countryObj._continent ?? "N/a"
            ].map(text => {
                return $("<td>").text(text);
            });

            const flagCell = $("<td>");
            const flagImg = $("<img>").attr({
                "src": countryObj.getFlags(),
                "alt": `Drapeau de ${countryObj._nom}`,
                "style": "width: 50px; height: auto;"
            });

            flagCell.append(flagImg);
            row.append(columns).append(flagCell);
            fragment.append(row);
        });

        tableBody.append(fragment);

        $tableBody.on('click', function (event) {
            let target = $(event.target);
            
            console.log(target.closest(".flag-cell").length);
    
            // on vérifie si c'est bien le drapeau qui a été cliqué
            if (target.is("img") && target.closest(".flag-cell").length) {
                event.stopPropagation(); // pas sûr que ce soit utile
                $('#boite-details').hide();
                $('#cache').css('display', 'flex');
                $('.img-detail').attr('src', target.attr('src')).show();
                $('.img-detail').attr('alt',target.attr('alt')).show();
            } else {
                $('.img-detail').hide();
                $('#boite-details').show();
            }
        });

        $('#cache').on('click', function () {
            $(this).hide();
        });

        gestionPagination(page);
    }

    /* V2 (PAGINATION) */

    function gestionPagination(page) {
        const $conteneurBtn = $("#btn-pag").empty();

        if (page > 1) {
            const $btnPrecedent = $("<button>").text("PRÉC").on("click", function() {
                currentPage--;
                afficheTable(currentPage, tableFiltre);
            });
            $conteneurBtn.append($btnPrecedent);
        }

        const $pagination = $("<p>", {
            id: "pagination",
            class: "pagination-text"
        }).text(`${currentPage} sur ${totalPages}`);

        $conteneurBtn.append($pagination);

        if (page < totalPages) {
            const $btnSuivant = $("<button>").text("SUIV").on("click", function() {
                currentPage++;
                afficheTable(currentPage, tableFiltre);
            });
            $conteneurBtn.append($btnSuivant);
        }
    }


    /* V3 (DETAILS) */


    function afficheDetails(codeAlpha3) {
        $('#cache').css('display', 'flex');
        const pays = Array.from(Country.all_countries.values()).find(country => country._code_alpha3 === codeAlpha3);

        let $articleDetails = $('#boite-details');
        let $headerPopup = $articleDetails.find('header');
        let $imgHeader = $headerPopup.find('img');
        $imgHeader.attr('src', pays.getFlags());

        let $titreHeader = $headerPopup.find('h2');
        $titreHeader.text(pays._nom);

        let $infosGenerales = $articleDetails.find('#general');
        $infosGenerales.find('#location').text(pays._continent ?? "N/a");
        $infosGenerales.find('#capital').text(pays._capitale ?? "N/a");
        $infosGenerales.find('#population').text(pays._population ?? "N/a");
        $infosGenerales.find('#area').text(pays.getSurface() ?? "N/a");
        $infosGenerales.find('#density').text(pays.getPopDensity() ?? "N/a");

        let $listeLangues = $articleDetails.find('#languages ul').empty();
        pays.getLanguages().forEach(langue => {
            $('<li>', { text: langue.toString(), class: 'popup-list-item' }).appendTo($listeLangues);
        });

        let $listeMonnaies = $articleDetails.find('#currency ul').empty();
        pays.getCurrencies().forEach(currency => {
            $('<li>', { text: currency.toString(), class: 'popup-list-item' }).appendTo($listeMonnaies);
        });

        let $tableauVoisins = $articleDetails.find('#borders tbody').empty();
        let voisins = pays.getBorders();

        if (voisins.length === 0) {
            $('<tr>').append(
                $('<td>', { text: "Aucun voisin trouvé pour ce pays", attr: { colspan: 4 }, class: 'text-center' })
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

        $articleDetails.find('#close-popup').off('click').on('click', function() {
            $('#cache').css('display', 'none');
        });
    }


    /*
    * V4( FILTRES )
    *
    */


    function filtreContinent(table, filtre) {
        return filtre ? table.filter(el => el._continent === filtre) : table;
    }

    function filtreLangue(table, filtre) {
        return filtre 
            ? table.filter(el => el.getLanguages().some(langue => {
                const langueNom = (langue._nom || "").toLowerCase();
                return langueNom === filtre.toLowerCase();
            }))
            : table;
    }

    function filtreNom(table, filtre) {
        return filtre 
            ? table.filter(el => el._nom.toLowerCase().includes(filtre))
            : table;
    }

    function remplirFiltres() {
        const filtres = $('#filters');
        const selectContinent = $('#f-continent');
        const selectLangue = $('#f-langues');
        const continents = new Set();
        const langues = new Set();

        Country.all_countries.forEach(countryObj => {
            if (!continents.has(countryObj._continent)) {
                continents.add(countryObj._continent);
                const option = $("<option>").text(countryObj._continent).val(countryObj._continent);
                selectContinent.append(option);
            }

            countryObj.getLanguages().forEach(langue => {
                const langueNormalisee = langue._nom.toLowerCase();
                if (!langues.has(langueNormalisee)) {
                    langues.add(langueNormalisee);
                    const option = $("<option>").text(langue._nom).val(langueNormalisee);
                    selectLangue.append(option);
                }
            });
        });
    }

    /*
    *
    * V5 (TRI)
    *
    */
    function sortTable(colKey, filteredTable) {
        filteredTable.sort((a, b) => {
            let comparison = 0;
    
            if (colKey === 'nom') {
                comparison = a._nom.localeCompare(b._nom);
            } else if (colKey === 'population') {
                comparison = a._population - b._population;
            } else if (colKey === 'surface') {
                comparison = a.getSurface() - b.getSurface();
            } else if (colKey === 'densite') {
                comparison = a.getPopDensity() - b.getPopDensity();
            } else if (colKey === 'continent') {
                comparison = a._continent.localeCompare(b._continent);
            }
    
            return sortOrder[colKey] === 'asc' ? comparison : -comparison;
        });
    
        // on inverse l'ordre de tri au prochain clic
        sortOrder[colKey] = sortOrder[colKey] === 'asc' ? 'desc' : 'asc';
    
        // on recalcule la pagination (ENCORE :) )
        totalPages = Math.ceil(filteredTable.length / nbParPage);
        currentPage = 1; // Et on revient à la page initiale (c'est toujours mieux)
        afficheTable(currentPage, filteredTable);
    }
    

    /* GESTION DES CLICS SUR LES EN-TÊTES */
    $("th").on('click', function() {
        const colKey = $(this).data('column'); // on récupère le data "column"
        
        let filteredTable = Array.from(Country.all_countries.values());
    
        // on applique les filtres si il y en a
        if (activeFilters.continent) {
            filteredTable = filtreContinent(filteredTable, activeFilters.continent);
        }
        if (activeFilters.langue) {
            filteredTable = filtreLangue(filteredTable, activeFilters.langue);
        }
        if (activeFilters.nom) {
            filteredTable = filtreNom(filteredTable, activeFilters.nom);
        }
    
        // on trie la table sur le tableau filtré
        sortTable(colKey, filteredTable);
    });
    
    // Affichage de la première page de pays
    afficheTable(currentPage, tableFiltre);
});