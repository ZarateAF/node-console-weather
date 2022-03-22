require("dotenv").config();
const {
  inquirerRead,
  inquirerMenu,
  inquirerPause,
  inquirerListPlaces,
} = require("./helpers/inquirer");
const Searchs = require("./models/searchs");

const main = async () => {
  let opt;
  const search = new Searchs();

  do {
    opt = await inquirerMenu();
    switch (opt) {
      case 1:
        console.log("Search");
        const place = await inquirerRead("City: ");
        const places = await search.city(place);
        const id = await inquirerListPlaces(places);
        if (id === 0) continue;

        const { name, lng, lat } = places.find((p) => p.id === id);
        search.addHistory(name);

        const { desc, min, max, temp } = await search.cityWeather(lat, lng);

        console.clear();
        console.log("\nCity information\n".green);
        console.log("City:", name.green);
        console.log("Lat:", lat);
        console.log("Lng:", lng);
        console.log("Temperature:", temp);
        console.log("Min:", min);
        console.log("Max:", max);
        console.log("Weather", desc.green);
        console.log()
        break;

      case 2:
        console.log()
        search.historyCapitalized.forEach((h, i) => {
          console.log(`${`${i + 1}.-`.green} ${h}`);
        });
        console.log()
        break;

      default:
        break;
    }
    if (opt !== 0) await inquirerPause();
  } while (opt !== 0);
};

main();
