document.addEventListener("DOMContentLoaded", function () {
    if (typeof Currency !== 'undefined' && typeof Language !== 'undefined' && typeof countries !== 'undefined') {
        
        // Remplir les informations sur les devises et les langues
        Currency.fill_currencies();
        Language.fill_languages();

        // Conteneur d'affichage
        const countriesContainer = document.getElementById("countries-list");

        // Associer chaque pays avec ses devises et langues
        countries.forEach(country => {
            let countryDiv = document.createElement("div");
            countryDiv.classList.add("country-card");
            
            let countryCurrencies = country.currencies.map(code => {
                let currency = Currency.all_currencies.get(code);
                return currency ? `${currency._nom} (${currency._code}) - ${currency._symbole}` : "Inconnu";
            }).join(", ");

            let countryLanguages = country.languages.map(code => {
                let language = Language.all_languages.get(code);
                return language ? `${language._nom} (${language._codeISO_2})` : "Inconnu";
            }).join(", ");
            
            countryDiv.innerHTML = `
                <h3>${country.nom}</h3>
                <p><strong>Devises :</strong> ${countryCurrencies}</p>
                <p><strong>Langues :</strong> ${countryLanguages}</p>
            `;

            countriesContainer.appendChild(countryDiv);
        });
    } else {
        console.error("Les classes ou les données des pays ne sont pas définies.");
    }
});
