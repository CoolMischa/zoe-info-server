/** ***************************************************************************
 * Zoe Skript
 * 
 * Author: Mischa Soujon
 * E-Mail: mischa@soujon-net.de
 * 
 * Datum: 2023-01-20 12:49:09
 * 
 * Contributors:
 * 
 * Dieses Script startet den Server für die Schnittstelle zwischen den
 * "Renault Services" zur Abfrage von electrical vehicles, wie den ZOE und
 * einer WebSeite, die diese Daten darstellen will, ohne die Zugangsdaten
 * zum Renault Account exponieren zu müssen.
 * 
 * Die Carsharing Union Markt Schwaben kann damit Ihren Mitgliedern den
 * Ladezustand und die Position der ZOEs auf der Webseite bereitstellen.
 * 
 * Das Skript basiert auf eine PHP Implementierung von Daniel
 * (https://www.goingelectric.de/forum/viewtopic.php?f=57&t=58182)
 * 
 * Copyright: 2023 Mischa Soujon
 */

require('dotenv').config();

// set port
const PORT = process.env.PORT || 8080;
const API_SERVER_URL = process.env.API_SERVER_URL || "http://localhost";
const CORS_ORIGIN = process.env.CORS_ORIGIN ||  '["http://localhost:8081"]'

const express = require("express");
const app = express();

// swagger configuration
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CMS ZOE Status Server",
            version: "0.9.0",
            description: "Mit dieser API könne die Status der beide ZOEs abgerufen und angezeigt werden.",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Mischa Soujon",
                url: "https://www.cms-carsharing.de",
                email: "webmaster@cms-carsharing.de",
            },
        },
        servers: [
            {
                url: `http://localhost:8080/api`,
            },
            {
                url: `${API_SERVER_URL}/api`,
            }
        ],
    },
    apis: ["./**/app/**/*.js"],
};
const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true
    })
);

let corsOptions = {
    origin: JSON.parse(CORS_ORIGIN),
    preflightContinue: false
}

const cors = require("cors");
app.use(cors(corsOptions));

const bodyParser = require("body-parser");
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// simple route to initialize all and return the status
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Willkommen zur electrical vehicle Status API. System initialized!"
    });
});

require('./app/routes/index')(app);

// set port, listen for requests
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});