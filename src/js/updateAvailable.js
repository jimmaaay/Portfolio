export default () => {
  if (window.serviceWorkerReg == null) return;
  const template = document.querySelector('#update-available');

  const notification = document.importNode(template.content, true);
  const element = notification.querySelector('.update-available');
  const button = element.querySelector('.button');

  button.addEventListener('click', () => {
    window.location.reload();
  });

  window.updateAvailable
    .then((updateAvailable) => {
      if (! updateAvailable) return;

      requestAnimationFrame(() => {
        document.body.appendChild(notification);
    
        requestAnimationFrame(() => {
          element.classList.add('update-available--show');
        })
      });

    });

} 