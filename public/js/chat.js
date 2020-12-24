const socket = io();
// socket.on('updatedCount', (count) => {
//     console.log('We Have a new notification! Count:' + count);
// });

// document.querySelector('#push').addEventListener('click', () => {
//     console.log('This one is sent by you!');
//     socket.emit('notify');
// });

socket.on('message', (msg) => {
    console.log(msg);
});

document.querySelector('#push').addEventListener('click', () => {
    const val = document.querySelector('#message').value;
    socket.emit('sendMessage', val);
    document.querySelector('#message').value = '';
});

socket.on('chatMessage', (msg) => {
    const m = document.createElement('p');
    console.log(msg);
    m.textContent = msg;
    document.querySelector('#chat').appendChild(m);
});

document.querySelector('#send-location').addEventListener('click', () => {
    const loc = navigator.geolocation;
    if (!loc) {
        alert(
            'You Are using a older version of browser geolocation is not supported!'
        );
        return;
    }
    loc.getCurrentPosition((position) => {
        socket.emit(
            'sendMessage',
            `My location is longitude:|${position.coords.longitude}| & latitude:|${position.coords.latitude}|.`
        );
    });
});
