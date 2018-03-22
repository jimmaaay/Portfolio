import { parents } from './helpers';

export default (lightboxControls) => {

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
      const resetFormItems = array => array.forEach(el => {
        el.value = '';
        el.parentElement.classList.remove('form__item--open');
      });
      resetFormItems([name, email, message]);
      lightboxControls.changeContent(`
        <p>Thank you for getting in touch. I'll try to get back to you as soon as possible</p>
      `);
      lightboxControls.open();
    })
    .catch((err) => {
      const emailAddress = atob('dGhpc2d1eUBqaW1teXRob21wc29uLm1l');
      lightboxControls.changeContent(`
        <p>
          An error occoured when sending your form. Please try emailing me at 
          <a href="mailto:${emailAddress}">${emailAddress}</a>
        </p>
      `);
      lightboxControls.open();
    });

  });
}