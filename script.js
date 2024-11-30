let countries = [];
let currentCountry = {};
let usedCountries = [];

const startButton = document.getElementById('start-button');
const homeScreen = document.getElementById('home-screen');
const gameScreen = document.getElementById('game-screen');
const flagImage = document.getElementById('flag-image');
const countryInput = document.getElementById('country-input');
const submitButton = document.getElementById('submit-button');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('next-button');
const factSection = document.getElementById('fact-section');
const countryFact = document.getElementById('country-fact');

// Inizia il gioco dopo aver caricato i dati
startButton.addEventListener('click', () => {
    homeScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    // Carica i dati dei Paesi
    fetchCountries();
});

// Funzione per recuperare i dati dei Paesi dall'API
function fetchCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            countries = data.map(country => ({
                name: country.translations.ita.common || country.name.common,
                flag: country.flags.svg,
                fact: generateRandomFact(country)
            }));
            // Carica la prima bandiera
            loadNewFlag();
        })
        .catch(error => {
            console.error('Errore nel recupero dei dati:', error);
        });
}

// Funzione per generare una curiosità casuale
function generateRandomFact(country) {
    const facts = [
        `La capitale è ${country.capital ? country.capital[0] : 'sconosciuta'}.`,
        `Si trova nella regione ${country.region}.`,
        `Ha una popolazione di circa ${country.population.toLocaleString()} abitanti.`,
        `La lingua ufficiale è ${country.languages ? Object.values(country.languages)[0] : 'sconosciuta'}.`,
        `La valuta è ${country.currencies ? Object.values(country.currencies)[0].name : 'sconosciuta'}.`,
        `Il suo dominio internet è ${country.tld ? country.tld[0] : 'sconosciuto'}.`,
        `La superficie totale è di ${country.area ? country.area.toLocaleString() : 'sconosciuta'} km².`
    ];
    return facts[Math.floor(Math.random() * facts.length)];
}

// Carica una nuova bandiera
function loadNewFlag() {
    feedback.textContent = '';
    factSection.style.display = 'none';
    countryInput.value = '';

    // Se tutti i Paesi sono stati usati, resetta la lista
    if (usedCountries.length === countries.length) {
        usedCountries = [];
    }

    // Seleziona un Paese non ancora usato
    do {
        currentCountry = countries[Math.floor(Math.random() * countries.length)];
    } while (usedCountries.includes(currentCountry));

    usedCountries.push(currentCountry);
    flagImage.src = currentCountry.flag;
}

// Normalizza le stringhe per la verifica
function normalizeString(str) {
    return str
        .toLowerCase()
        .normalize('NFD') // Decompone caratteri Unicode (es. à -> a + `)
        .replace(/[\u0300-\u036f]/g, '') // Rimuove i segni diacritici
        .replace(/[^a-z\s]/g, '') // Rimuove caratteri non alfabetici
        .trim();
}

// Verifica la risposta dell'utente
submitButton.addEventListener('click', () => {
    const userAnswer = normalizeString(countryInput.value);
    const correctAnswer = normalizeString(currentCountry.name);

    if (userAnswer === correctAnswer) {
        feedback.textContent = 'Esatto!';
        factSection.style.display = 'block';
        countryFact.textContent = currentCountry.fact;
    } else {
        feedback.textContent = 'Riprova!';
    }
});

// Carica la prossima bandiera
nextButton.addEventListener('click', loadNewFlag);
