class Currency {
    static all_currencies = []; // initialisation de all_currencies

    constructor(code, nom, symbole) {
        this._code = code;
        this._nom = nom;
        this._symbole = symbole;
    }

    toString() {
        return `${this._code} , ${this._nom} , ${this._symbole}`;
    }


    static fill_currencies() {
        const uniqueCurrencies = [];

        countries.forEach(country => {
            country.currencies?.forEach(currency => {
                // Vérification si la devise existe déjà dans le tableau
                if (!uniqueCurrencies.some(c => c._code === currency.code)) {
                    // Ajout de la devise dans le tableau
                    uniqueCurrencies.push(new Currency(currency.code, currency.name, currency.symbol));
                }
            });
        });

        // Stockage du tableau dans all_currencies
        this.all_currencies = uniqueCurrencies;
    }
}

Currency.fill_currencies();

Currency.all_currencies.forEach(currency => {
    // console.log(currency._code);
    // console.table(currency.toString()); // test de la méthode toString() sur chaque objet (et ça fonctione :) )
});