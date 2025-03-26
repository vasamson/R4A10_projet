document.addEventListener("DOMContentLoaded", function() {
    const tableBody = document.getElementById("countries-list");
    
    if (!Country || !Country.all_countries) {
        console.error("Les données des pays ne sont pas disponibles.");
        return;
    }

    Country.all_countries.forEach(countryObj => {
        const row = document.createElement("tr");
        
        row.innerHTML = `<td>${countryObj._nom}</td>`;
        
        tableBody.appendChild(row);
    });
});
