import { getLoginStatus, loginAdmin } from './api.js';

const form = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#login-button');
const feedbackElement = document.querySelector('#form-feedback');

function setFeedback(message = '', type = '') {
  feedbackElement.textContent = message;
  feedbackElement.className = 'form-feedback';

  if (!message) {
    return;
  }

  feedbackElement.classList.add('is-visible');

  if (type) {
    feedbackElement.classList.add(`is-${type}`);
  }
}

function setLoadingState(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle('is-loading', isLoading);
  submitButton.setAttribute('aria-busy', String(isLoading));
}

function validateForm(email, password) {
  if (!email || !password) {
    return 'Debes completar el email y la contraseña.';
  }

  return '';
}

async function redirectIfAuthenticated() {
  try {
    const status = await getLoginStatus();

    if (status?.authenticated) {
      window.location.replace('./dashboard.html');
    }
  } catch (error) {
    console.error('[ERROR] auth.js unable to verify admin session:', error);
  }
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const validationError = validateForm(email, password);

  if (validationError) {
    setFeedback(validationError, 'error');
    return;
  }

  setFeedback('');
  setLoadingState(true);

  try {
    await loginAdmin({ email, password });
    setFeedback('Acceso correcto. Redirigiendo al panel...', 'success');
    window.location.replace('./dashboard.html');
  } catch (error) {
    setFeedback(
      error.message ||
        'No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.',
      'error'
    );
  } finally {
    setLoadingState(false);
  }
}

redirectIfAuthenticated();
form.addEventListener('submit', handleLoginSubmit);
