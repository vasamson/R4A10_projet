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

        const uniqueLanguages = [];

        countries.forEach(country => {
            country.languages?.forEach(language => {
                if(!uniqueLanguages.some(c => c._codeISO_2 === language.iso639_2)){
                    uniqueLanguages.push(new Language(language.iso639_2, language.name));
                }
            });
        });

        this.all_languages = uniqueLanguages;

    }
}

Language.fill_languages();

// console.table(Language.all_languages);