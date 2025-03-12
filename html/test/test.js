// Assurez-vous que les classes Currency et Language sont bien définies dans leurs fichiers respectifs
// et que les données de 'countries' sont disponibles.

document.addEventListener("DOMContentLoaded", function () {
        if (typeof CurrencyManager !== 'undefined' && typeof LanguageManager !== 'undefined') {

            // Remplir les devises et langues
            CurrencyManager.fill_currencies(countries);
            LanguageManager.fill_languages(countries);
            
            const container = document.getElementById("countries-list");

            countries.forEach(country => {
                let countryDiv = document.createElement("div");
                countryDiv.classList.add("country-card");

                // Récupération des devises 
                let currencies = country.currencies && country.currencies.length > 0 ?
                    country.currencies.map(currency => `${currency.name} (${currency.symbol})`).join(", ") :
                    "Aucune devise";

                // Récupération des langues 
                let languages = country.languages && country.languages.length > 0 ?
                    country.languages.map(language => `${language.name}`).join(", ") :
                    "Aucune langue";

                // Récupération des informations du pays
                let countryInfo = new Country(
                    country.alpha3Code,
                    country.translations.fr || country.name,
                    country.capital,
                    country.region,
                    country.population,
                ).toString();

                countryDiv.innerHTML = `
                    <p><strong>${country.name}</strong></p>
                    <p><span>Capital :</span> ${country.capital || "Inconnu"}</p>
                    <p><span>Région :</span> ${country.region || "Inconnue"}</p>
                    <p><span>Population :</span> ${country.population.toLocaleString() || "Inconnue"}</p>
                    <p><span>Devises :</span> ${currencies}</p>
                    <p><span>Langues :</span> ${languages}</p>
                `;

                container.appendChild(countryDiv);
            });

            console.log("Toutes les informations ont été affichées !");
        } else {
            console.error("CurrencyManager ou LanguageManager non défini.");
        }
    });
