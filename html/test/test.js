document.addEventListener("DOMContentLoaded", function () {
    if (typeof Currency !== 'undefined' && typeof Language !== 'undefined' && typeof countries !== 'undefined') {
        
        // Remplir les données
        Currency.fill_currencies();
        Language.fill_languages();

        // Vérifier si les données existent
        if (!Currency.all_currencies || !Language.all_languages) {
            console.error("Les données de Currency ou Language sont vides.");
            return;
        }

        const countriesContainer = document.getElementById("countries-list");
        if (!countriesContainer) {
            console.error("L'élément avec id 'countries-list' est introuvable dans le DOM.");
            return;
        }

        countries.forEach(country => {
            let countryDiv = document.createElement("div");
            countryDiv.classList.add("country-card");
            
            let countryCurrencies = country.currencies.map(code => {
                let currency = Currency.all_currencies[code]; // Utilisation de l'accès par clé d'objet
                return currency ? `${currency._nom} (${currency._code}) - ${currency._symbole}` : "Inconnu";
            }).join(", ");

            let countryLanguages = country.languages.map(code => {
                let language = Language.all_languages[code]; // Utilisation de l'accès par clé d'objet
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
        console.error("Les classes Currency, Language ou les données countries ne sont pas définies.");
    }
});
