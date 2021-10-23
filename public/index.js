const baseUrl = 'http://localhost:3000';
let socket = io('http://localhost:3000');

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

    document.querySelector("#luzCozinha").addEventListener('click', () => {
        if (checarLuzCozinha()) {
            ligarLuz('cozinha');
        }
        else {
            desligarLuz('cozinha');
        }
    });

    document.querySelector("#botaoAlarme").addEventListener('click', () => {
        if (isCheckedAlarm()) {
            ligarAlarme();
        }
        else {
            desligarAlarme();
        }
    });
}

// LUZ
const checarLuzSala = () => {
    return document.querySelector('#luzSala').checked;
}

const checarLuzQuarto = () => {
    console.log('quarto');
    return document.querySelector('#luzQuarto').checked;
}

const checarLuzCozinha = () => {
    return document.querySelector('#luzCozinha').checked;
}

const ligarLuz = (comodo) => {
    console.log('console log ligarluz: ', comodo)
    socket.emit('ligarLuz', {
        luz: 'on',
        lugar: comodo
    });
}

const desligarLuz = (comodo) => {
    socket.emit('ligarLuz', {
        luz: 'off',
        lugar: comodo
    });
}

//ALARME
const isCheckedAlarm = () => {
    return document.querySelector('#botaoAlarme').checked;
}

const ligarAlarme = () => {
    socket.emit('ligarAlarme', {
        alarme: 'on'
    });
}

const desligarAlarme = () => {
    socket.emit('ligarAlarme', {
        alarme: 'off'
    });
}

const desligarAlarmeCheckBox = () => {
    document.querySelector('#botaoAlarme').checked = false;
}

// ADICIONAR EVENTOS
const iniciarAplicacao = () => {
    eventoCheckbox();
    iniciarSocket();
}

const iniciarSocket = () => {
    socket.on('temperaturaAtual', (temperatura) => {
        document.querySelector('#botaoTemperatura').value = (temperatura / 20);
    })

    socket.on('alarme', (disparou) => {
        const limiteMinLuz = 900;
        if(disparou > limiteMinLuz){
            desligarAlarme();
            desligarAlarmeCheckBox();
        }
    })
}


iniciarAplicacao();