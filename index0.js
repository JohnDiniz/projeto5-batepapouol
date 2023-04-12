const closeModalButton = document.getElementById('enter');
const loginModal = document.getElementById('login-modal');
const main = document.querySelector('main');
const form = document.querySelector('form');
const usernameInput = document.querySelector('input[name="username"]');
const input = document.getElementById('messageInput')
const image = document.querySelector('.image');

let username = 0;

const userurl = 'https://mock-api.driven.com.br/api/vm/uol/participants';



token = 'coojthvRpUToSSAQORUcueOI'

axios.defaults.headers.common['Authorization'] = token;


function checkNewMessages() {
  setInterval(() => {
  axios.get('https://mock-api.driven.com.br/api/vm/uol/messages')
    .then(response => {
      const messages = response.data;
      const lastMessage = document.querySelector('.message:last-of-type');
      const lastMessageTime = lastMessage ? lastMessage.querySelector('.time').textContent : '';
      
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        if (message.time > lastMessageTime) {
          const { from, text, type, time } = message;
          addMessage(from, text, type, time);
        }
      }
      
    })
    .catch(error => {
      console.log(error);
    });
  }, 5000);
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

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight - window.innerHeight);
}

// executa a função de verificação de novas mensagens a cada 5 segundos
// setInterval(checkNewMessages, 5000);




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
              modalHidden()
              checkNewMessages()
              console.log(response.data);
            })
            .catch(error => {
              console.log(error);
            });
        }, 5000);

        // LoadMessages();
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
    // LoadMessages(); // Atualiza as mensagens
    checkNewMessages()
  })
  .catch(error => {
    console.log(error);
    // location.reload(); // Recarrega a página se houver erro
  });
}



form.addEventListener('submit', (event) => {
  event.preventDefault();
  username = usernameInput.value;
  // addMessage(username,' entra na sala...','login')
  console.log(`username: ${username}`);
  login(username)
});

input.addEventListener('keyup', (event) => {
  if (event.keyCode === 13) { 
    image.click(); 
  }
});

image.addEventListener('click', () => {
  const message = input.value;
  messageInput.value = '';
  // addMessage(username, message);
  sendMessage(username,message);
});

