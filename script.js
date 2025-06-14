// Users store: username => { password, avatarColor, score }
function getUsers() {
  return JSON.parse(localStorage.getItem('brickverseUsers') || '{}');
}
function setUsers(users) {
  localStorage.setItem('brickverseUsers', JSON.stringify(users));
}
function getCurrentUser() {
  return localStorage.getItem('brickverseCurrentUser');
}
function setCurrentUser(u) {
  localStorage.setItem('brickverseCurrentUser', u);
}
function clearCurrentUser() {
  localStorage.removeItem('brickverseCurrentUser');
}

// Elements
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const btnLogout = document.getElementById('btn-logout');
const userControls = document.getElementById('user-controls');
const userInfo = document.getElementById('user-info');
const welcomeUser = document.getElementById('welcome-user');

const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const appSection = document.getElementById('app-section');

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const doLoginBtn = document.getElementById('do-login');
const cancelLoginBtn = document.getElementById('cancel-login');
const loginError = document.getElementById('login-error');

const signupUsername = document.getElementById('signup-username');
const signupPassword = document.getElementById('signup-password');
const doSignupBtn = document.getElementById('do-signup');
const cancelSignupBtn = document.getElementById('cancel-signup');
const signupError = document.getElementById('signup-error');

const profileUsername = document.getElementById('profile-username');
const avatarPreview = document.getElementById('avatar-preview');
const avatarColorInput = document.getElementById('avatar-color');
const btnSaveAvatar = document.getElementById('btn-save-avatar');

const gamesList = document.getElementById('games-list');
const workshopList = document.getElementById('workshop-list');
const communityList = document.getElementById('community-list');

const leaderboardBody = document.getElementById('leaderboard-body');
const btnIncreaseScore = document.getElementById('btn-increase-score');
const btnLaunchGame = document.getElementById('btn-launch-game');
const gameLauncher = document.getElementById('game-launcher');

// Sample Data (static for now)
const sampleGames = [
  { id: '1', name: 'Block Race', desc: 'Fast paced parkour game' },
  { id: '2', name: 'Brick Battle', desc: 'Multiplayer combat game' },
  { id: '3', name: 'Buildtopia', desc: 'Creative building sandbox' }
];

const sampleWorkshopItems = [
  { id: 'w1', name: 'Blue Hat', desc: 'Cool blue hat for your avatar' },
  { id: 'w2', name: 'Red Sword', desc: 'Mighty sword to fight' }
];

const sampleCommunityPosts = [
  { id: 'c1', author: 'PlayerOne', content: 'Just reached level 10!' },
  { id: 'c2', author: 'BuilderGal', content: 'Check out my new house!' }
];

// Show / Hide helpers
function show(element) { element.style.display = 'block'; }
function hide(element) { element.style.display = 'none'; }

// Render functions
function renderGames() {
  gamesList.innerHTML = '';
  sampleGames.forEach(game => {
    const div = document.createElement('div');
    div.className = 'game-card';
    div.innerHTML = `<strong>${game.name}</strong><p>${game.desc}</p>`;
    gamesList.appendChild(div);
  });
}

function renderWorkshop() {
  workshopList.innerHTML = '';
  sampleWorkshopItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'workshop-item';
    div.innerHTML = `<strong>${item.name}</strong><p>${item.desc}</p>`;
    workshopList.appendChild(div);
  });
}

function renderCommunity() {
  communityList.innerHTML = '';
  sampleCommunityPosts.forEach(post => {
    const div = document.createElement('div');
    div.className = 'community-post';
    div.innerHTML = `<strong>${post.author}</strong><p>${post.content}</p>`;
    communityList.appendChild(div);
  });
}

function renderLeaderboard() {
  const users = getUsers();
  leaderboardBody.innerHTML = '';
  // Sort users by score desc
  const sortedUsers = Object.entries(users).sort((a,b) => (b[1].score || 0) - (a[1].score || 0));
  sortedUsers.forEach(([username, data]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${username}</td><td>${data.score || 0}</td>`;
    leaderboardBody.appendChild(tr);
  });
}

function updateAvatarPreview(color) {
  avatarPreview.style.backgroundColor = color;
}

function updateUIForUser(username) {
  userControls.style.display = 'none';
  userInfo.style.display = 'flex';
  welcomeUser.textContent = username;

  profileUsername.textContent = username;

  // Load avatar color
  const users = getUsers();
  const userData = users[username] || {};
  const avatarColor = userData.avatarColor || '#3399ff';
  avatarColorInput.value = avatarColor;
  updateAvatarPreview(avatarColor);

  show(appSection);
  hide(loginSection);
  hide(signupSection);

  renderGames();
  renderWorkshop();
  renderCommunity();
  renderLeaderboard();
}

function logout() {
  clearCurrentUser();
  userControls.style.display = 'flex';
  userInfo.style.display = 'none';
  hide(appSection);
}

// Event Listeners

btnLogin.onclick = () => {
  hide(userControls);
  show(loginSection);
  loginError.textContent = '';
  loginUsername.value = '';
  loginPassword.value = '';
};

btnSignup.onclick = () => {
  hide(userControls);
  show(signupSection);
  signupError.textContent = '';
  signupUsername.value = '';
  signupPassword.value = '';
};

btnLogout.onclick = () => {
  logout();
};

cancelLoginBtn.onclick = () => {
  hide(loginSection);
  show(userControls);
};

cancelSignupBtn.onclick = () => {
  hide(signupSection);
  show(userControls);
};

doSignupBtn.onclick = () => {
  const username = signupUsername.value.trim();
  const password = signupPassword.value.trim();
  if(!username || !password) {
    signupError.textContent = 'Fill all fields';
    return;
  }
  const users = getUsers();
  if(users[username]) {
    signupError.textContent = 'Username taken';
    return;
  }
  users[username] = { password, avatarColor: '#3399ff', score: 0 };
  setUsers(users);
  setCurrentUser(username);
  updateUIForUser(username);
};

doLoginBtn.onclick = () => {
  const username = loginUsername.value.trim();
  const password = loginPassword.value.trim();
  if(!username || !password) {
    loginError.textContent = 'Fill all fields';
    return;
  }
  const users = getUsers();
  if(!users[username] || users[username].password !== password) {
    loginError.textContent = 'Invalid credentials';
    return;
  }
  setCurrentUser(username);
  updateUIForUser(username);
};

btnSaveAvatar.onclick = () => {
  const color = avatarColorInput.value;
  const username = getCurrentUser();
  if(!username) return;
  const users = getUsers();
  users[username].avatarColor = color;
  setUsers(users);
  updateAvatarPreview(color);
};

btnIncreaseScore.onclick = () => {
  const username = getCurrentUser();
  if(!username) return;
  const users = getUsers();
  users[username].score = (users[username].score || 0) + 1;
  setUsers(users);
  renderLeaderboard();
};

btnLaunchGame.onclick = () => {
  alert('Launching game (placeholder)');
};

// On load
window.onload = () => {
  const username = getCurrentUser();
  if(username) {
    updateUIForUser(username);
  }
};
