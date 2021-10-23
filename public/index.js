const baseUrl = 'http://localhost:3000';
let socket = io('http://localhost:3000');

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

// FUNÇÕES LUZ
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
const isCheckedAlarm = () => {
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

const desligarAlarmeCheckBox = () => {
    document.querySelector('#botaoAlarme').checked = false;
}

const ligarluzes = () => {
    document.querySelector('#luzSala').checked = true;
    document.querySelector('#luzQuarto').checked = true;
    document.querySelector('#luzCozinha').checked = true;
}

// EVENTOS APLICAÇÃO
const iniciarAplicacao = () => {
    eventoCheckbox();
    iniciarSocket();
}

const iniciarSocket = () => {
    socket.on('temperaturaAtual', (temperatura) => {
        document.querySelector('#projetaTemperatura').value = (temperatura / 20);
    })

    socket.on('alarme', (disparou) => {
        const limiteMaxLuz = 900; // Se o valor da leitura for maior que 900 o sensor não está recebendo luz, 
                                  // o alarme vai ser disparado
        if(disparou > limiteMaxLuz){
            desligarAlarme();
            desligarAlarmeCheckBox();
            ligarluzes();
        }
    })
}

iniciarAplicacao();