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

            // Cellules de texte
            const columns = [
                countryObj._nom,
                countryObj._population,
                countryObj.getSurface(),
                countryObj.getPopDensity(),
                countryObj._continent
            ].map(text => {
                const cell = document.createElement("td");
                cell.textContent = text;
                return cell;
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

        paragraphe_page = document.getElementById('pagination');
        paragraphe_page.innerHTML = `Page : ${currentPage} / ${totalPages}`;
    };

    function gestionBoutons(page) {
        const conteneur_btn = document.getElementById('btn-pag');
        conteneur_btn.innerHTML = ""; // les anciens boutons disparaissent

        // bouton "Précédent"
        if (page > 1) {
            const btn_precedent = document.createElement("button");
            btn_precedent.textContent = "PRÉC";
            
            // cliquer sur "Précédent" décrémente la pagination
            btn_precedent.addEventListener('click', function() {
                currentPage--;
                afficheTable(currentPage);
            });
            
            conteneur_btn.appendChild(btn_precedent);
        }

        // bouton "Suivant"
        if (page < totalPages) {
            const btn_suivant = document.createElement("button");
            btn_suivant.textContent = "SUIV";
            
            // Cliquer sur "Suivant" incrémente la pagination
            btn_suivant.addEventListener('click', function() {
                currentPage++;
                afficheTable(currentPage);
            });

            conteneur_btn.appendChild(btn_suivant);
        }
    }

    function afficheDetails(code_alpha3) {
        const pays = Array.from(Country.all_countries.values()).find(country => {
            return country._code_alpha3 === code_alpha3;
        });
        console.log(pays);
    }
    
    

    // on affiche la première table au chargement de la page
    afficheTable(currentPage);

});