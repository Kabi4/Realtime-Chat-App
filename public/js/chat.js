const socket = io();
// socket.on('updatedCount', (count) => {
//     console.log('We Have a new notification! Count:' + count);
// });

// document.querySelector('#push').addEventListener('click', () => {
//     console.log('This one is sent by you!');
//     socket.emit('notify');
// });
socket.on('welcome', (msg) => {
    console.log(msg);
});

document.querySelector('#push').addEventListener('click', () => {
    const val = document.querySelector('#message').value;
    socket.emit('sendMessage', val);
    document.querySelector('#message').value = '';
});

socket.on('chatMessage', (msg) => {
    const m = document.createElement('p');
    m.textContent = msg;
    document.querySelector('#chat').appendChild(m);
});
