var express = require("express");
var geolib = require("geolib");
var cors = require("cors")

var app = express();

const port = process.env.PORT || 3000;

app.use(cors());

var verdao_lojas_coords = [
    {
        "latitude": -15.607892,
        "longitude": -56.117931,
        "name": "Verdão Materiais - Matriz"
    },
    {
        "latitude": -15.613008,
        "longitude": -56.049868,
        "name": "Verdão Materiais - Santa Cruz"
    },
    {
        "latitude": -15.571979,
        "longitude": -56.030946,
        "name": "Verdão Materiais - CPA"
    },
    {
        "latitude": -15.620711,
        "longitude": -56.070705,
        "name": "Verdão Materiais - Carmindo"
    }
]

app.options("/geolocation/:lat/:log/:accuracy", cors());

app.get("/geolocation/:lat/:log/:accuracy", cors(), (req, res) => {

    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400"
    });

    let coords = { "latitude": req.params.lat, "longitude": req.params.log };
    let distances = [];
    const menor_distance_coords = [];
    let menor_distancia = 0;
    verdao_lojas_coords.forEach(item => {
        distances.push(geolib.getDistance(coords, item, req.params.accuracy) / 1000);
    });
    menor_distancia = distances.reduce((a, b) => Math.min(a, b));
    verdao_lojas_coords.forEach(item => {
        if ((geolib.getDistance(coords, item, req.params.accuracy) / 1000) == menor_distancia) {
            menor_distance_coords.push(item);
        } else {
            console.log("adress not found : ", item);
        }
    });

    res.json(
        {
            lower_distance_coords: menor_distance_coords[0],
            lower_distance: menor_distancia
        }
    );
});
app.listen(port, function () {
    console.log("[ + ] - servidor rodando.");
});
