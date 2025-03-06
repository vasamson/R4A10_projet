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
        // la constante "countries" est accessible

        const uniqueCurrencies = new Map();

        countries.forEach(country => {
            country.currencies?.forEach(currency => {
                if (!uniqueCurrencies.has(currency.code)) {
                    uniqueCurrencies.set(currency.code, new Currency(currency.code, currency.name, currency.symbol));
                }
            });
        });

        this.all_currencies = Array.from(uniqueCurrencies.values());
    }
}

// ✅ Exécution de la méthode statique
Currency.fill_currencies();

// ✅ Affichage de toutes les devises uniques
console.table(Currency.all_currencies);
