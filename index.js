const baseUrl = 'http://localhost:3000';

const eventoCheckbox = () => {

    document.querySelector("#luzSala").addEventListener('click', () => {
        if (checarLuzSala()) {
            ligarLuz();
        }
        else {
            desligarLuz();
        }
    });

    document.querySelector("#luzQuarto").addEventListener('click', () => {
        if (checarLuzQuarto()) {
            ligarLuz();
        }
        else {
            desligarLuz();
        }
    });

    document.querySelector("#luzCozinha").addEventListener('click', () => {
        if (checarLuzCozinha()) {
            ligarLuz();
        }
        else {
            desligarLuz();
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

const adicionarEventoTemperatura = () => {
       setInterval(async () => {
        document.querySelector('#botaoTemperatura').value = await obterTemperatura();
        }, 1000);
}

// LUZ
const checarLuzSala = () => {
    return document.querySelector('#luzSala').checked;
}

const checarLuzQuarto = () => {
    return document.querySelector('#luzQuarto').checked;
}

const checarLuzCozinha = () => {
    return document.querySelector('#luzCozinha').checked;
}

const ligarLuz = () => {
    axios.post(`${baseUrl}/led/on`);
}

const desligarLuz = () => {
    axios.post(`${baseUrl}/led/off`);
}

//ALARME
const isCheckedAlarm = () => {
    return document.querySelector('#botaoAlarme').checked;
}

const ligarAlarme = () => {
    axios.post(`${baseUrl}/diodo/on`);
}

const desligarAlarme = () => {
    axios.post(`${baseUrl}/diodo/off`);
}

// TEMPERATURA
const obterTemperatura = async () => {
    return (await axios.get(`${baseUrl}/temperatura`)).data.temperatura
}

// ADICIONAR EVENTOS
const addEvents = () => {
    eventoCheckbox();
    adicionarEventoTemperatura();
}

addEvents();