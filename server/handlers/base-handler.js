const { randomUUID } = require("crypto");


class BaseHandler {
    endpoints = {
        "authorization": this.#authorize.bind(this),
        "message": this.#handleMessage.bind(this)
    };
    clients = new Array();

    constructor(messagesRepository) {
        this.messagesRepository = messagesRepository;
    }

    addConnection(ws) {
        ws.id = randomUUID();
        this.clients.push(ws);
    }

    async handle({ data, ws, ...options }) {
        const prepairedData = JSON.parse(data);
        if (!this.endpoints[prepairedData.type]) return;
        await this.endpoints[prepairedData.type](ws, prepairedData.data, options);
    }

    async #authorize(ws, data, { isBinary }) {
        this.clients.find((client) => client.id === ws.id).name = data;
        const allMessages = await this.messagesRepository.getAll();
        ws.send(JSON.stringify(allMessages), { binary: isBinary });
    }

    async #handleMessage(ws, data, { isBinary }) {
        const created = await this.messagesRepository.create({ text: data, name: ws.name });
        this.clients.forEach((client) => {
            client.send(JSON.stringify(created), { binary: isBinary });
        });
    }
}

module.exports = BaseHandler