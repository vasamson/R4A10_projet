document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("countries-list");
    
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
        tableBody.innerHTML = ""; // le tableau est vidé pour être rempli par les nouvelles valeurs, au cas où

        const startIndex = (page - 1) * nbParPage;
        const endIndex = startIndex + nbParPage;
        const countriesToShow = Array.from(Country.all_countries.values()).slice(startIndex, endIndex);

        const fragment = document.createDocumentFragment();

        countriesToShow.forEach(countryObj => {
            const row = document.createElement("tr");

            row.setAttribute("data-code",countryObj._code_alpha3); // ajout de l'attribut pour identifier le pays
            row.addEventListener('click',() => {
                document.getElementById('cache').style.display = "flex";
                afficheDetails(countryObj._code_alpha3);
            });

            // cellules de texte
            const columns = [
                countryObj._nom ?? "N/a",
                countryObj._population ?? "N/a",
                countryObj.getSurface() ?? "N/a",
                Number.isFinite(countryObj.getPopDensity()) ? countryObj.getPopDensity() : "N/a",
                countryObj._continent ?? "N/a"
            ].map(text => {
                const cellule = document.createElement("td");
                cellule.textContent = text;
                return cellule;
            });

            // Cellule d'image (drapeau)
            const flagCell = document.createElement("td");
            const flagImg = document.createElement("img");
            flagImg.src = countryObj.getFlags();
            flagImg.alt = `Drapeau de ${countryObj._nom}`;
            flagImg.style.width = "50px";
            flagImg.style.height = "auto";

            flagCell.appendChild(flagImg);
            row.append(...columns, flagCell);
            fragment.appendChild(row);
        });

        tableBody.appendChild(fragment);
        gestionBoutons(page);

    };

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

    function afficheDetails(code_alpha3) {
        const pays = Array.from(Country.all_countries.values()).find(country => {
            return country._code_alpha3 === code_alpha3;
        });

        console.log(pays);

        // On récupère l'article "boite-details"

        article_details = document.getElementById('boite-details');
        header_popup = article_details.querySelector('header');

        img_header = header_popup.querySelector('img');
        img_header.src = pays.getFlags();

        titre_header = header_popup.querySelector('h2');
        titre_header.textContent = pays._nom;

        /* INFORMATIONS GÉNÉRALES */

        infos_generales = article_details.querySelector("#general");

        texteContinent = infos_generales.querySelector("#location");
        texteContinent.textContent = pays._continent;

        texteCapitale = infos_generales.querySelector("#capital");
        texteCapitale.textContent = pays._capitale;


    }
    
    

    // on affiche la première table au chargement de la page
    afficheTable(currentPage);

});