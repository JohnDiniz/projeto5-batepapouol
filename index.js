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



axios.defaults.headers.common['Authorization'] = TOKEN;


// state
let username = null;


function scrollToBottom() {
  window.scrollTo(0, document.documentElement.scrollHeight);
}

function modalHidden(){
  loginModal.style.display = 'none';
}

async function login(user) {
  try {
    const response = await axios.post(API_PARTICIPANTS, { name: user });
    console.log(`login success ${response.data}`);
    checkNewMessages()
    sendUserRequest(username, API_STATUS)
    modalHidden()
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    console.log(`Logging Error ${user} js existe`);
    throw new Error(`Logging Error ${user} js existe`);
  }
}


async function sendUserRequest(user, URL) {
  console.log('Sending user request')
  try {
   setInterval(async () => {
      try {
        const response = await axios.post(URL, { name: user });
      } catch (error) {
        console.log(error);
      }
    }, 5000);
  } catch (error) {
    // console.log(error);
  }
}


function checkNewMessages() {
  setInterval(() => {
  axios.get(API_MESSAGES)
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
  }, 3000);
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
  axios.post(API_MESSAGES, {
    from: username,
    to: 'Todos',
    text: message,
    type: 'message'
  })
  .then(response => {
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
      const response = await axios.get(API_PARTICIPANTS);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  getParticipants()
  .then(participants => {
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
 


  inputMessage.addEventListener('click', handleSendMessage);
  inputMessage.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      // Enter key was pressed
      console.log('Enter key pressed');
      // call a function or perform an action
    }
  });
  
  toggleButton.addEventListener('click', sidebarToggle)
  main.addEventListener('click', sidebarToggle)
});


