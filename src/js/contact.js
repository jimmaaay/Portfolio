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
      'form-name': target['form-name'].value,
    };

    const urlEncodedData = Object.keys(data)
      .map((key) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');

    // attempt at obscuring email address from souce code
    fetch(target.action, {
      method: 'POST',
      body: urlEncodedData,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
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