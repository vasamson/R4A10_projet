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
                document.getElementById('cache').style.display = "block";
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
        
        // Création du premier article;
        boite_details = document.createElement("article");
        boite_details.id = "boite-details";
        boite_details.classList.add("popup-box");

        // Création du header de l'article
        header_popup = document.createElement("header");
        header_popup.classList.add("popup-header");
        image_header = document.createElement("img");
        // Création de l'image
        image_header.src = countryObj.getFlags();
        image_header.classList.add("popup-flag");
        titre_popup = document.createElement("h2");
        titre_popup.classList.add("popup-title");
        titre_popup.textContent.add(`${countryObj._nom}`);

        header_popup.appendChild(image_header);
        header_popup.appendChild(titre_popup);

        boite_details.appendChild(header_popup);
    }
    
    

    // on affiche la première table au chargement de la page
    afficheTable(currentPage);

});