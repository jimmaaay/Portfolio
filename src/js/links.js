import { parents } from './helpers';

const { body } = document;

export default (events) => {
  const mainTag = document.querySelector('main');

  /**
   * Store the browser history every time its changed so we can work out if we need
   * to do anything when the popstate event fires
   */
  const urlHistory = [
    new URL(location.href),
  ];

  // Changes the HTML of the main tag
  const changeContent = (html) => {
    mainTag.innerHTML = html;
    mainTag.classList.remove('hidden');
    events.emit('CHANGED_PAGE');
    body.className = '';
    const script = document.querySelector('.page-variables');
    if (script == null) return;
    const json = script.textContent.trim();
    const data = JSON.parse(json);
    body.className = data.className;
  };

  // TODO: Store response for browsers that do not support service worker?
  const changePage = (pageURI) => {
    const partialUrl = `/partials${pageURI}`;
    const time = performance.now();
    mainTag.classList.add('hidden');
    events.emit('CHANGING_PAGE');
    body.classList.add('page-transition');

    fetch(partialUrl)
      .then(res => res.text())
      .then((html) => {
        // Wait at least 500ms before changing the content
        const duration = 500 - (performance.now() - time);

        if (duration < 0) return changeContent(html);
        setTimeout(() => {
          changeContent(html);
        }, duration);
      })
      .catch((err) => {
        // Just fallback by sending the user to the url
        window.location = url;
      });
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
        url.origin !== location.origin // Not the same domain
        || (url.origin === location.origin && url.pathname === location.pathname) // Same page
      ) return;

      e.preventDefault();
      
      history.pushState({}, null, url.href);
      urlHistory.push(url);
      changePage(url.pathname);
    }

  });

  // Scroll down the page before the page is unhidden.
  events.on('CHANGED_PAGE', () => {
    if (location.hash === '') {
      /**
       * Don't want user to be halfway down the page when the 
       * content changes.
       */
      scrollTo(0, 0);
      return;
    }
    // Scroll down to the element linked to with hash link
    const { fontSize } = window.getComputedStyle(document.documentElement);
    const element = document.querySelector(location.hash);
    if (element == null) return scrollTo(0,0);
    const parsedFontSize = parseFloat(fontSize.replace('px', ''), 10);
    const { top } = element.getBoundingClientRect();
    
    // Scolling to the position of the content after the transition has happened
    scrollTo(0, top - (5 * parsedFontSize));
  });

  window.addEventListener('popstate', (e) => {
    const url = new URL(location.href);
    urlHistory.push(url);
    const prevItem = urlHistory[urlHistory.length - 2];

    /**
     * See if we're on the same pathname. If so then the popstate event was fired
     * from a hash change. So we don't wanna do anything
     */
    if (url.pathname === prevItem.pathname) return;
    changePage(window.location.pathname);
  });

}


