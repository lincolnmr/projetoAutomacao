let express = require('express');
const { response } = require('express');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
five = require("johnny-five");

const port = 3000;
board = new five.Board();

let ledSala = null,
    ledQuarto = null,
    ledCozinha = null,
    diodo = null,
    thermometer = null;

app = express();
app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello App' });
});

board.on("ready", function () {
    console.log("Conexão com a placa concluída");

    ledSala = new five.Led(13);
    ledQuarto = new five.Led(12);
    ledCozinha = new five.Led(11);
    diodo = new five.Led(10);

    thermometer = new five.Thermometer({
        controller: "LM35",
        pin: "A1"
    });

    /*
    thermometer.on("change", () => {
        const {celsius} = thermometer;
        console.log("Thermometer");
        console.log("  celsius      : ", celsius);
      });

     
    photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
    });

    //repl permite acesso direto ao sensor
    board.repl.inject({
        pot: photoresistor
    });

    
    photoresistor.on("data", function() {
        console.log(this.value);
    });
    */
});

app.post('/led/:mode', function (req, res) {
    console.log(req.params);
    
    if (ledSala){
        var status = "Sala OK";
        switch (req.params.mode) {
            case "on":
                ledSala.on();
                break;
            case "off":
                ledSala.off();
                break;
            default:
                status = "Comando não encontrado: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    }

    else if (ledQuarto) {
        var status = "Quarto OK";
        switch (req.params.mode) {
            case "on":
                ledQuarto.on();
                break;
            case "off":
                ledQuarto.off();
                break;
            default:
                status = "Comando não encontrado: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    }

    else if (ledCozinha) {
        var status = "Cozinha OK";
        switch (req.params.mode) {
            case "on":
                ledCozinha.on();
                break;
            case "off":
                ledCozinha.off();
                break;
            default:
                status = "Comando não encontrado: " + req.params.mode;
                break;
        }
        console.log(status);
        res.send(status);
    }
    
    else {
        res.send('Placa não conectada')
    }
});

app.post('/diodo/:mode', function (req, res) {
    console.log(req.params)
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

    res.status(200).json({
        temperatura: Math.random()
    });
});

app.listen(port, function () {
    console.log('Conectado na porta ' + port);
});