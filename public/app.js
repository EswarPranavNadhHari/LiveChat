(()=>{
    const socket = io();
    const chatPage = document.querySelector('.chatPage');
    const header = document.querySelector('.header');
    const chat = document.querySelector('.chat');
    const sender = document.querySelector('.sender');
    const player = document.querySelector('.player');
    const sendButton = document.querySelector('#sendButton')
    const inputText = document.querySelector('#inputText');
    const audio = new Audio('sounds/ping.mp3');


    let token = localStorage.getItem("token");
    let data = JSON.parse(atob(token.split(".")[1]));
    let userName = data.username;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    socket.emit('setUsername', userName, viewportWidth, viewportHeight, window.location.pathname);

    sendButton.addEventListener('click', ()=>{
        if(inputText.value.trim()){
            let message = inputText.value.trim();
            socket.emit('message', message);
        }
        inputText.value = '';
    });

    inputText.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            sendButton.click();
        }
    });

    socket.on('userJoined', (name)=>{
        const joinMessage = document.createElement('div');
        joinMessage.innerText = `${name.toUpperCase()} joined the chat`;
        joinMessage.style.margin = '10px';
        chat.appendChild(joinMessage);
        chat.scrollTop = chat.scrollHeight;
    });

    socket.on('userLeft', (name)=>{
        const leaveMessage = document.createElement('div');
        leaveMessage.innerText = `${name.toUpperCase()} left the chat`;
        leaveMessage.style.margin = '10px';
        chat.appendChild(leaveMessage);
        chat.scrollTop = chat.scrollHeight;
    });

    socket.on('message', (data) => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${data.name === userName ? 'my-message' : 'other-message'}`;
        
        if(messageElement.classList.contains('my-message')){
          messageElement.innerHTML = `<div id='text'>${data.message}</div>`;
        }
        if(messageElement.classList.contains('other-message')){
          messageElement.innerHTML = `<div id='text'>${data.name.toUpperCase()}: ${data.message}</div>`;
          audio.play();
        }
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    });


})();
