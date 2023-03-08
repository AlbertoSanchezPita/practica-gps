var latitudActual;
var longitudActual;
var latitudAntiga;
var longitudAntiga;
var ubiActual;
var ubiAntiga;
var estat = false;

document.getElementsByClassName("iniciar")[0].addEventListener("click", iniciar);
document.getElementsByClassName("acabar")[0].addEventListener("click", acabar);

navigator.geolocation.getCurrentPosition((pos) => {
    latitudActual = pos.coords.latitude;
    longitudActual = pos.coords.longitude;
});



function actualitzarPosicio(){
    map.setView([latitudActual, longitudActual]);
}

function marcarMapa(){
    L.circle([latitudAntiga, longitudAntiga], {
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1,
        radius: 10
    }).addTo(map);
}

function ubicacioActual(){
    ubiActual = L.circle([latitudActual, longitudActual], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 1,
        radius: 10
    }).addTo(map);
}

function borrarUbicacioAntiga(){
    ubiAntiga.remove();
}

function guardarUbicacio(){
    latitudAntiga = latitudActual;
    longitudAntiga = longitudActual;
    ubiAntiga = ubiActual;
}

function comprobarUbicacio(){
    if(latitudActual != latitudAntiga || longitudActual != longitudAntiga){
        borrarUbicacioAntiga();
    }
}

function iniciar(){
    estat = true;
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està ACTIVADA";
}

function acabar(){
    estat = false;
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està PARADA";
}



var map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);


if(navigator.geolocation){
    setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            guardarUbicacio();
            latitudActual = position.coords.latitude;
            longitudActual = position.coords.longitude;
            actualitzarPosicio();
            comprobarUbicacio();
            if(estat){
                marcarMapa();
            }
            ubicacioActual();
        })
    }, 500);
} else {
    alert("El teu navegador no té suport per a la geolocalització");
}
