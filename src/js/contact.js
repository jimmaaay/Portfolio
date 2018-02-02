import { parents } from './helpers';

/**
 * Was planning on using FormData but edge doesn't support parts
 * that I was gonna use :(
 */
document.addEventListener('submit', (e) => {
  const { target } = e;
  if (! target.matches('.contact__form')) return;
  const { name, email, message } = target;
  e.preventDefault();
  const data = {
    name: name.value,
    email: email.value,
    message: message.value,
  };

  // attempt at obscuring email address from souce code
  fetch(`https://formspree.io/${atob('dGhpc2d1eUBqaW1teXRob21wc29uLm1l')}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  })
  .then(res => res.json())
  .then(() => {
    console.log('SENT FORM');
  })
  .catch((err) => {
    console.log('ERROR WITH FORM', err);
  })

});