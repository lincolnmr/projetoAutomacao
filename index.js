const baseUrl = 'http://localhost:3000';

const addEventCheckbox = () => {
    document.querySelector("#botaoLuz").addEventListener('click', () => {
        if (isChecked()) {
            setOn();
        }
        else {
            setOff();
        }
    });
}

const adicionarEventoTemperatura = () => {
       setInterval(async () => {
        document.querySelector('#botaoTemperaturar').value = await obterTemperatura();
        }, 1000);
}

const isChecked = () => {
    return document.querySelector('#botaoLuz').checked;
}

const setOn = () => {
    axios.post(`${baseUrl}/led/on`);
}

const setOff = () => {
    axios.post(`${baseUrl}/led/off`);
}

const obterTemperatura = async () => {
    return (await axios.get(`${baseUrl}/temperatura`)).data.temperatura
}

const addEvents = () => {
    addEventCheckbox();
    adicionarEventoTemperatura();
}

addEvents();