/** ***************************************************************************
 * Zoe Skript
 * 
 * Author: Mischa Soujon
 * E-Mail: mischa@soujon-net.de
 * 
 * Datum: 2023-01-21 18:47:08
 * 
 * In diesem Skript werden die Routen für die API von der CMS-WebSeite 
 * definiert.
 * 
 * Copyright: 2023 Mischa Soujon
 */

/**
 * @swagger
 *   tags:
 *     name: E-Vehicle
 *     description: Die API zum Datenabruf für die E-Fahrzeuge vom CMS
 */
module.exports = (app) => {
    const chargeData = require('../controllers/eVehicleMgmt.js');
  
    var router = require('express').Router();
    
    /**
     * @swagger
     * paths:
     *   /e-vehicle/status/{vehicleID}:
     *     get:
     *       summary: Liefert die Informationen über das Auto mit der vehicleID
     *       parameters:
     *         - name: vehicleID
     *           in: path
     *           description: Die ID vom Fahrzeug 
     *           required: true
     *           schema:
     *             type: integer
     *             format: int64   
     *       responses:
     *         "200":
     *           description: Die Zustandsdaten des Autos
     *           content:
     *             application/json:
     *               schema:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/ChargeData'
     */
     router.get('/status/:vehicleID', chargeData.findDataByID);
  
    /**
     * @swagger
     * paths:
     *   /e-vehicle/webinfo/{vehicleID}:
     *     get:
     *       summary: Liefert die Informationen über das Auto mit der vehicleID
     *       parameters:
     *         - name: vehicleID
     *           in: path
     *           description: Die ID vom Fahrzeug 
     *           required: true
     *           schema:
     *             type: integer
     *             format: int64   
     *       responses:
     *         "200":
     *           description: Die Zustandsdaten des Autos
     *           content:
     *             application/json:
     *               schema:
     *                 type: array
     *                 items:
     *                   $ref: '#/components/schemas/ChargeData'
     */
    router.get('/webinfo/:vehicleID', chargeData.findWebDataByID);

    app.use('/api/e-vehicle', router);
    };
    
  