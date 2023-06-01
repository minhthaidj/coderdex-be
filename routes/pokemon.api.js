var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

var jsonPath = path.join(__dirname, "..", "db.json");
let data = JSON.parse(fs.readFileSync(jsonPath));

// let data = JSON.parse(fs.readFileSync("db.json"));

/**
 * params: /pokemons
 * description: Get Pokémons by Name & Types & Id
 * query: ?name=&types=&id=
 * method: get
 */

router.get("/", function (req, res, next) {
  const { url, query } = req;
  const filterConditionName = query.name;
  const filterConditionTypes = query.types;
  let result = data.data;
  if (filterConditionName) {
    result = result.filter((e) => e.name === filterConditionName);
  }
  if (filterConditionTypes) {
    result = result.filter(
      (e) =>
        e.types[0] === filterConditionTypes ||
        e.types[1] === filterConditionTypes
    );
  }
  console.log({ url, query });
  res.send(result);
});

router.get("/:id", function (req, res, next) {
  const filterConditionId = req.params.id;
  let result = data.data;
  // API for getting a single Pokémon information together with information of the previous and the next pokemon.
  if (filterConditionId) {
    result = result.filter((e) => e.id === filterConditionId);
    // Từ 1 tới 720
    if (
      parseInt(result[0].id) > 0 &&
      parseInt(result[0].id) < data.data[data.data.length - 1].id
    ) {
      result = data.data.filter(
        (e) =>
          e.id === result[0].id ||
          e.id === (parseInt(result[0].id) + 1).toString() ||
          e.id === (parseInt(result[0].id) - 1).toString()
      );
    }
    // 1
    if (result[0].id === "1") {
      result = data.data.filter(
        (e) =>
          e.id === data.data[data.data.length - 1].id ||
          e.id === "1" ||
          e.id === "2"
      );
    }
    // 721 (or end of the data)
    if (result[0].id === data.data[data.data.length - 1].id) {
      console.log("result", result);
      result = data.data.filter(
        (e) =>
          e.id === data.data[data.data.length - 2].id ||
          e.id === data.data[data.data.length - 1].id ||
          e.id === "1"
      );
    }
  }
  console.log(filterConditionId);
  res.send(result);
});

/**
 * params: /
 * description: post a pokemon
 * query:
 * method: post
 */

// "Missing required data." (name, id, types or URL)
// "Pokémon can only have one or two types." (if the types's length is greater than 2)
// "Pokémon's type is invalid." (if the types of Pokémon are not included in the valid given PokémonTypes array)
// "The Pokémon is exist." (if id or name exists in the database)

router.post("/", (req, res, next) => {
  //post input validation
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flyingText",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
    "",
  ];
  try {
    const { id, name, types, url } = req.body;
    //Missing body info
    if (!id || !name || !types || !url) {
      const exception = new Error(`Missing body info`);
      exception.statusCode = 401;
      throw exception;
    }
    //Pokémon can only have one or two types
    if (types?.length > 2) {
      const exception = new Error(`Pokémon can only have one or two types.`);
      exception.statusCode = 401;
      throw exception;
    }
    //Pokémon's type is invalid
    if (types) {
      const pokemonTypesFilter = pokemonTypes.filter(
        (e) => e === types[0] || e === types[1]
      );
      console.log("pokemonTypesFilter", pokemonTypesFilter);
      if (pokemonTypesFilter.length !== 2) {
        console.log(pokemonTypesFilter.length, "a");
        const exception = new Error(`Pokémon's type is invalid.`);
        exception.statusCode = 401;
        throw exception;
      }
    }
    //The Pokémon is exist
    if ((id, name)) {
      const foundItem = data.data.find((e) => e.id === id || e.name === name);
      if (foundItem) {
        const exception = new Error(`The Pokémon is exist.`);
        exception.statusCode = 401;
        throw exception;
      }
    }

    //post processing
    const newPokemon = {
      id,
      name,
      types,
      url,
    };

    //Read data from db.json then parse to JSobject
    const pokemons = data.data;
    //Add new pokemon to pokemons JS object
    pokemons.push(newPokemon);
    //Add new pokemon to db JS object
    data.data = pokemons;
    data.totalPokemons = data.totalPokemons + 1;
    //db JSobject to JSON string
    data = JSON.stringify(data);
    //write and save to db.json
    // data hay data.data?
    fs.writeFileSync("db.json", data);
    //post send response
    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
