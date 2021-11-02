let express = require('express');
five = require("johnny-five");
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const path = require('path');
const board = new five.Board();
const port = 3000;
const app = express();

app.use(cors())
app.use(json());
app.use(urlencoded({ extended: true }));
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

io.on('connection', socket => {
    console.log(`socket conectado: ${socket.id}`);

    socket.on('comandoLuz', ({ luz, lugar }) => {
        interruptorLuz(luz, lugar);
    });

    socket.on('comandoAlarme', ({ alarme }) => {
        interruptorAlarme(alarme);
    });

    socket.on('sirene', () => {
        buzzerAlarme();
    });
});

let ledSala = null,
    ledQuarto = null,
    ledExterno = null,
    laserAlarme = null,
    buzzer = null,
    thermometer = null,
    photoresistor = null;

board.on("ready", () => {
    console.log("Conexão com a placa concluída");

    ledSala = new five.Led(13);
    ledQuarto = new five.Led(12);
    ledExterno = new five.Led(11);
    laserAlarme = new five.Led(10);

    sensorTemperatura();
    sensorAlarme();
    sensorLuminosidade();
});

const sensorLuminosidade = () => {
    photoresistor = new five.Sensor({
        pin: "A3",
        freq: 250
    });

    board.repl.inject({
        pot: photoresistor
    });

    photoresistor.on("data", function () {
        io.sockets.emit('luminosidade', this.value);
    });
};

const sensorTemperatura = () => {
    thermometer = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 1000
    });

    thermometer.on("data", () => {
        const { celsius } = thermometer;
        io.sockets.emit('temperaturaAtual', celsius - 21);
    });
};

const sensorAlarme = () => {
    photoresistor = new five.Sensor({
        pin: "A5",
        freq: 250
    });

    board.repl.inject({
        pot: photoresistor
    });

    photoresistor.on("data", function () {
        io.sockets.emit('alarme', this.value);
    });
};

const buzzerAlarme = () => {
    buzzer = new five.Piezo(3);

    board.repl.inject({
        buzzer: buzzer
    });

    buzzer.play({
        song: [
            [1500, 5]
        ]
    });
};

const interruptorLuz = (luz, lugar) => {
    try {
        switch (luz) {
            case "on":
                if (lugar == 'sala') {
                    ledSala.on();
                    //console.log(ledSala.value);
                }
                else if (lugar == 'quarto') {
                    ledQuarto.on();
                }
                else if (lugar == 'externa') {
                    ledExterno.on();
                }
                else {
                    console.log('Comodo não encontrado');
                }
                break;
            case "off":
                if (lugar == 'sala') {
                    ledSala.off();
                }
                else if (lugar == 'quarto') {
                    ledQuarto.off();
                }
                else if (lugar == 'externa') {
                    ledExterno.off();
                }
                else {
                    console.log('Comodo não encontrado');
                }
                break;
            default:
                let status = "Comando não encontrado: " + luz + lugar;
                break;
        }
    } catch (error) {
        console.log('Placa não conectada. Erro: ' + error);
    }
};

const interruptorAlarme = (param) => {
    try {
        switch (param) {
            case "on":
                laserAlarme.on();
                break;
            case "off":
                laserAlarme.off();
                break;
            default:
                let status = "Comando não encontrado: " + param;
                console.log(status);
                break;
        }
    } catch (error) {
        console.log('Placa não conectada. Erro: ' + error);
    }
};

server.listen(port, function () {
    console.log('Conectado na porta ' + port);
});