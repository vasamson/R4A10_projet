/* QUESTION 1 : outsideTheContinent
*
* La fonction parcourt chaque pays de Country.all_countries
* Pour chaque voisin, si l'un d'eux n'a pas la même région (continent), on ajoute le pays dans un tableau
*/

function outsideTheContinent(){
    tabOutside = [];
    Country.all_countries.forEach((countryObj,code) => {
        countryObj._pays_voisins.forEach(pays => {
            if(pays._continent !== countryObj._continent){
                tabOutside.push(countryObj);
            }
        });
    })

    return tabOutside;
}

/* QUESTION 2 : moreNeighbors
*
* La fonction parcourt chaque pays de Country.all_countries
* On compte le nombre de voisins.
* Si le pays parcouru a + de voisins que le pays précédent
*
*/

function moreNeighbors(){
    tabMoreNeighbors = [];
    var maxVoisins = 0;
    var nbVoisins = 0;

    Country.all_countries.forEach((countryObj, code) => {
        nbVoisins = countryObj._pays_voisins.length;

        if(nbVoisins > maxVoisins){
            maxVoisins = nbVoisins;
        }
    });

    // maintenant qu'on a le maximum, on récupère chaque pays ayant ce nombre de voisins

    Country.all_countries.forEach((countryObj, code) => {
        var nbVoisins = countryObj._pays_voisins.length;
        
        if(nbVoisins === maxVoisins){
            tabMoreNeighbors.push(countryObj);
        }
    });

    return tabMoreNeighbors;
}

// console.log(moreNeighbors());

/* QUESTION 3 : neighborless
*
* La fonction parcourt chaque pays de Country.all_countries
* Si la longueur de _pays_voisins === 0, alors le tableau est vide, et le pays n'a pas de voisins
*
*/

function neighborless(){
    tabNeighborless = [];

    Country.all_countries.forEach((countryObj, code) => {
        if(countryObj._pays_voisins.length === 0){
            tabNeighborless.push(countryObj);
        }
    });

    return tabNeighborless;
}

// console.log(neighborless());

/* QUESTION 4 : moreLanguages()
*
* La fonction parcourt chaque pays de Country.all_countries
* On récupère d'abord le plus grand nombre de langues parlées.
* Pour chaque pays ayant ce nombre de langues, on stocke le pays, et on affiche les langues parlées.
*
*/

function moreLanguages(){
    tabMoreLangues = [];
    var maxLangues = 0;
    var nbLangues = 0;

    Country.all_countries.forEach((CountryObj, code) => {
        nbLangues = CountryObj.getLanguages().length;

        if(nbLangues > maxLangues){
            maxLangues = nbLangues;
        }
    });

    Country.all_countries.forEach((CountryObj, code) => {
        nbLangues = CountryObj.getLanguages().length;

        if(nbLangues === maxLangues){
            tabMoreLangues.push(CountryObj);
            console.table(CountryObj.getLanguages());
/*             CountryObj.getLanguages().forEach(language => {
                console.table(language.toString());
            }) */
        }
    })

    return tabMoreLangues;
}

// console.table(moreLanguages());

/* QUESTION 5 : withCommonLanguage()
*
* La fonction parcourt chaque pays de Country.all_countries
* Pour chaque voisin, si getLanguages() contient au moins une langue commune
*
*/

function withCommonLanguage() {
    let tabCommonLanguage = new Set();

    Country.all_countries.forEach((CountryObj) => {
        let tabLanguages = CountryObj.getLanguages();

        CountryObj._pays_voisins.forEach((pays) => {
            let tabLanguagesVoisin = pays.getLanguages();

            if (tabLanguages.some(value => tabLanguagesVoisin.includes(value))) {
                tabCommonLanguage.add(CountryObj); // Utilisation d'un Set
            }
        });
    });

    return Array.from(tabCommonLanguage); // Convertir le Set en tableau pour l'affichage
}

// console.table(withCommonLanguage());


/* QUESTION 6 : withoutCommonCurrency()
*
* La fonction parcourt chaque pays de Country.all_countries
* Pour chaque voisin, si getCurrency() ne contient aucune monnaie commune...
*
*/

function withoutCommonCurrency(){
    let tabNotCommonCurrency = [];

    Country.all_countries.forEach((CountryObj) => {
        let tabMonnaies = CountryObj.getCurrencies();

        CountryObj._pays_voisins.forEach((pays) => {
            let tabMonnaiesVoisins = pays.getCurrencies();

            if(tabMonnaies.some(value => tabMonnaiesVoisins.includes(value))){
                tabNotCommonCurrency.push(CountryObj);
            }
        })
    })
}

/* QUESTION 7 : sortingDecreasingDensity()
*
* La fonction parcourt chaque pays de Country.all_countries
* Et renvoie le tableau dans l'ordre décroissant par rapport à la densité de population
*
*/

function sortingDecreasingDensity(){
    let tabOrdonne = [];

    Country.all_countries.forEach((CountryObj) => {
        if(isNaN(CountryObj.getPopDensity())){
            tabOrdonne.push(-1);
        } else {
            tabOrdonne.push(CountryObj.getPopDensity());
        }
    })

    tabOrdonne.sort((a,b) => b - a);

    return tabOrdonne;
}

// console.table(sortingDecreasingDensity());