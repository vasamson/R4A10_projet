countries.forEach(country => {
    country.currencies?.forEach(currency => {
        console.log(currency.code, currency.name);
    });
});