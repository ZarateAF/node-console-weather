const axios = require("axios");
const fs = require("fs");

class Searchs {
  history = [""];
  dbPath = "./db/database.json";

  constructor() {
    this.readDB();
  }

  get historyCapitalized() {
    return this.history.map((h) => {
      const place = h.replace(/\w\S*/g, (w) =>
        w.replace(/^\w/, (c) => c.toUpperCase())
      );
      return place;
    });
  }

  get paramsMapbox() {
    return {
      limit: 5,
      language: "es",
      access_token: process.env.MAPBOX_KEY,
    };
  }
  get paramsOpenweather() {
    return {
      appid: process.env.OPENWEATHERMAP_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async city(place = "") {
    console.log("City", place);
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });
      const { data } = await instance.get();
      return data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lng: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async cityWeather(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather`,
        params: { ...this.paramsOpenweather, lat, lon },
      });
      const { data } = await instance.get();
      return {
        desc: data.weather[0].description,
        min: data.main?.temp_min,
        max: data.main?.temp_max,
        temp: data.main?.temp,
      };
    } catch (error) {
      return [];
    }
  }

  addHistory(place = "") {
    if (this.history.includes(place.toLocaleLowerCase())) {
      return;
    }
    this.history = this.history.splice(0, 5);
    this.history.unshift(place.toLocaleLowerCase());
    this.saveDB();
  }

  saveDB() {
    const payload = {
      history: this.history,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    if (!fs.existsSync(this.dbPath)) return;
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    this.history = JSON.parse(info).history;
  }
}

module.exports = Searchs;
