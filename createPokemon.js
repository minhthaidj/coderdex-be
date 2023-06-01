const fs = require("fs");
const csv = require("csvtojson");

const createPokemon = async () => {
  let newData = await csv().fromFile("Pokemon.csv");
  let data = JSON.parse(fs.readFileSync("db.json"));
  newData = newData.map((e) => {
    return {
      id: e.No,
      name: e.Name,
      types: [e.Type1, e.Type2],
      url: `http://localhost:3000/images/${e.No}.png`,
    };
  });
  data.data = newData;
  fs.writeFileSync("db.json", JSON.stringify(data));
  console.log("done");
};

createPokemon();
