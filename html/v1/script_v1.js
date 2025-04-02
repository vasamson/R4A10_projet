document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("countries-list");
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    const fragment = document.createDocumentFragment(); // + performant

    // conversion de Map en tableau (sinon .map() ne fonctionnera pas)
    const rows = Array.from(Country.all_countries.values()).map(countryObj => {
        const row = document.createElement("tr");
    
        // cellules de texte
        // on met "N/a" pour tous si il y a un quelconque problème (attribut / valeur non existant(e) ou NaN)
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
    
        // cellule d'image (drapeau)
        const flagcellule = document.createElement("td");
        const flagImg = document.createElement("img");
        flagImg.src = countryObj.getFlags();
        flagImg.alt = `Drapeau de ${countryObj._nom}`;
        flagImg.style.width = "50px";
        flagImg.style.height = "auto";
    
        flagcellule.appendChild(flagImg);
    
        // ajout des td au tr
        row.append(...columns, flagcellule);
        
        return row;
    });
    
    // ajout des lignes au fragment
    rows.forEach(row => fragment.appendChild(row));
    tableBody.appendChild(fragment);
    
});
