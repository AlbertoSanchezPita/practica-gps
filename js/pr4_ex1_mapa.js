var latitudActual;
var longitudActual;
var latitudAntiga;
var longitudAntiga;
var estat = false;

document.getElementsByClassName("iniciar")[0].addEventListener("click", iniciar);
document.getElementsByClassName("acabar")[0].addEventListener("click", acabar);

navigator.geolocation.getCurrentPosition((pos) => {
    latitudActual = pos.coords.latitude;
    longitudActual = pos.coords.longitude;
});

function obtenirPosicio(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            this.latitud = position.coords.latitude;
            this.longitud  = position.coords.longitude;
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
        });
    } else {
        console.log("El navegador no es compatible amb la geolocalitzacio");
    }
}

function actualitzarPosicio(){
    map.setView([latitudActual, longitudActual]);
    console.log(latitudActual + " - " + longitudActual);
}

function marcarMapa(){
    L.circle([latitudAntiga, longitudAntiga], {
        color: 'red',
        fillOpacity: .5,
        radius: 10
    }).addTo(map);
}

function ubicacioActual(){
    L.circle([latitudActual, longitudActual], {
        color: 'blue',
        fillOpacity: .5,
        radius: 10
    }).addTo(map);
}

function borrarUbicacioAntiga(){
    L.circle([latitudAntiga, longitudAntiga], {
        color: 'blue',
        fillOpacity: .5,
        radius: 10
    }).remove(map);
}

function guardarUbicacio(){
    latitudAntiga = latitudActual;
    longitudAntiga = longitudActual;
}

function comprobarUbicacio(){
    if(latitudActual != latitudAntiga || longitudActual != longitudAntiga){
        borrarUbicacioAntiga();
    }
}

function iniciar(){
    estat = true;
}

function acabar(){
    estat = false;
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
    }, 3000);
} else {
    alert("El teu navegador no té suport per a la geolocalització");
}
