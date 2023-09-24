// ****  HEADER  ****
// SLIDER
const slider = document.querySelector('.slider');
let sliderSection = document.querySelectorAll('.slider_section');
let sliderSectionLast = sliderSection[sliderSection.length - 1];

const btnLeft = document.querySelector('.slider_btn-left');
const btnRight = document.querySelector('.slider_btn-right');

slider.insertAdjacentElement('afterbegin', sliderSectionLast);

function next() {
    let sliderSectionFirst = document.querySelectorAll('.slider_section')[0];
    slider.style.marginLeft = '-200%';
    slider.style.transition = 'all 0.5s';
    setTimeout(function () {
        slider.style.transition = 'none';
        slider.insertAdjacentElement('beforeend', sliderSectionFirst);
        slider.style.marginLeft = '-100%';
    }, 500);
};

function prev() {
    let sliderSection = document.querySelectorAll('.slider_section');
    let sliderSectionLast = sliderSection[sliderSection.length - 1];
    slider.style.marginLeft = '0';
    slider.style.transition = 'all 0.5s';
    setTimeout(function () {
        slider.style.transition = 'none';
        slider.insertAdjacentElement('afterbegin', sliderSectionLast);
        slider.style.marginLeft = '-100%';
    }, 500);
};

btnRight.addEventListener('click', (event) => {
    event.preventDefault();
    next();
});

btnLeft.addEventListener('click', (event) => {
    event.preventDefault();
    prev();
});

setInterval(function () {
    next();
}, 5000);

// ****  MAIN  **** 
// FETCH FOR LIGHTBOX
const loadPokemon = (id, pokemonData) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            pokemonData(data);
        }).catch(error => console.error('Error Fetch pokemon:', error));
};

const loadMove = (id, pokemonData) => {
    fetch(`https://pokeapi.co/api/v2/move/${id}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            pokemonData(data);
        }).catch(error => console.error('Error Fetch move:', error));
};

const loadSpecies = (id, pokemonData) => {
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            pokemonData(data);
        }).catch(error => console.error('Error Fetch pokemon-species:', error));
};

const loadAbility = (id, pokemonData) => {
    fetch(`https://pokeapi.co/api/v2/ability/${id}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            pokemonData(data);
        }).catch(error => console.error('Error Fetch ability:', error));
};

// CARDS
const baseUrl = 'https://pokeapi.co/api/v2';
const card = document.querySelector('.card');

async function fetchPokemonData(url) {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
};

async function fetchAllPokemon() {
    try {
        const response = await fetch(`${baseUrl}/pokemon?limit=140`); /* Fetching the first 350 Pokémon for this example. `${baseUrl}/pokemon?limit=350` Limit number*/
        const data = await response.json();
        const pokemonAll = data.results;

        for (const pokemon of pokemonAll) {
            const pokemonData = await fetchPokemonData(pokemon.url);
            // console.log(pokemonData);
            templateCard(pokemonData);
        };
    } catch (error) {
        console.error('Error fetching PokemonData:', error);
    };
};

fetchAllPokemon();

function templateCard(pokemonData) {
    let div = document.createElement('div');
    let type = pokemonData.types[0].type.name;

    div.innerHTML =
        `
            <div class='box ${type}' onclick='btn_card(this)' data-value='${pokemonData.name}'>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h2>${pokemonData.name}</h2>
                <p>Type: ${type}</p>
            </div>
        `

    card.appendChild(div);
};

function btn_card(div) {
    let dataName = div.getAttribute('data-value');
    // console.log(dataName);

    loadPokemon(dataName, (pokemon) => {
        // console.log(`pokemon.name:${pokemon.name} pokemon.id:${pokemon.id}`);
        loadMove(pokemon.id, (move) => {
            // console.log(`pokemon.name:${pokemon.name} move.id:${move.id} move.name:${move.name}`);
            loadSpecies(pokemon.id, (species) => {
                // console.log(`pokemon.name:${pokemon.name} species.id:${species.id} species.capture_rate:${species.capture_rate}`);
                loadAbility(pokemon.id, (ability) => {
                    // console.log(`pokemon.name:${pokemon.name} ability.id:${ability.id} ability.name:${ability.name}`);
                    templateLightbox(pokemon, move, species, ability);
                });
            });
        });
    });
};

// LIGHTBOX
const lightbox = document.querySelector('.lightbox');

function templateLightbox(pokemon, move, species, ability) {
    let div = document.createElement('div');
    let type = pokemon.types[0].type.name;

    div.innerHTML =
        `
            <span class="btnClose ${type} ${type}Light">&times;</span>
            <div class="infoContainer">
                <div class="nameImg">
                    <h2 class="${type}Light"><span>${pokemon.name}<span></h2>
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p><span>Type:</span> ${type}</p>
                </div>
                <div class="info">
                    <p>
                        <span>Pokemon id:</span> ${pokemon.id} <br>
                        <span>Base Experience:</span> ${pokemon.base_experience} <br>
                        <span>Height:</span> ${pokemon.height}
                        <span>Weight:</span> ${pokemon.weight} <br>
                        <span>Hp:</span> ${pokemon.stats[0].base_stat} 
                        <span>Attack:</span> ${pokemon.stats[1].base_stat} 
                        <span>Defense:</span> ${pokemon.stats[2].base_stat} <br>
                        <span>Special Attack:</span> ${pokemon.stats[3].base_stat} <br> 
                        <span>Special Defense:</span> ${pokemon.stats[4].base_stat} <br> 
                        <span>Speed:</span> ${pokemon.stats[5].base_stat} 
                        <span>Accuracy:</span> ${move.accuracy} <br> 
                        <span>Move:</span> ${move.name} <span>Color:</span> ${species.color.name} <br>
                        <span>Damage Class:</span> ${move.damage_class.name} <br>
                        <span>Base Happiness:</span> ${species.base_happiness} <br>
                        <span>Capture Rate:</span> ${species.capture_rate} <br>
                        <span>Habitat:</span> ${species.habitat.name} <br>
                        <span>Growth rate:</span> ${species.growth_rate.name} <br>
                        <span>Main Skill:</span> ${ability.name} <br>
                        <span>Skill Description:</span> ${ability.effect_entries[1].effect}
                    </p>
                </div>
            </div>
        `

    div.classList.add('lightboxContainer');
    div.classList.add(`${type}Light`);

    lightbox.style.opacity = 1;
    lightbox.style.visibility = 'visible';
    lightbox.appendChild(div);

    let btnClose = document.querySelector('.btnClose');
    btnClose.addEventListener('pointerdown', () => {
        lightbox.style.opacity = 0;
        lightbox.style.visibility = 'hidden';
        lightbox.removeChild(div);
    });
};
