import { parents } from './helpers';

export default (events) => {
  const mainTag = document.querySelector('main');

  const changeContent = (html) => {
    mainTag.innerHTML = html;
    mainTag.classList.remove('hidden');
    events.emit('CHANGED_PAGE');
  };

  document.addEventListener('click', (e) => {
    const { target } = e;
    const item = target.tagName === 'A' 
    ? target
    : parents(target, 'a');

    if (item !== false) {
      const { href } = item;
      const url = new URL(href);    

      // TODO: don't run the code in /project dir
      if (
        url.origin !== location.origin 
        || (url.origin === location.origin && url.pathname === location.pathname)
      ) return;

      e.preventDefault();
      const partialUrl = `/partials${url.pathname}`;
      const time = performance.now();
      mainTag.classList.add('hidden');
      history.pushState({}, null, url.href);
      events.emit('CHANGING_PAGE');
      
      // TODO: Store response for browsers that do not support service worker?
      fetch(partialUrl)
        .then(res => res.text())
        .then((html) => {
          // Wait at least 1s before changing the content
          const duration = 1000 - (performance.now() - time);

          if (duration < 0) return changeContent(html);
          setTimeout(() => {
            changeContent(html);
          }, duration);
        })
        .catch((err) => {
          // Just fallback by sending the user to the url
          window.location = url;
        });

    }

  });

  // Scroll to top of page when mainTag content is hidden
  mainTag.addEventListener('transitionend', (e) => {
    const { target } = e;
    if (target !== mainTag) return;

    /*
     * When this event was firing for the transform property in chrome
     * the top position of the anchor was returning the wrong position.
     * So only listening when the opacity property was changed. 
     */
    if (e.propertyName !== 'opacity') return;
    if (mainTag.classList.contains('hidden')) {
      /*
       * Don't want user to be halfway down the page when the 
       * content changes.
       */
      scrollTo(0, 0);
    } else if(location.hash !== '') {
      const element = document.querySelector(location.hash);
      if (element == null) return scrollTo(0,0);
      const { top } = element.getBoundingClientRect();
      scrollTo(0, top);
    }
  });
}


