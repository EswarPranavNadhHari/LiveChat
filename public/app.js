(()=>{
    const socket = io();
    let userName;
    const namePage = document.querySelector('.namePage');
    const nameInput = document.querySelector('#nameInput');
    const setNameButton = document.querySelector('#setNameButton')
    const chat = document.querySelector('.chat');
    const sender = document.querySelector('.sender');
    const player = document.querySelector('.player');
    const sendButton = document.querySelector('#sendButton')
    const inputText = document.querySelector('#inputText');

    player.style.display = 'none';

    setNameButton.addEventListener('click',()=>{
        if(nameInput.value.trim()){
            userName = nameInput.value.trim();
            let viewportWidth = window.innerWidth;
            let viewportHeight = window.innerHeight;
            console.log(userName);
            namePage.style.display = 'none';
            player.style.display = 'grid';

            socket.emit('setUsername', {userName, viewportHeight, viewportWidth});
        }
        
    });

    sendButton.addEventListener('click', ()=>{
        if(inputText.value.trim()){
            let message = inputText.value.trim();
            socket.emit('message', message);
            inputText.value = '';
        }
    });

    nameInput.addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            setNameButton.click();
        }
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
        }
        chat.appendChild(messageElement);
        chat.scrollTop = chat.scrollHeight;
    });


})();
