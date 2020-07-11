import funciones from "./data.js";

let datosPokemon;

// EJECUCION
funciones.loadJSON((res) => {
  datosPokemon = JSON.parse(res).pokemon; //PARSEAR EL JSON PQ LO QUE RECIBO ES UN STRING GIGANTE
});

const main = document.getElementById("contenedorTodaData");

const containerPokemones = document.getElementById("pokemones");

const modal = document.getElementById("modal");
const botonCerrarModal = document.getElementById("cerrar");

const botones = document.getElementById("contenedorBotones");
const botonSiguiente = document.getElementById("siguiente");
const botonAnterior = document.getElementById("anterior");
const menuHamburguesa = document.getElementById("menuTrigger");

const selectFiltrar = document.getElementById("buscar__type");
const ordenar = document.getElementById("ordenarPorNombre");

let pokemonesPorPagina = 12;
const separacionPaginas = Math.ceil(datosPokemon.length / pokemonesPorPagina);

let paginaInicial = 1;
let vistaInicial;

function agregarEscuchador() {
  const links = document.querySelectorAll(".header__link");
  links.forEach((link) => link.addEventListener("click", cambiarVista));
}

function cambiarVista(evento) {
  const linkActivo = document.querySelector(".header__link__active");

  document
    .querySelectorAll(".paginas")
    .forEach((vista) => vista.classList.add("hidden"));
  linkActivo.classList.remove("header__link__active");
  cerrarModal();

  const enlace = evento.target;
  const vista = enlace.getAttribute("href").slice(1);

  enlace.classList.add("header__link__active");
  document.getElementById(vista).classList.remove("hidden");

  if (vista === "pokedex" || vista === "ordenar") {
    botones.classList.remove("hidden");
  } else if (vista === "datos") {
    mostrarGraficas();
    botones.classList.add("hidden");
  } else {
    botones.classList.add("hidden");
  }

  paginaInicial = 1;
  vistaInicial = vista;
  menu();
  mostrarPokemon(vistaInicial);
}

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size); //intervalo del array
}

function crearPokemonCard(pokemon) {
  const card = document.createElement("article");
  const container = document.createElement("div");
  // NOMBRE DE CLASE
  const containerTitulo = document.createElement("div");

  const image = document.createElement("img");
  image.src = `${pokemon.img}`;
  image.setAttribute("class", "card__image");

  const nombre = document.createElement("h2");
  nombre.innerHTML = `${pokemon.name}`;
  nombre.setAttribute("class", "pintarTitulo");

  const id = document.createElement("h3");
  id.innerHTML = ` ${pokemon.id}`;

  const tipo = document.createElement("h3");
  tipo.innerHTML = `Tipo: ${pokemon.type.join(", ")}`;

  const debilidades = document.createElement("h3");
  debilidades.innerHTML = `Debilidad: ${pokemon.weaknesses.join(", ")}`;
  debilidades.setAttribute("class", "debilidades");

  containerTitulo.appendChild(nombre);
  containerTitulo.appendChild(id);
  containerTitulo.setAttribute("class", "container__flex");

  container.appendChild(containerTitulo);
  container.appendChild(tipo);
  container.appendChild(debilidades);
  container.setAttribute("class", "card__info");

  card.appendChild(image);
  card.appendChild(container);
  card.setAttribute("class", "card__container");

  card.addEventListener("click", () => abrirModal(pokemon));

  return card;
}

function mostrarPokemon(vista) {
  let datosAPintar;
  let contenedorPokemones;
  let pagination;

  if (vista === "ordenar") {
    const containerPokemonesOrdenados = document.getElementById(
      "pokemonesOrdenados"
    );
    containerPokemonesOrdenados.innerHTML = "";
    contenedorPokemones = containerPokemonesOrdenados;
    let formaOrdenar = ordenar.value;
    const d = datosPokemon.slice();
    datosAPintar = funciones.sortData(d, "name", formaOrdenar);
    pokemonesPorPagina = 12;
  } else if (vista === "buscar") {
    const pruebaFiltro = document.getElementById("pruebaFiltro");
    pruebaFiltro.innerHTML = "";
    let valorSelect = selectFiltrar.value;
    const d = datosPokemon.slice();
    datosAPintar = funciones.filterData(d, valorSelect);
    contenedorPokemones = pruebaFiltro;
    pokemonesPorPagina = 26;
  } else {
    borrarContenido();
    datosAPintar = datosPokemon;
    contenedorPokemones = containerPokemones;
  }

  pagination = paginate(datosAPintar, pokemonesPorPagina, paginaInicial);
  pagination.forEach((pokemon) => {
    contenedorPokemones.appendChild(crearPokemonCard(pokemon));
  });
}

function borrarContenido() {
  containerPokemones.innerHTML = "";
}

function revisarBotonSiguiente(pagina) {
  botonSiguiente.style.display =
    pagina + 1 > separacionPaginas ? "none" : "block";
}

function revisarBotonAtras(pagina) {
  botonAnterior.style.display = pagina - 1 === 0 ? "none" : "block";
}

function cambiarPagina(event, vista) {
  window.scrollTo(0, 0);
  borrarContenido();
  if (event.target.id === "siguiente") {
    paginaInicial++;
  } else {
    paginaInicial--;
  }

  mostrarPokemon(vista);
  revisarBotonAtras(paginaInicial);
  revisarBotonSiguiente(paginaInicial);
  // menu()
}

