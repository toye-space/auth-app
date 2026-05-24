// === TAB SWITCHING ===
function switchTab(tab) {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const tabs = document.querySelectorAll('.tab');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    tabs[0].classList.add('active');
  } else {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    tabs[1].classList.add('active');
  }
}// === SIGNUP ===
async function signup() {
  const username = document.getElementById('signup-username').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const feedback = document.getElementById('signup-feedback');

  if (!username || !email || !password) {
    feedback.className = 'feedback error';
    feedback.textContent = 'All fields are required.';
    return;
  }

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      feedback.className = 'feedback error';
      feedback.textContent = data.message;
      return;
    }

    // Save token and user to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    feedback.className = 'feedback success';
    feedback.textContent = 'Account created! Redirecting...';

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);

  } catch (error) {
    feedback.className = 'feedback error';
    feedback.textContent = 'Something went wrong. Try again.';
  }
}// === LOGIN ===
async function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const feedback = document.getElementById('login-feedback');

  if (!email || !password) {
    feedback.className = 'feedback error';
    feedback.textContent = 'All fields are required.';
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      feedback.className = 'feedback error';
      feedback.textContent = data.message;
      return;
    }

    // Save token and user to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    feedback.className = 'feedback success';
    feedback.textContent = 'Login successful! Redirecting...';

    setTimeout(() => {
      window.location.href = '/dashboard.html';
    }, 1000);

  } catch (error) {
    feedback.className = 'feedback error';
    feedback.textContent = 'Something went wrong. Try again.';
  }
}// === LOAD DASHBOARD ===
async function loadDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch('/api/protected/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      logout();
      return;
    }

    // Display user info
    document.getElementById('username').textContent = user.username;
    document.getElementById('user-id').textContent = user.id;
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-token').textContent = token.substring(0, 40) + '...';

  } catch (error) {
    logout();
  }
}

// === LOGOUT ===
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// === CHECK WHICH PAGE WE ARE ON ===
if (window.location.pathname === '/dashboard.html') {
  loadDashboard();
}