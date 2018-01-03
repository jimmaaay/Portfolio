const contactForm = document.querySelector('.contact__form');

/* 
 * Was planning on using FormData but edge doesn't support parts
 * that I was gonna use :(
 */

if (contactForm != null) {
  const { name, email, message } = contactForm;
  contactForm.addEventListener('submit', (e) => {
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
}