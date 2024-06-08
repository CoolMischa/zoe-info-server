/** ***************************************************************************
 * Zoe Skript
 *
 * Author: Mischa Soujon
 * E-Mail: mischa@soujon-net.de
 *
 * Datum: 2023-01-21 18:47:08
 *
 * In diesem Skript werden die Daten von den Elektroautos abgerufen und dann
 * per REST-API bereitgestellt.
 *
 * Copyright: 2023 Mischa Soujon
 */
/**
 * @swagger
 *   components:
 *     schemas:
 *       Vehicle:
 *         type: object
 *         required:
 *           - id
 *           - description
 *           - plate
 *           - caretaker
 *           - zoeph
 *           - vin
 *           - countryOfRegistration
 *         properties:
 *           id:
 *             type: integer
 *             description: Die ELKATO ID des Fahrzeugs (Resource)
 *           description:
 *             type: string
 *             description: Beschreibung der Fahrzeugs zu Identifizierung
 *                durch die Mitglieder. Meistens Kfz-Typ und Stellplatz
 *           plate:
 *             type: string
 *             description: Das Kfz-Kennzeichen
 *           caretaker:
 *             type: string
 *             description: Der Name des Autowartes
 *           zoeph:
 *             type: integer
 *             minimum: 1
 *             maximum: 2
 *             description: Die (Model-)Phase, der das ZOE Model zugeordnet
 *                wird.
 *           vin:
 *             type: string
 *             minLength: 17
 *             maxLength: 17
 *             description: Vehicle Identification Number, Die Nummer steht im
 *                KFZ-Schein.
 *           countryOfRegistration:
 *              type: string
 *              enum: [DE, AT, SE, GB, IT]
 *           email:
 *             type: string
 *             format: date-time
 *             description: E-Mail-Adresse vom Autowart
 *           phone:
 *             type: string
 *             description: Telefonnummer vom Autowart
 *           imgURL:
 *             type: string
 *             description: URL zu einem Photo vom Auto
 *         example:
 *            id: 46
 *            description: Zoe RATHAUS
 *            plate: EBE-CU 99E
 *            caretaker: Mischa Soujon
 *            zoeph: 2
 *            vin: VF1AG000161438723
 *            countryOfRegistration: DE
 *            email: m_soujon@web.de
 *            phone: +49 170 9263 165
 *            imgURL: https://cms-carsharing.de/images/artikelbilder/autos/width256/ZOE_1.jpg
 */
/**
 * @swagger
 *   components:
 *     schemas:
 *       ChargeData:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             description: Die ELKATO ID des Fahrzeugs (Resource)
 *           name:
 *             type: string
 *             description: Beschreibung der Fahrzeugs zu Identifizierung
 *                durch die Mitglieder. Meistens Kfz-Typ und Stellplatz
 *           plate:
 *             type: string
 *             description: Das Kfz-Kennzeichen
 *           charging:
 *             type: boolean
 *           mileage:
 *             type: integer
 *             description: Der Kilometerstand zum Zeitpunkt der Abfrage
 *           connected:
 *              type: boolean
 *           batteryLevel:
 *              type: number
 *              description: Ladestand der Battery in Prozent
 *           range:
 *              type: integer
 *              description: Reichweite in km
 *           batteryTemperature:
 *              type: number
 *              description: Batterietemperatur in °C
 *           outsideTemperature:
 *              type: number
 *              description: Außentemperatur in °C
 *           positionURL:
 *             type: string
 *             description: URL zum Standort in einer Karte
 */

const BackendController = require('../renault_api/kamereon');
const bc = new BackendController();

const eVehicles = require('../data/eVehicles.json');

const retrieveAllVehicleData = async (vehicle) => {
  let responseData = { vehicle: vehicle };

  let response = await bc.retrieveBatteryStatus(vehicle.vin);
  if (response['status'] === 'error') {
    responseData.battery = {
      status: 'error',
      message: 'no battery status available',
    };
  } else {
    responseData.battery = response['data'];
  }

  response = await bc.retrieveCockpitData(vehicle.vin);
  if (response['status'] === 'error') {
    responseData.cockpit = {
      status: 'error',
      message: 'no cockpit data available',
    };
  } else {
    responseData.cockpit = response['data'];
  }

  response = await bc.retrieveChargeMode(vehicle.vin);
  if (response['status'] === 'error') {
    responseData.chargeMode = {
      status: 'error',
      message: 'no charge mode available',
    };
  } else {
    responseData.chargeMode = response['data'];
  }

  response = await bc.retrieveOutsideTemperature(vehicle.vin);
  if (response['status'] === 'error') {
    responseData.outside = {
      status: 'error',
      message: 'no outside temperature available',
    };
  } else {
    responseData.outside = response['data'];
  }

  response = await bc.retrieveLocation(vehicle.vin);
  if (response['status'] === 'error') {
    responseData.location = {
      status: 'error',
      message: 'no location available',
    };
  } else {
    responseData.location = response['data'];
  }

  return responseData;
};

/**
 * Looks up the vehicle by id in the eVehicles data.
 *
 * @param {*} id
 *
 * returns the vehicle if found, else send 404 response.
 */
const findVehicleByID = (id) => {
  const vehicle = eVehicles.find((v) => {
    return v.id == id;
  });
  return vehicle;
};

exports.findDataByID = async (req, res) => {
  const vehicleID = parseInt(req.params.vehicleID);
  const vehicle = findVehicleByID(vehicleID);
  if (vehicle == undefined) {
    const response = { error: `vehicle with id ${vehicleID} not found.` };
    res.status(404).send(response);
    return;
  }

  let response = await bc.login();
  if (response['status'] === 'error') {
    res.status(401).send(response);
    return;
  }

  response = await retrieveAllVehicleData(vehicle);

  res.send(response);
};

exports.findWebDataByID = async (req, res) => {
  const vehicleID = parseInt(req.params.vehicleID);
  const vehicle = findVehicleByID(vehicleID);
  if (vehicle == undefined) {
    const response = { error: `vehicle with id ${vehicleID} not found.` };
    res.status(404).send(response);
    return;
  }

  let response = await bc.login();
  if (response['status'] === 'error') {
    res.status(401).send(response);
    return;
  }

  let htmlFragment = `<div><strong>${vehicle.name}</strong></div>`;

  response = await retrieveAllVehicleData(vehicle);
  const cockpit = response.cockpit;
  const attributes = cockpit.data.attributes;
  htmlFragment += `<div>Kilometerstand: <em>${attributes.totalMileage}</em> km</div>`;

  const battery = response.battery;
  if (battery['status'] === 'error') {
    htmlFragment += `<div>Zurzeit keine Ladeinformationen vorhanden!</div>`;
  } else {
    const attributes = battery.data.attributes;
    const timestamp = new Date(attributes.timestamp).toLocaleString('de-DE');
    htmlFragment += `<div>Batterielevel: <em>${attributes.batteryLevel}</em> %</div>`;
    htmlFragment += `<div>Reichweite: <em>${attributes.batteryAutonomy}</em> km</div>`;
    htmlFragment += `<div>Meldezeit: <em>${timestamp}</em></div>`;
  }
  res.send(htmlFragment);
};
