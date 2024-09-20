var express = require("express");
var geolib = require("geolib");
var app = express();
var port = 5050;


var verdao_lojas_coords = [
    {
        "latitude":-15.607282, 
        "longitude":-56.119839
    },
    {
        "latitude":-15.612847, 
        "longitude":-56.050579
    },
    {
        "latitude":-15.592621,
        "longitude":-56.069962
    },
    {
        "latitude":-15.612804, 
        "longitude":-56.050461
    }
]

app.use(express.static(__dirname + "/src/"))
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/src/index.html");
});

app.get("/geolocation/:lat/:log/:accuracy",(req,res) => {
    let coords = {"latitude" : req.params.lat, "longitude" : req.params.log};
    let distances = [];
    const menor_distance_coords = [];
    let menor_distancia = 0;
    verdao_lojas_coords.forEach(item => {

        distances.push(geolib.getDistance(coords, item,req.params.accuracy) / 1000);
    });
    menor_distancia = distances.reduce((a,b) => Math.min(a,b));
    verdao_lojas_coords.forEach(item => { 
        if((geolib.getDistance(coords, item, req.params.accuracy)/1000) == menor_distancia){
            menor_distance_coords.push(item);
        } else {
            console.log("adress not found : ", item);
        }
    });
    
    res.json(
        {
            lower_distance_coords:menor_distance_coords[0],
            lower_distance:menor_distancia
        }
    );
});
app.listen(port, function () {
    console.log("[ + ] - servidor rodando.");
});
