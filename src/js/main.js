import EventEmitter from 'eventemitter3';
import { callbackKey, changePageClasses } from './helpers';
import lazyLoad from './lazyload';
import portfolioInit from './portfolio-items';
import techInit from './technology';
import linksInit from './links';
import { lightbox } from './lightbox';
import './form';
import contactInit from './contact';
import './header';

const lightboxControls = lightbox();
const events = new EventEmitter();
let functionsToDestroy = [];

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((_) => {
    _.target[callbackKey](_, observer);
  });
}, {
  threshold: Array.from(new Array(50)).map((_, i) => {
    return i * 0.02;
  }),
});

const destroyFunctions = () => {
  functionsToDestroy.forEach((fn) => fn);
  
  // Remove everything currently added to the observer
  observer.disconnect();

  functionsToDestroy = [];
};

const initFunctions = () => {
  const portfolioDestroy = portfolioInit();
  const techDestroy = techInit(observer);
  if (typeof portfolioDestroy === 'function') functionsToDestroy.push(portfolioDestroy);
  functionsToDestroy.push(techDestroy);
  lazyLoad(Array.from(document.querySelectorAll('img[data-src]')), observer);
};

document.getElementById('attribution').addEventListener('click', (e) => {
  e.preventDefault();
  lightboxControls.open();
  lightboxControls.changeContent(`
    <h2>Attribution</h2>
    <p><small>Phone illustration made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></small></p>
    <p><small>Screen illustration made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></small></p>
  `);
});

contactInit(lightboxControls);
linksInit(events);
initFunctions();
changePageClasses();

window.lightbox = lightboxControls;

events.on('CHANGING_PAGE', destroyFunctions);
events.on('CHANGED_PAGE', initFunctions);