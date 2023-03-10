var latitudActual;
var longitudActual;
var ubiActual;
var estat = false;
var llistaCoordenades = [];
var pruebas = [[41.450219, 2.184702], [41.451439, 2.186297], [41.453248, 2.186754], [41.454661, 2.187715]]

document.getElementsByClassName("iniciar")[0].addEventListener("click", iniciar);
document.getElementsByClassName("acabar")[0].addEventListener("click", acabar);

// Creo el mapa
var map = L.map('map').setView([0, 0], 16);

// Añado la capa de la interfaz grafica
var capa = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

// Variable para guardar las propiedades de las lineas a pintar
var linies = {
    color: 'red',
    opacity: '100%'
}

// Variable que crea la ruta con las coordenadas guardadas
var ruta = L.polyline(llistaCoordenades, linies);

// Añadimos las linias al mapa
ruta.addTo(map);



function centrarMapa(){
    map.setView([latitudActual, longitudActual]);
}

function marcarMapa(){
    llistaCoordenades.push([latitudActual, longitudActual]);
    ruta = L.polyline(llistaCoordenades, linies);
    ruta.addTo(map);
}

function ubicacioActual(){
    ubiActual = L.circle([latitudActual, longitudActual],{
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 1,
        radius: 10
    }).addTo(map);
}

function actualitzarUbicacioActual(){
        ubiActual.setLatLng([latitudActual, longitudActual]).update();
}


function iniciar(){
    estat = true;
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està ACTIVADA";

}

function acabar(){
    estat = false;
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està PARADA";
}

function recuperarDades(){
   return localStorage.getItem("llistaRutes");
}



if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
        latitudActual = position.coords.latitude;
        longitudActual = position.coords.longitude;
        ubicacioActual();
        centrarMapa();
        setInterval(() => {
            if(estat){
                centrarMapa();
                marcarMapa();
                actualitzarUbicacioActual();
                }
        }, 1000);
    })
} else {
    alert("El teu navegador no té suport per a la geolocalització");
}


L.polyline(pruebas, {color: 'red'}).addTo(map);


console.log(localStorage.getItem("llistaRutes"));
