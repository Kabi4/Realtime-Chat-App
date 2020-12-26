const socket = io();
// socket.on('updatedCount', (count) => {
//     console.log('We Have a new notification! Count:' + count);
// });

// document.querySelector('#push').addEventListener('click', () => {
//     console.log('This one is sent by you!');
//     socket.emit('notify');
// });

const $input = document.querySelector('#message');
const $locButton = document.querySelector('#send-location');
const $msgButton = document.querySelector('#push');
const $chat = document.querySelector('#chat');

const $msgchattemp = document.querySelector('#message-template').innerHTML;
const $locchattemp = document.querySelector('#location-template').innerHTML;
const $alerttemp = document.querySelector('#alert-template').innerHTML;

const { username, roomname } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

socket.on('message', (msg, color) => {
    const htmllink = Mustache.render($alerttemp, {
        msg,
        color,
    });
    $chat.insertAdjacentHTML('beforeend', htmllink);
    return;
});

const sendMessages = () => {
    const val = $input.value;
    if (val.trim() === '') {
        return;
    }
    $locButton.setAttribute('disabled', 'disabled');
    $msgButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', val, false, Date.now(), (error) => {
        $locButton.removeAttribute('disabled');
        $msgButton.removeAttribute('disabled');
        $input.focus();
        if (error) {
            return console.log('The mesage violates the language rules!');
        }
        $input.value = '';
        console.log('Message Delivered!');
    });
};

$msgButton.addEventListener('click', () => {
    sendMessages();
});

$input.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        sendMessages();
    }
});

socket.on('chatMessage', (msg, isLocation, createdAt) => {
    // const m = document.createElement('p');
    // m.textContent = msg;
    // $chat.appendChild(m);
    // if (isLocation) {
    //     const a = document.createElement('a');
    //     a.href = isLocation;
    //     a.textContent = 'Visit';
    //     a.target = '_blank';
    //     m.appendChild(a);
    // }
    if (isLocation) {
        const htmllink = Mustache.render($locchattemp, {
            msg: msg,
            link: isLocation,
            createdAt,
        });
        $chat.insertAdjacentHTML('beforeend', htmllink);
        return;
    }
    const htmlmsg = Mustache.render($msgchattemp, {
        msg,
        createdAt,
    });
    $chat.insertAdjacentHTML('beforeend', htmlmsg);
});

$locButton.addEventListener('click', () => {
    $locButton.setAttribute('disabled', 'disabled');
    $msgButton.setAttribute('disabled', 'disabled');
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
            `My location is longitude: { ${position.coords.longitude} } || latitude: { ${position.coords.latitude} }.`,
            `https://google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`,
            Date.now(),
            (error) => {
                $locButton.removeAttribute('disabled');
                $msgButton.removeAttribute('disabled');
                $input.focus();
                if (error) {
                    return console.log(
                        'The mesage violates the language rules!'
                    );
                }
                console.log('Message Delivered!');
            }
        );
    });
});

socket.emit('join', { username, roomname });

socket.on('error', (error) => {
    alert(error);
    location.href = '/';
});
