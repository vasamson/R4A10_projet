// Assurez-vous que les classes Currency et Language sont bien définies dans leurs fichiers respectifs
// et que les données de 'countries' sont disponibles.
document.addEventListener("DOMContentLoaded", function () {
    // S'assurer que les classes et données sont disponibles
    if (typeof Currency !== 'undefined' && typeof Language !== 'undefined' && typeof countries !== 'undefined') {

        // Remplir les informations sur les devises et les langues
        Currency.fill_currencies();  // Remplir la liste des devises
        Language.fill_languages();   // Remplir la liste des langues

        // Récupérer les éléments du DOM pour l'affichage
        const currenciesContainer = document.getElementById("currencies-list");
        const languagesContainer = document.getElementById("languages-list");

        // Afficher les devises
        Currency.all_currencies.forEach(([code, currency]) => {
            let currencyDiv = document.createElement("div");
            currencyDiv.classList.add("currency-card");
            currencyDiv.innerHTML = `
                <p><strong>${currency._nom}</strong> (${currency._code}) - ${currency._symbole}</p>
            `;
            currenciesContainer.appendChild(currencyDiv);
        });

        // Afficher les langues
        Language.all_languages.forEach(([code, language]) => {
            let languageDiv = document.createElement("div");
            languageDiv.classList.add("language-card");
            languageDiv.innerHTML = `
                <p><strong>${language._nom}</strong> (${language._codeISO_2})</p>
            `;
            languagesContainer.appendChild(languageDiv);
        });

    } else {
        console.error("Les classes ou les données des pays ne sont pas définies.");
    }
});