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



const sidebar = document.querySelector('.sidebar');
const toggleButton = document.getElementById('toggle-button');

toggleButton.addEventListener('click', function() {
  sidebar.classList.toggle('open');
  toggleButton.classList.toggle('open');
});

main.addEventListener('click', function() {
  if (sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
    toggleButton.classList.remove('open');
  }
});


function fetchParticipants() {
  return axios.get('https://mock-api.driven.com.br/api/vm/uol/participants')
    .then(response => response.data)
    .catch(error => console.log(error));
}

function addParticipantsToUI(participants) {
  const participantList = document.querySelector('.participants-list');
  participantList.innerHTML = '';
  
  participants.forEach(participant => {
    const participantHtml = `<li><img src="./assets/people.svg" />${participant.name}</li>`;
    participantList.innerHTML += participantHtml;
  });
}

fetchParticipants().then(participants => addParticipantsToUI(participants));

setInterval(() => {
  fetchParticipants().then(participants => addParticipantsToUI(participants));
}, 5000);



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


function modalHidden(){
  loginModal.style.display = 'none';
}

function sendUserRequest(user, URL) {
  setInterval(() => {
    axios.post(URL, user)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, 5000);
}

function login(username) {
  axios.post('https://mock-api.driven.com.br/api/vm/uol/participants', { name: username })
    .then(response => {
      if (response.status === 200) {
        setInterval(() => {
          axios.post('https://mock-api.driven.com.br/api/vm/uol/status', { name: username })
            .then(response => {
              console.log(response.data);
              console.log('login success');
            })
            .catch(error => {
              console.log(error);
              location.reload(); // Recarrega a página se houver erro

            });
        }, 5000);

        checkNewMessages()
      } else {
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
    location.reload(); // Recarrega a página se houver erro
  });
}



form.addEventListener('submit', (event) => {
  event.preventDefault();
  username = usernameInput.value;
  // addMessage(username,' entra na sala...','login')
  console.log(`username: ${username}`);
  login(username)
  sendUserRequest(username, 'https://mock-api.driven.com.br/api/vm/uol/status')
  modalHidden()
  checkNewMessages()
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

