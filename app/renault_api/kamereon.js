/** ***************************************************************************
 * Zoe Skript
 *
 * Author: Mischa Soujon
 * E-Mail: mischa@soujon-net.de
 *
 * Datum: 2023-01-21 18:47:08
 *
 * Dieses Skript implementiert die Abfragen des PHP-Skripts von Daniel
 * (https://www.goingelectric.de/forum/viewtopic.php?f=57&t=58182) nach und
 * stellt die Daten der REST-API für die CMS-WebSeite zur Verfügung.
 *
 * Copyright: 2023 Mischa Soujon
 */
const axios = require('axios');
const FormData = require('form-data');
const apiKeys = require('../data/api-keys.json');

class BackendConnector {
  // The base URLs
  GIGYA_URL = 'https://accounts.eu1.gigya.com';
  KAMEREON_URL = 'https://api-wired-prod-1-euw1.wrd-aws.com/commerce/v1';
  KAMEREON_API_KEY = process.env.KAMEREON_API_KEY || apiKeys['kamereon_api']
  OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5';
  ABRP_URL = 'https://api.iternio.com/1/tlm';

  country = process.env.REGISTRATION_COUNTRY || 'DE';
  personId;
  sessionInfo;
  idToken;
  accountId;
  lastLoginTimestamp = -1;
  kamereonApiHeaders;

  constructor() {}

  #handleError(error) {
    console.error(error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
      return { status: 'error', data: error.response };
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error(error.request);
      return { status: 'error', data: { message: 'No response received!' } };
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error.message);
    }
    console.error(error.config);
    return { status: 'error', data: error };
  }

  #retrieveRenaultAccountId() {
    const url = `${this.KAMEREON_URL}/persons/${this.personId}?country=${this.country}`;
    return axios(url, {
      method: 'GET',
      headers: this.kamereonApiHeaders,
    })
      .then((response) => {
        const data = response['data'];
        this.accountId = data['accounts'][0]['accountId'];
        return { status: 'success', data: { authenticated: true } };
      })
      .catch(this.#handleError);
  }

  #retrieveJWT() {
    const url = `${this.GIGYA_URL}/accounts.getJWT`;
    var data = new FormData();
    data.append('ApiKey', apiKeys[this.country]);
    data.append('login_token', this.sessionInfo['cookieValue']);
    data.append('fields', 'data.personId,data.gigyaDataCenter');
    data.append('expiration', '87000');
    return axios(url, {
      method: 'POST',
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    })
      .then((response) => {
        this.idToken = response['data']['id_token'];
        this.kamereonApiHeaders = {
          apikey: this.KAMEREON_API_KEY,
          'x-gigya-id_token': this.idToken,
        };
        return this.#retrieveRenaultAccountId();
      })
      .catch(this.#handleError);
  }

  login() {
    const now = Math.floor(new Date().getTime() / 1000);
    if (now < this.lastLoginTimestamp + 55) {
      return {
        status: 'success',
        data: {
          authenticated: true,
          message: `Since ${this.lastLoginTimestamp}`,
        },
      };
    }
    const url = `${this.GIGYA_URL}/accounts.login`;
    var data = new FormData();
    data.append('ApiKey', apiKeys[this.country]);
    data.append('loginId', process.env.RENAULT_USER);
    data.append('password', process.env.RENAULT_PW);
    data.append('include', 'data');
    data.append('sessionExpiration', '60');
    return axios(url, {
      method: 'POST',
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    })
      .then((response) => {
        const data = response['data'];
        this.personId = data['data']['personId'];
        this.sessionInfo = data['sessionInfo'];
        this.lastLoginTimestamp = data['lastLoginTimestamp'];
        return this.#retrieveJWT();
      })
      .catch(this.#handleError);
  }

  #requestKamereonApi(vin, endpoint, version) {
    if (vin === undefined || endpoint === undefined) {
      return this.#handleError({ message: 'VIN or endpoint missing' });
    }
    const v = version === undefined ? 'v1' : version;
    const url = `${this.KAMEREON_URL}/accounts/${this.accountId}/kamereon/kca/car-adapter/${v}/cars/${vin}/${endpoint}?country=${this.country}`;
    return axios(url, {
      method: 'GET',
      headers: this.kamereonApiHeaders,
    })
      .then((response) => {
        const data = response['data'];
        return { status: 'success', data: data };
      })
      .catch(this.#handleError);
  }
  retrieveBatteryStatus(vin) {
    return this.#requestKamereonApi(vin, 'battery-status', 'v2');
  }

  retrieveCockpitData(vin) {
    return this.#requestKamereonApi(vin, 'cockpit');
  }

  retrieveChargeMode(vin) {
    return this.#requestKamereonApi(vin, 'charge-mode');
  }

  retrieveOutsideTemperature(vin) {
    return this.#requestKamereonApi(vin, 'hvac-status');
  }

  retrieveLocation(vin) {
    return this.#requestKamereonApi(vin, 'location');
  }
}

module.exports = BackendConnector;
