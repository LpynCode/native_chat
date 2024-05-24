

const root = document.getElementById("root");
const messages = document.getElementById("messages");
const messages_wrapper = document.getElementById("messages__wrapper");
const send = document.getElementById("send");
const text = document.getElementById("text");

let userName;
while (!userName) {
    userName = prompt("Enter your name");
}

send.addEventListener("click", () => {
    const message = text.value;
    if (!message) return;
    text.value = "";
    sendMessage(message, "message");
})

const ws = new WebSocket("ws://localhost:8080");
ws.onopen = () => {
    sendMessage(userName, "authorization");
}

ws.onmessage = ({ data }) => {
    const response = JSON.parse(data);
    if (Array.isArray(response)) {
        response.forEach((msg) => {
            renderMessage(msg);
        })
        return;
    }
    renderMessage(response);
}

const renderMessage = (data) => {
    const isMine = data.name === userName;
    const classList = isMine ? "message my-message" : "message";
    let text = isMine ? "" : `<b class="name">${data.name}</b>: `;
    text += `<span class="text">${data.text}</span>`;
    const dateBlock = `<div class="date">${formatDate(data.created_at)}</div>`;
    messages.innerHTML += `<div class="${classList}">` + text + dateBlock + "</div>";
    messages_wrapper.scrollTo(0, messages_wrapper.scrollHeight);
}

const sendMessage = (data, type) => {
    ws.send(JSON.stringify({ data, type }));
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        send.click();
    }
    text.focus();
})

const formatDate = (dateStr) => {
    let date = new Date(dateStr);
    const todaysDate = new Date();
    if (date.setHours(0, 0, 0, 0) !== todaysDate.setHours(0, 0, 0, 0)) {
        return new Date(date).toLocaleDateString();
    }
    date = new Date(dateStr);
    return `${date.getHours() / 10 > 1 ? date.getHours() : "0" + date.getHours()}:${date.getMinutes() / 10 > 1 ? date.getMinutes() : "0" + date.getMinutes()}`
};