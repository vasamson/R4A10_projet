document.addEventListener("DOMContentLoaded", function () {
    // S'assurer que les classes et données sont disponibles
    if (typeof Currency !== 'undefined' && typeof Language !== 'undefined' && typeof countries !== 'undefined') {

        // Remplir les informations sur les devises et les langues
        Currency.fill_currencies();  // Remplir la liste des devises
        Language.fill_languages();   // Remplir la liste des langues
        Country.fill_countries();

        // Récupérer les éléments du DOM pour l'affichage
        const currenciesContainer = document.getElementById("currencies-list");
        const languagesContainer = document.getElementById("languages-list");
        const countriesCountainer = document.getElementById("countries-list");

        // Afficher les devises
/*         Currency.all_currencies.forEach(([code, currency]) => {
            let currencyDiv = document.createElement("div");
            currencyDiv.classList.add("currency-card");
            currencyDiv.innerHTML = `
                <p><strong>${currency._nom}</strong> (${currency._code}) - ${currency._symbole}</p>
            `;
            currenciesContainer.appendChild(currencyDiv);
        }); */

        // Afficher les langues
        Language.all_languages.forEach(language => {
            let languageDiv = document.createElement("div");
            languageDiv.classList.add("language-card");
            languageDiv.innerHTML = `
                <p><strong>${language._nom}</strong> (${language._codeISO_2})</p>
            `;
            languagesContainer.appendChild(languageDiv);
        });

        Country.all_countries.forEach((pays, code) => {
            let countryDiv = document.createElement("div");
            countryDiv.classList.add("currency-card");
            countryDiv.innerHTML = `
                <p><strong>${pays._nom}</strong></p>
                <img src="${pays.getFlags()}">
            `;
            countriesCountainer.appendChild(countryDiv);
        });
        

    } else {
        console.error("Les classes ou les données des pays ne sont pas définies.");
    }
});