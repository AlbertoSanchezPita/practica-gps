var latitudActual;
var longitudActual;
var ubiActual;
var llistaCoordenades = [];
var rutes;
var horaInici;
var horaFinal;
var pruebas = [[41.450219, 2.184702], [41.451439, 2.186297], [41.453248, 2.186754], [41.454661, 2.187715], [41.455790, 2.187298], [41.456742, 2.186267], [41.457180, 2.185083], [41.458090, 2.184416], [41.460543, 2.181153]]

var contador = 0;


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
    // llistaCoordenades.push(pruebas[contador]);
    // contador++;
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
    ubiActual.setLatLng([latitudActual, longitudActual]);
    // ubiActual.setLatLng(pruebas[contador]);
}

function calcularDuracio(){
    let horas = 0;
    let min = 0;
    let seg = 0;
    let duracio = horaFinal - horaInici;
    seg = Math.trunc(duracio/1000);
    if(seg > 59){
        min = Math.trunc(seg/60);
        seg = seg%60;
    }
    if(min > 59){
        horas = Math.trunc(min/60);
        min = min%60;
    }

    horas = horas.toString()
    if(min < 9){
        min = "0" + min.toString()
    } else {
        min = min.toString();
    }
    if(seg < 9){
        seg = "0" + seg.toString()
    } else {
        seg = seg.toString();
    }

    if (horas != "0") {
        return horas + " h " + min + " min " + seg + " seg";
    } else if (min != "00") {
        return min + " min " + seg + " seg";
    } else {
        return seg + " seg";
    }
}

function calcularDistancia(){
    let llargada = 0;
    for(let i=0;i<llistaCoordenades.length-2;i++){
        let puntActual = L.latLng(llistaCoordenades[i][0], llistaCoordenades[i][1]);
        let puntSeguent = L.latLng(llistaCoordenades[i+1][0], llistaCoordenades[i+1][1]);
        llargada += puntActual.distanceTo(puntSeguent);
    }
    if(llargada < 1000){
        return Math.trunc(llargada) + " metres";
    } else {
        return (llargada/1000).toFixed(2) + " km";
    }
}


function guardarDades(dades){
    localStorage.setItem("llistaRutes", JSON.stringify(dades))
}

function recuperarDades(){
    let recuperarRutes = localStorage.getItem("llistaRutes");
    return JSON.parse(recuperarRutes);
}


function iniciar(){
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està ACTIVADA";
    horaInici = new Date().getTime();
    iniciaWatchPosition();
}

function acabar(){
    document.getElementsByClassName("grabacio")[0].innerHTML = "La grabació del recorregut està PARADA";
    horaFinal = new Date().getTime();
    pararWatchPosition();
    let rutes = recuperarDades();
    rutes[rutes.length-1].llistaCoordenades = llistaCoordenades;
    rutes[rutes.length-1].duracio = calcularDuracio();
    rutes[rutes.length-1].data = new Date().toLocaleDateString('es-ES');
    rutes[rutes.length-1].distancia = calcularDistancia();
    guardarDades(rutes);
}


function iniciaWatchPosition(){
    idprocess = navigator.geolocation.watchPosition(onGpsChangeSucces, onGpsError, {
        maximumAge: 0,
        enableHighAccuracy: false,
        timeout: 1000
    });
}

function onGpsError(error){
    console.warn('ERROR(' + error.code + '): ' + error.message);
}

function onGpsChangeSucces(position){
    // latitudActual = pruebas[contador][0]
    // longitudActual = pruebas[contador][1]
    if (latitudActual != position.coords.latitude || longitudActual != position.coords.longitude) {
        latitudActual = position.coords.latitude;
        longitudActual = position.coords.longitude;
        centrarMapa();
        marcarMapa();
        actualitzarUbicacioActual();
    }
}

function pararWatchPosition(id){
    navigator.geolocation.clearWatch(id);
}


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((position) => {
        latitudActual = position.coords.latitude;
        longitudActual = position.coords.longitude;
        ubicacioActual();
        centrarMapa();
    })
}



// if(navigator.geolocation){
//      navigator.geolocation.getCurrentPosition((position) => {
//          latitudActual = position.coords.latitude;
//          longitudActual = position.coords.longitude;
//          ubicacioActual();
//          centrarMapa();
//         intervalID = setInterval(() => {
//             if(true){
//                 latitudActual = position.coords.latitude;
//                 longitudActual = position.coords.longitude;
//                 centrarMapa();
//                 if(estat){
//                     marcarMapa();
//                 }
//                 actualitzarUbicacioActual();    
//             } 
//         }, 1000);
//     })
// } else {
//     alert("El teu navegador no té suport per a la geolocalització");
// }


// L.polyline(pruebas, {color: 'red'}).addTo(map);


console.log(recuperarDades());

// localStorage.clear();