function menu() {
  document.getElementById("menu").classList.toggle("header__menu__position");
}

function abrirModal(pokemon) {
  modal.classList.remove("hidden");
  main.classList.add("hidden");
  pintarPokemonEnModal(pokemon);
}

function cerrarModal() {
  modal.classList.add("hidden");
  main.classList.remove("hidden");
}

function pintarPokemonEnModal(pokemon) {
  window.scrollTo(0, 0);

  const infoPokemon = document.getElementsByClassName(
    "modal__pokemon__info"
  )[0];

  infoPokemon.innerHTML = `<div class = "modal__container-img">
        <img class = "modal__img" src = "./image/pngflow.png" >
        <img class = "modal__image-pokemon" src = "${pokemon.img}">
    </div>
    <div class = "modal__container-info">
        <h2>${pokemon.name} ID. ${pokemon.id}</h2>
        <div class = "modal__features">
            <div>
                <p>Altura: <span> ${pokemon.height} </span></p>
                <p>Peso: <span> ${pokemon.weight} </span></p>
                <p>Caramelo: <span> ${pokemon.candy} </span></p>
                <p>Recuento de Caramelos: <span> ${
                  pokemon.candy_count
                } </span></p>
            </div>
            <div class = "modal__type">
                <p>Tipo: </p>
                <p><span>${pokemon.type.join(", ")}</span></p>
                <p>Debilidad: </p>
                <p><span>${pokemon.weaknesses.join(", ")}<span></p>
            </div>
        </div>
    </div>`;
}

function mostrarGraficas() {
  const datosPromedio = document.getElementById("datosPromedio");
  datosPromedio.innerHTML = `<p> El Promedio de <span>Peso</span> para los Pokemones es de: ${funciones.computeStats(
    datosPokemon,
    "weight"
  )} kg</p>
    <p> El Promedio de <span>Altura</span> para los Pokemones es de: ${funciones.computeStats(
      datosPokemon,
      "height"
    )} m
    </p>`;
}

botonSiguiente.addEventListener("click", () =>
  cambiarPagina(event, vistaInicial)
);
botonAnterior.addEventListener("click", () =>
  cambiarPagina(event, vistaInicial)
);
menuHamburguesa.addEventListener("click", menu);
botonCerrarModal.addEventListener("click", cerrarModal);
ordenar.addEventListener("change", () => {
  paginaInicial = 1;
  revisarBotonAtras("1");
  mostrarPokemon("ordenar");
});
selectFiltrar.addEventListener("change", () => {
  paginaInicial = 1;
  revisarBotonAtras("1");
  revisarBotonSiguiente(paginaInicial);
  mostrarPokemon("buscar");
});

revisarBotonAtras(paginaInicial);
revisarBotonSiguiente(paginaInicial);
agregarEscuchador();

const CHART = document.getElementById("chart");

// eslint-disable-next-line no-undef,no-unused-vars
let lineChart = new Chart(CHART, {
  type: "pie",
  data: {
    labels: [
      "Dragon",
      "Veneno",
      "Volador",
      "Insecto",
      "Normal",
      "Tierra",
      "Psiquico",
      "Hielo",
      "Fantasma",
      "Yerba",
      "Fuego",
      "Agua",
      "Electrico",
      "Lucha",
      "Roca"
    ],
    datasets: [
      {
        data: [
          funciones.promedio(datosPokemon, "Dragon"),
          funciones.promedio(datosPokemon, "Veneno"),
          funciones.promedio(datosPokemon, "Volador"),
          funciones.promedio(datosPokemon, "Insecto"),
          funciones.promedio(datosPokemon, "Normal"),
          funciones.promedio(datosPokemon, "Tierra"),
          funciones.promedio(datosPokemon, "Psiquico"),
          funciones.promedio(datosPokemon, "Hielo"),
          funciones.promedio(datosPokemon, "Fantasma"),
          funciones.promedio(datosPokemon, "Yerba"),
          funciones.promedio(datosPokemon, "Fuego"),
          funciones.promedio(datosPokemon, "Agua"),
          funciones.promedio(datosPokemon, "Electrico"),
          funciones.promedio(datosPokemon, "Lucha"),
          funciones.promedio(datosPokemon, "Roca")
        ],
        label: "My first dataseet",
        backgroundColor: [
          "#120136",
          "#79D70F",
          "#12947F",
          "#06623B",
          "#FF5200",
          "#6F0000",
          "#222831",
          "#43D8C9",
          "#D9455F",
          "#A8DF65",
          "#D92027",
          "#1B6CA8",
          "#FFD31D",
          "#2C003E",
          "#6F0000"]
      },
    ],
  }, 
  options: {
    responsive: true,
    responsiveAnimationDuration: 0,
    maintainAspectRatio: 0,
      title: {
          display: true,
          text: 'Cantidad de Pokemones por Tipo',
          fontSize: 30,
          padding: 10,
          fontColor: '#1C2D61',
      },
      legend: {          
          labels: {
              fontSize: 16,
              padding: 10,
              boxWidth: 40,
              fontFamily: 'lato',   
              fontColor: 'black',      
          }
      },     
      tooltips: {                   
          xPadding: 10,
          yPadding: 10,
      }
  }           
})