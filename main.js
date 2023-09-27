const pokeAudio = new Audio('./assets/pokemonAudio.mp3');

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

// ****  FETCH FOR LIGHTBOX  ****
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

// ****  NAV  ****
// FORM SELECT OPTION
let type = 'all';
let pokemonArray = [];

const form = document.querySelector('#form');

function formButton() {
    let div = document.createElement('div');

    div.innerHTML =
        `
            <div>
                <img src="./assets/pokemonLogo.png" alt="">
            </div>
            <div class="inpBtn">
                <p>Type:</p>
                <select name="Type" id="type">
                    <option value="all">All</option>
                    <option value="normal">Normal</option>
                    <option value="fighting">Fighting</option>
                    <option value="flying">Flying</option>
                    <option value="poison">Poison</option>
                    <option value="ground">Ground</option>
                    <option value="rock">Rock</option>
                    <option value="bug">Bug</option>
                    <option value="ghost">Ghost</option>
                    <option value="steel">Steel</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="grass">Grass</option>
                    <option value="electric">Electric</option>
                    <option value="psychic">Psychic</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="dark">Dark</option>
                    <option value="fairy">Fairy</option>
                    <option value="unknown">Unknown</option>
                    <Option value="shadow">Shadow</Option>
                </select>
            </div>

            <div class="inpBtn">
                <div class="inputBox">
                    <input id="searchInput" type="text" required="required">
                    <h1 class="span">Pokémon Characters</h1>
                </div>
                <button id="searchButton">Search</button>
            </div>
        `

    div.classList.add('form');

    form.appendChild(div);
};

formButton();

const select = document.querySelector('#type');

select.addEventListener('change', () => {
    type = select.value
    if (type === 'all') {
        clean();
        printAll(pokemonArray);
    } else {
        clean();
        for (let i = 0; i < pokemonArray.length; i++) {
            if (pokemonArray[i].type === type) {
                templateCard(pokemonArray[i]);
                // console.log(pokemonArray[i]);
            };
        };
    };
});

// FORM BUTTON SEARCH
const searchButton = document.querySelector('#searchButton');

function searchPokemon() {
    let searchInput = document.querySelector('#searchInput').value.toLowerCase();
    // console.log(searchInput);

    loadPokemon(searchInput, (pokemon) => {
        // console.log(`pokemon.name:${pokemon.name} pokemon.id:${pokemon.id}`);
        loadMove(pokemon.id, (move) => {
            // console.log(`pokemon.name:${pokemon.name} move.id:${move.id} move.name:${move.name}`);
            loadSpecies(pokemon.id, (species) => {
                // console.log(`pokemon.name:${pokemon.name} species.id:${species.id} species.capture_rate:${species.capture_rate}`);
                loadAbility(pokemon.id, (ability) => {
                    // console.log(`pokemon.name:${pokemon.name} ability.id:${ability.id} ability.name:${ability.name}`);
                    templateLightbox(pokemon, move, species, ability);
                    pokeAudio.play();
                    document.querySelector('#searchInput').value = '';
                });
            });
        });
    });
};

searchButton.addEventListener('click', (event) => {
    event.preventDefault();
    searchPokemon();
});

// ****  MAIN  **** 
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
        const response = await fetch(`${baseUrl}/pokemon?limit=340`);
        const data = await response.json();
        const pokemonAll = data.results;

        for (const pokemon of pokemonAll) {
            const pokemonData = await fetchPokemonData(pokemon.url);
            createData(pokemonData);
            // console.log(pokemonData);
        };
        printAll(pokemonArray);
    } catch (error) {
        console.error('Error fetching PokemonData:', error);
    };
};

fetchAllPokemon();

function createData(pokemon) {
    // console.log(pokemon);
    const newPokemon = {
        name: pokemon.name,
        img: pokemon.sprites.front_default,
        type: pokemon.types[0].type.name
    };
    pokemonArray.push(newPokemon);
};

function templateCard(newPokemon) {
    let div = document.createElement('div');

    div.innerHTML =
        `
            <div class='box ${newPokemon.type}' onclick='btn_card(this)' data-value='${newPokemon.name}'>
                <img src="${newPokemon.img}" alt="${newPokemon.name}">
                <h2>${newPokemon.name}</h2>
                <p>Type: ${newPokemon.type}</p>
            </div>
        `

    card.appendChild(div);
};

function btn_card(div) {
    let dataValue = div.getAttribute('data-value');
    // console.log(dataValue);

    loadPokemon(dataValue, (pokemon) => {
        // console.log(`pokemon.name:${pokemon.name} pokemon.id:${pokemon.id}`);
        loadMove(pokemon.id, (move) => {
            // console.log(`pokemon.name:${pokemon.name} move.id:${move.id} move.name:${move.name}`);
            loadSpecies(pokemon.id, (species) => {
                // console.log(`pokemon.name:${pokemon.name} species.id:${species.id} species.capture_rate:${species.capture_rate}`);
                loadAbility(pokemon.id, (ability) => {
                    // console.log(`pokemon.name:${pokemon.name} ability.id:${ability.id} ability.name:${ability.name}`);
                    templateLightbox(pokemon, move, species, ability);
                    pokeAudio.play();
                });
            });
        });
    });
};

function clean() {
    card.innerHTML = '';
};

function printAll(pokemons) {
    for (let i = 0; i < pokemons.length; i++) {
        templateCard(pokemons[i]);
    };
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
                        <span>Skill Description:</span> ${ability.effect_entries.find(en => en.language.name === 'en').effect}
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
        pokeAudio.pause();
        pokeAudio.currentTime = 0;
        lightbox.removeChild(div);
    });
};

// FOOTER
const footer = document.querySelector('.footer');

function templateFooter() {
    let github = "https://github.com/EdgarSagom/Pokedex";
    let instagram = "https://www.instagram.com/edgarsagom/";
    let twitter = "https://twitter.com/SagomEdgar";
    let pokeapi = "https://pokeapi.co/";

    let div = document.createElement('div');

    div.innerHTML =
        `
            <h4> Created by: Edgar Sagom</h4>
            <div>
                <p>Contacts:</p>
                <a href="${github}" target="_blank" rel="noopener noreferrer">
                    <img src="./assets/github.svg" alt="Github Logo">
                </a>
                <a href="${instagram}" target="_blank" rel="noopener noreferrer">
                    <img src="./assets/instagram.svg" alt="Instagram Logo">
                </a>
                <a href="${twitter}" target="_blank" rel="noopener noreferrer">
                    <img src="./assets/twitter.svg" alt="Twitter Logo">
                </a>
                <p>API Pokémon:<a href="${pokeapi}" target="_blank" rel="noopener noreferrer">${pokeapi}</a></p>
                <p class="copy">©2023 Pokémon. ©1995 - 2023 Nintendo/Creatures Inc./GAME FREAK inc. TM, ®Nintendo.
                </p>
            </div>
        `
    footer.appendChild(div);
};

templateFooter();