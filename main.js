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
        }
    } catch (error) {
        console.error('Error fetching Pokemon data:', error);
    };
};

fetchAllPokemon();

function templateCard(pokemonData) {
    let div = document.createElement('div');
    let type = pokemonData.types[0].type.name;

    div.innerHTML = `
            <div onclick='btn_card(this)' data-value='${pokemonData.name}'>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <h2>${pokemonData.name}</h2>
                <p>Type: ${type}</p>
            </div>
            `

    div.classList.add('box');

    // console.log(type);
    if (type === 'normal') {
        div.classList.add(type);
    } else if (type === 'fighting') {
        div.classList.add(type);
    } else if (type === 'flying') {
        div.classList.add(type);
    } else if (type === 'poison') {
        div.classList.add(type);
    } else if (type === 'ground') {
        div.classList.add(type);
    } else if (type === 'rock') {
        div.classList.add(type);
    } else if (type === 'bug') {
        div.classList.add(type);
    } else if (type === 'ghost') {
        div.classList.add(type);
    } else if (type === 'steel') {
        div.classList.add(type);
    } else if (type === 'fire') {
        div.classList.add(type);
    } else if (type === 'water') {
        div.classList.add(type);
    } else if (type === 'grass') {
        div.classList.add(type);
    } else if (type === 'electric') {
        div.classList.add(type);
    } else if (type === 'psychic') {
        div.classList.add(type);
    } else if (type === 'ice') {
        div.classList.add(type);
    } else if (type === 'dragon') {
        div.classList.add(type);
    } else if (type === 'dark') {
        div.classList.add(type);
    } else if (type === 'fairy') {
        div.classList.add(type);
    } else if (type === 'unknown') {
        div.classList.add(type);
    } else if (type === 'shadow') {
        div.classList.add(type);
    };

    card.appendChild(div);
};

function btn_card(div) {
    let dataName = div.getAttribute('data-value');
    console.log(dataName);
}