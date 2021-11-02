const baseUrl = 'http://192.168.2.133:3000';
let socket = io('http://192.168.2.133:3000');

// EVENTOS CHECKBOX
const eventoCheckbox = () => {
    document.querySelector("#luzSala").addEventListener('click', () => {
        if (checarLuzSala()) {
            ligarLuz('sala');
        }
        else {
            desligarLuz('sala');
        }
    });

    document.querySelector("#luzQuarto").addEventListener('click', () => {
        if (checarLuzQuarto()) {
            ligarLuz('quarto');
        }
        else {
            desligarLuz('quarto');
        }
    });

    document.querySelector("#luzExterna").addEventListener('click', () => {
        if (checarLuzExterna()) {
            ligarLuz('externa');
        }
        else {
            desligarLuz('externa');
        }
    });

    document.querySelector("#botaoAlarme").addEventListener('click', () => {
        if (checarAlarme()) {
            ligarAlarme();

            socket.on('alarme', (luzAlarme) => {
                const limiteMaxLuz = 900; // Se o valor da leitura for maior que 900 o sensor não está recebendo luz, 
                // o alarme vai ser disparado
                if (checarAlarme()) {
                    if (luzAlarme > limiteMaxLuz) {
                        dispararAlarme();
                    }
                }
            })
        }
        else {
            desligarAlarme();
        }
    });
}

// FUNÇÕES LUZ
const checarLuzSala = () => {
    return document.querySelector('#luzSala').checked;
}

const checarLuzQuarto = () => {
    return document.querySelector('#luzQuarto').checked;
}

const checarLuzExterna = () => {
    return document.querySelector('#luzExterna').checked;
}

const ligarLuz = (comodo) => {
    socket.emit('comandoLuz', {
        luz: 'on',
        lugar: comodo
    });
}

const desligarLuz = (comodo) => {
    socket.emit('comandoLuz', {
        luz: 'off',
        lugar: comodo
    });
}

//FUNÇÃO ALARME
const checarAlarme = () => {
    return document.querySelector('#botaoAlarme').checked;
}

const ligarAlarme = () => {
    socket.emit('comandoAlarme', {
        alarme: 'on'
    });
}

const desligarAlarme = () => {
    socket.emit('comandoAlarme', {
        alarme: 'off'
    });
}

const dispararAlarme = () => {
    document.querySelector('#botaoAlarme').checked = false;
    desligarAlarme();
    document.querySelector('#luzSala').checked = true;
    ligarLuz('sala');
    document.querySelector('#luzQuarto').checked = true;
    ligarLuz('quarto');
    document.querySelector('#luzExterna').checked = true;
    ligarLuz('externa');

    socket.emit('sirene');
}

// EVENTOS APLICAÇÃO
const iniciarAplicacao = () => {
    eventoCheckbox();
    iniciarSocket();
}

const iniciarSocket = () => {
    socket.on('temperaturaAtual', (temperatura) => {
        const temp = temperatura;
        document.querySelector('#projetaTemperatura').value = temp;
    })

    socket.on('luminosidade', (luzExterna) => {
        const limiteMaxLuz = 1000; // Se o valor da leitura for maior que 1000 a luz externa vai acender
        if (luzExterna > limiteMaxLuz) {
            ligarLuz('externa');
            document.querySelector('#luzExterna').checked = true;
        }
    })
}

iniciarAplicacao();