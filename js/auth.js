// Google Authentication Integration for sandu-sula

const GOOGLE_CLIENT_ID = '588141961296-h2c13nn4bh9ob0hbfquie3rgbmd9nbgd.apps.googleusercontent.com';
let tokenClient = null;

// Initialize Google Identity Services
function initGoogleAuth() {
  if (!window.google || !google.accounts) {
    return;
  }

  // 1. Initialize modern OAuth2 Token Client (Popup flow compliant with Google Secure Response Handling)
  if (google.accounts.oauth2) {
    try {
      tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            await fetchAndSaveUserProfile(tokenResponse.access_token);
          } else if (tokenResponse.error) {
            console.error('Google Auth Error:', tokenResponse.error);
          }
        },
      });
    } catch (e) {
      console.error('Error initializing token client:', e);
    }
  }

  // 2. Initialize GIS ID token client (Credential response)
  if (google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } catch (e) {
      console.error('Error initializing GIS ID client:', e);
    }
  }
}

// Handle GIS JWT Credential
function handleCredentialResponse(response) {
  try {
    const user = decodeJwtResponse(response.credential);
    const profile = {
      name: user.name,
      given_name: user.given_name || user.name,
      email: user.email,
      picture: user.picture,
      phone: user.phone || null
    };
    sessionStorage.setItem('sandusula_user', JSON.stringify(profile));
    handleAuthSuccess(profile);
  } catch (err) {
    console.error('Error decoding credential response:', err);
  }
}

// Decode JWT token payload without external libraries
function decodeJwtResponse(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

// Fetch Google User Profile using Access Token
async function fetchAndSaveUserProfile(accessToken) {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const user = await response.json();
    // Ensure phone field exists even if null
    user.phone = user.phone || null;
    sessionStorage.setItem('sandusula_user', JSON.stringify(user));
    handleAuthSuccess(user);
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
  }
}

// Trigger Google Sign In (Called when Google button is clicked)
function loginWithGoogle() {
  // Check if running on file:// protocol
  if (window.location.protocol === 'file:') {
    alert("Google Sign-In requires running through a local server (e.g. http://localhost:5500 via VS Code Live Server).\n\nGoogle OAuth blocks requests directly from file:// protocol.");
    return;
  }

  // If tokenClient is ready, request access token via Google popup
  if (tokenClient) {
    tokenClient.requestAccessToken({ prompt: 'select_account' });
    return;
  }

  // If Google SDK is not ready yet, initialize and retry
  if (window.google && google.accounts) {
    initGoogleAuth();
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: 'select_account' });
      return;
    }
  }

  // If still loading Google library, wait momentarily
  let attempts = 0;
  const interval = setInterval(() => {
    attempts++;
    if (window.google && google.accounts && google.accounts.oauth2) {
      clearInterval(interval);
      initGoogleAuth();
      if (tokenClient) {
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      }
    } else if (attempts > 15) {
      clearInterval(interval);
      alert("Google Sign-In service is taking longer than usual to load. Please make sure your internet connection is active and third-party scripts are not blocked.");
    }
  }, 200);
}

// UI Feedback after successful authentication
function handleAuthSuccess(user) {
  const alertEl = document.getElementById('signin-alert') || document.getElementById('signup-alert');
  if (alertEl) {
    alertEl.style.display = 'block';
    const displayName = user.given_name || user.name || user.email;
    alertEl.innerHTML = `Welcome, <strong>${displayName}</strong>! Signed in with Google. Redirecting...`;
  }
  setTimeout(() => {
    // Check if there's a redirect URL stored
    const redirectUrl = sessionStorage.getItem('sandusula_redirect_after_auth');
    if (redirectUrl) {
      sessionStorage.removeItem('sandusula_redirect_after_auth');
      window.location.href = redirectUrl;
    } else {
      window.location.href = 'index.html';
    }
  }, 1200);
}

// Sign out helper
function signOutUser() {
  sessionStorage.removeItem('sandusula_user');
  window.location.reload();
}

// Render user profile in navbar if signed in
function updateNavbarUser() {
  const stored = sessionStorage.getItem('sandusula_user');
  const navActions = document.querySelector('.nav-actions');
  if (stored && navActions) {
    try {
      const user = JSON.parse(stored);
      const name = user.given_name || user.name || 'User';
      const avatar = user.picture || 'images/logo.jpeg';
      navActions.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="${avatar}" alt="${name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--primary);" />
          <span style="font-weight: 500; font-size: 0.95rem; color: var(--text-dark);">${name}</span>
          <button onclick="signOutUser()" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem; margin-left: 6px;">Sign out</button>
        </div>
      `;
    } catch (e) {
      console.error(e);
    }
  }
}

// Initialize on page load and on window focus
window.addEventListener('DOMContentLoaded', () => {
  initGoogleAuth();
  updateNavbarUser();
});

window.addEventListener('load', () => {
  initGoogleAuth();
  updateNavbarUser();
});
