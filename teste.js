const { Board, Thermometer } = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  const thermometer = new Thermometer({
    controller: "LM35",
    pin: "A0",
    freq: 1000
  });

  thermometer.on("change", () => {
    const {celsius} = thermometer;
    console.log("Thermometer");
    console.log("  celsius      : ", celsius);
  });
});