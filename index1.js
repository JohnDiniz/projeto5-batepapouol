const closeModalButton = document.getElementById('enter');
const loginModal = document.getElementById('login-modal');
const main = document.querySelector('main');
let username = 0;

const userurl = 'https://mock-api.driven.com.br/api/vm/uol/participants';

const form = document.querySelector('form');
const usernameInput = document.querySelector('input[name="username"]');


const input = document.getElementById('messageInput')
const image = document.querySelector('.image');

token = 'coojthvRpUToSSAQORUcueOI'

axios.defaults.headers.common['Authorization'] = token;


function modalHidden(){
  loginModal.style.display = 'none';
}



function login(username) {
  axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', { name: username })
    .then(response => {
      if (response.status === 200) {
        setInterval(() => {
          axios.post('https://mock-api.driven.com.br/api/vm/uol/status', { name: username })
            .then(response => {
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }, 5000);

        LoadMessages();
      } else {
        // if server responds with status 400, the username is already taken
        // ask for a new username
        console.log("Username already taken, please choose a different one");
      }
    })
    .catch(error => {
      console.log(error);
    });
}


function sendMessage(username, message) {
  axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', {
    from: username,
    to: 'Todos',
    text: message,
    type: 'message'
  })
  .then(response => {
    console.log(response.data);
    LoadMessages(); // Atualiza as mensagens
  })
  .catch(error => {
    console.log(error);
    // location.reload(); // Recarrega a página se houver erro
  });
}




function LoadMessages() {
  axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
  .then(response => {
    console.log(response.data);
    let messages = response.data
    for (let i = 0; i < messages.length; i++) {
      console.log(messages[i].from,messages[i].text);
      addMessage(messages[i].from,messages[i].text,messages[i].type,messages[i].time)
      }
  })
  .catch(error => {
    console.log(error);
  });
}



function addMessage(userName, message, messageType, timestamp) {
  const messageClass = messageType === 'normal' ? '' : 'status';
  const messageBackground = messageType === 'status' ? 'background-color: #DCDCDC;' : '';
  const messageHtml = `
    <div data-test="message" class="message ${messageClass}" style="${messageBackground}">
      <span class="time">${timestamp}</span>
      <span class="text">
        <span class="username">${userName}</span> ${message}
      </span>
    </div>
  `;
  main.innerHTML += messageHtml;
}




form.addEventListener('submit', (event) => {
  event.preventDefault();
  username = usernameInput.value;
  modalHidden()
  // addMessage(username,' entra na sala...','login')
  console.log(`username: ${username}`);
  login(username)
  LoadMessages(username)
});


input.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) { 
    image.click(); 
  }
});

image.addEventListener('click', () => {
  const message = input.value;
  messageInput.value = '';
  // addMessage(username, message, 'normal');
  sendMessage(username,message);
});



// function getTimeString() {
//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const seconds = now.getSeconds();
//   const timeString = `(${hours}:${minutes}:${seconds})`;
//   return timeString;
// }
