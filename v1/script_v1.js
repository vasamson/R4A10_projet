document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("countries-list");
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    Country.all_countries.forEach(countryObj => {
        const row = document.createElement("tr");
        
        row.innerHTML = `<td>${countryObj._nom}</td>`;
        row.innerHTML += `<td>${countryObj._population}</td>`;
        row.innerHTML += `<td>${countryObj.getSruface()}</td>`;
        row.innerHTML += `<td>${countryObj.getPopDensity()}</td>`;
        row.innerHTML += `<td>${countryObj._continent}</td>`;
        row.innerHTML += `<td><img src="${countryObj.getFlags()}" alt="Drapeau de ${countryObj._nom}" style="width: 50px; height: auto;"></td>`;
        tableBody.appendChild(row);
    });
});
