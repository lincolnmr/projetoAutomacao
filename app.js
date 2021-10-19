let express = require('express');
app = express();
const cors = require('cors');
const port = 3000;

  /*  five = require("johnny-five"),
    board = new five.Board(),
    led = null,
    diodo = null;
    */

const {Thermometer } = require("johnny-five");
const { json, urlencoded } = require('body-parser');
const { response } = require('express');

app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello App' });
});

/*
board.on("ready", function () {
    console.log("Conectado");
    led = new five.Led(11);
    diodo = new five.Led(9);

    
    const thermometer = new Thermometer({
        controller: "LM35",
        pin: "A0"
    });

    thermometer.on("change", () => {
        const { celsius, fahrenheit, kelvin } = thermometer;
        console.log("Thermometer");
        console.log("  celsius      : ", celsius);
        console.log("  fahrenheit   : ", fahrenheit);
        console.log("  kelvin       : ", kelvin);
        console.log("--------------------------------------");
    });
});
    */

app.post('/led/:mode', function (req, res) {
    console.log(req.params)
    /*if (led) {
        var status = "OK";
        switch (req.params.mode) {
            case "on":
                led.on();
                break;
            case "off":
                led.off();
                break;
            default:
                status = "Comando não encontrado: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    } else {
        res.send('Placa não conectada')
    }*/
});

app.get('/diodo/:mode', function (req, res) {

    if (diodo) {
        var status = "OK";
        switch (req.params.mode) {
            case "on":
                diodo.on();
                break;
            case "off":
                diodo.off();
                break;
            default:
                status = "Comando não encontrado: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    } else {
        res.send('Placa não conectada')
    }
});

app.get('/temperatura', (req, res) => {
    res.status(200).json({ temperatura: Math.random() })
});

app.listen(port, function () {
    console.log('Conectado na porta ' + port);
});