class Country {
    static all_countries = new Map(); // Utilisation d'une Map au lieu d'un tableau

    constructor(code_alpha3, nom, capitale, continent, population, pays_voisins = []) {
        this._code_alpha3 = code_alpha3;
        this._nom = nom;
        this._capitale = capitale;
        this._continent = continent;
        this._population = population;
        this._pays_voisins = pays_voisins; // LISTE D'OBJETS Country
    }

    static fill_countries(countries) {
        Country.all_countries.clear(); // Réinitialisation au cas où

        // 1. Création des objets Country et stockage dans la Map
        countries.forEach(country => {
            let countryObj = new Country(
                country.alpha3Code,
                country.translations.fr,
                country.capital,
                country.region,
                country.population
            );
            Country.all_countries.set(country.alpha3Code, countryObj);
        });

        // 2. Mise à jour des voisins pour chaque pays
        countries.forEach(country => {
            let countryObj = Country.all_countries.get(country.alpha3Code);
            if (countryObj) {
                countryObj._pays_voisins = country.borders
                    .map(code => Country.all_countries.get(code)) // Récupère les objets Country correspondants
                    .filter(neighbor => neighbor !== undefined); // Filtre les cas inexistants
            }
        });
    }
}

Country.fill_countries();
Country.all_countries.forEach()