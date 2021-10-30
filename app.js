let express = require('express');
five = require("johnny-five");
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const path = require('path');

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

board = new five.Board();

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
    ledCozinha = null,
    laserAlarme = null,
    buzzer = null,
    thermometer = null,
    photoresistor = null;

board.on("ready", function () {
    console.log("Conexão com a placa concluída");

    ledSala = new five.Led(13);
    ledQuarto = new five.Led(12);
    ledCozinha = new five.Led(11);
    laserAlarme = new five.Led(10);

    sensorTemperatura();
    sensorAlarme();
});

const sensorTemperatura = () => {
    thermometer = new five.Thermometer({
        controller: "LM35",
        pin: "A0",
        freq: 2000
    });

    thermometer.on("change", () => {
        const { celsius } = thermometer;
        io.sockets.emit('temperaturaAtual', celsius);
    });
};

const sensorAlarme = () => {
    photoresistor = new five.Sensor({
        pin: "A2",
        freq: 250
    });

    board.repl.inject({
        pot: photoresistor
    });

    photoresistor.on("data", function () {
        io.sockets.emit('alarme', this.value);
        console.log(this.value);
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
                else if (lugar == 'cozinha') {
                    ledCozinha.on();
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
                else if (lugar == 'cozinha') {
                    ledCozinha.off();
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