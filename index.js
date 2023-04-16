// Variables for HTML elements
const loginModal = document.getElementById('login-modal');
const usernameInput = document.querySelector('#login-modal input[name="username"]');
const enterButton = document.querySelector('#login-modal button[type="submit"]');
const main = document.querySelector("main");
const inputMessage = document.querySelector('.image');


const sidebar = document.querySelector('.sidebar');
const toggleButton = document.getElementById('toggle-button');

// constants
const API_PARTICIPANTS = 'https://mock-api.driven.com.br/api/vm/uol/participants'
const API_STATUS = 'https://mock-api.driven.com.br/api/vm/uol/status'
const API_MESSAGES = 'https://mock-api.driven.com.br/api/vm/uol/messages'
const TOKEN = 'coojthvRpUToSSAQORUcueOI';
const STATUS_UPDATE_INTERVAL = 5000;
const MESSAGES_UPDATE_INTERVAL = 5000;


axios.defaults.headers.common['Authorization'] = TOKEN;


// state
let username = null;


function scrollToBottom() {
  window.scrollTo(0, document.documentElement.scrollHeight);
}

function modalHidden(){
  loginModal.style.display = 'none';
}

function login(user){
  axios.post(API_PARTICIPANTS, {
    name: user
  })
  .then(response => {
    console.log(`login success ${response.data}`);
    modalHidden()
    sendUserRequest(user, API_STATUS)
  })
  .catch(error => {
    console.log(error.response.data);
    console.log(`Logging Error ${user} js existe`);
  });
}


async function sendUserRequest(user, URL) {
  console.log('Sending user request')
  try {
    const intervalId = setInterval(async () => {
      try {
        const response = await axios.post(URL, { name: user });
        console.log(`sendUserRequest ${response.data}`);
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  } catch (error) {
    clearInterval(intervalId);
    console.log(error);
  }
}


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
          scrollToBottom()
        }
      }
      
    })
    .catch(error => {
      console.log(error);
    });
  }, 100);
}


function addParticipantsToUI(participants) {
  
  const participantList = document.querySelector('.participants-list');
  participantList.textContent = '';

  const participantHtml = participants.map(participant => `<li><img src="./assets/people.svg" />${participant.name}</li>`).join('');
  participantList.innerHTML = participantHtml;
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

function sendMessage(username, message) {
  axios.post('https://mock-api.driven.com.br/api/vm/uol/messages', {
    from: username,
    to: 'Todos',
    text: message,
    type: 'message'
  })
  .then(response => {
    // console.log(response.data);
    // // LoadMessages(); // Atualiza as mensagens
    checkNewMessages()
  })
  .catch(error => {
    console.log(error);
    location.reload(); // Recarrega a página se houver erro
  });
}

function handleSendMessage() {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value.trim();
  if (message) {
    sendMessage(username, message);
    messageInput.value = '';
  }
}

function sidebarToggle(){
  sidebar.classList.toggle('open');
  toggleButton.classList.toggle('open');
  async function getParticipants() {
    try {
      const response = await axios.get('https://mock-api.driven.com.br/api/vm/uol/participants');
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  getParticipants()
  .then(participants => {
    // console.log(participants);
    addParticipantsToUI(participants);
  })
  .catch(error => console.log(error));

  
}


// event listeners
enterButton.addEventListener('click', (event) => {
  event.preventDefault();
  username = usernameInput.value.trim();
  console.log(`Welcome, ${username}!`);
  login(username)
  checkNewMessages()
  // updateParticipants()

  inputMessage.addEventListener('click', handleSendMessage);
  toggleButton.addEventListener('click', sidebarToggle)
  main.addEventListener('click', sidebarToggle)
});


