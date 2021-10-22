let express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('body-parser');
const path = require('path');
five = require("johnny-five");
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
})

io.on('connection', socket => {
    console.log(`socket conectado: ${socket.id}`);
    socket.on('ligarLuz', ({luz}) => {
       ligarLuz(luz);
    })
    socket.on('ligarAlarme', ({alarme}) => {
        ligarAlarme(alarme);
     })
})

board = new five.Board();

let ledSala = null,
    ledQuarto = null,
    ledCozinha = null,
    diodo = null,
    thermometer = null;

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

    thermometer.on("data", () => { 
        const { celsius } = thermometer;
        io.sockets.emit('temperaturaAtual', celsius);
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
        io.sockets.emit('alarme', this.value);
    });
});


const ligarLuz = (param) => {
    if (param){
        var status = "Sala OK";
        switch (param) {
            case "on":
                ledSala.on();
                break;
            case "off":
                ledSala.off();
                break;
            default:
                status = "Comando não encontrado: " + param;
                break;
        }
        console.log(status);
    }
    else {
        console.log('Placa não conectada')
    }
};

const ligarAlarme = (param) => {
    if (diodo) {
        switch (param) {
            case "on":
                diodo.on();
                break;
            case "off":
                diodo.off();
                break;
            default:
                let status = "Comando não encontrado: " + param;
                console.log(status);
                break;
        }
    } else {
        console.log('Placa não conectada')
    }
};

server.listen(port, function () {
    console.log('Conectado na porta ' + port);
});


/*
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
*/