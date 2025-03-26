fetch('countries.js')
    .then(response => response.json())
    .then(countries => {
        const tbody = document.getElementById('countries-list');
        tbody.innerHTML = countries.map(country => 
            `<tr><td>${country.translations.fr || country.name}</td></tr>`
        ).join('');
    })
    .catch(error => console.error('Erreur de chargement des pays:', error));