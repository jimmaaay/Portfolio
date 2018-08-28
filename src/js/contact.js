export default (lightboxControls, events) => {
  const renderRecpatcha = _ => window.grecaptcha.execute();
  const callbackName = 'jimmyRecaptchaRender';
  const recaptchaURI = `https://www.google.com/recaptcha/api.js?onload=${callbackName}&render=explicit`;
  const script = document.createElement('script');

  script.src = recaptchaURI;
  script.async = true;
  document.body.appendChild(script);

  window[callbackName] = renderRecpatcha;
  events.on('CHANGED_PAGE', renderRecpatcha);

  const run = (recpatchaResponse) => {
    const form = document.querySelector('.contact__form');
    if (form == null || recpatchaResponse == null) return;
    const button = form.querySelector('button[type="submit"]');

    const { name, email, message } = form;
    const data = {
      name: name.value,
      email: email.value,
      message: message.value,
      'form-name': form['form-name'].value,
      'g-recaptcha-response': recpatchaResponse,
    };

    const urlEncodedData = Object.keys(data)
      .map((key) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent(data[key]);
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');

    // attempt at obscuring email address from souce code
    fetch(form.action, {
      method: 'POST',
      body: urlEncodedData,
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    })
    .then((res) => {
      if (res.status === 200) return true;
      throw new Error('NOT_200');
    })
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
      button.disabled = false;
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

  }

  if (window.contactRealSubmit !== undefined) {
    run(window.contactRealSubmit);
  }

  window.contactRealSubmit = run;

}