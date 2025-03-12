class Language{
    static all_languages = []; // initialisation de all_languages

    constructor(codeISO_2, name){
        this._codeISO_2 = codeISO_2;
        this._nom = name;
    }

    toString(){
        return `${this._nom} (${this._codeISO_2})`;
    }

    static fill_languages(){

        const uniqueLanguages = new Map();

        countries.forEach(country => {
            country.languages?.forEach(language => {
                if(!uniqueLanguages.has(language.iso639_2)){
                    uniqueLanguages.set(language.iso639_2, new Language(language.iso639_2,language.name));
                }
            });
        });

        this.all_languages = Array.from(uniqueLanguages.entries());

    }
}

Language.fill_languages();

Language.all_languages.forEach(([code, language]) => {
    console.log(language.toString());
})