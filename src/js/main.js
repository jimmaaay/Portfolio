import EventEmitter from 'eventemitter3';
import { supportsPassive, callbackKey } from './helpers';
import lazyLoad from './lazyload';
import portfolioInit from './portfolio-items';
import dCarousel from './vendor/d-carousel';
import techInit from './technology';
import linksInit from './links';
import './form';
import './contact';

const events = new EventEmitter();
const header = document.querySelector('.header');
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
  if (typeof portfolioDestroy === 'function') functionsToDestroy.push(portfolioDestroy);
  lazyLoad(Array.from(document.querySelectorAll('img[data-src]')), observer);
  techInit(observer);
};

// TODO: Add a destroy function to dCarousel
// const carousel = document.querySelector('.d-carousel');
// if (carousel != null) {
//   dCarousel(carousel, {
//     paddingLeft: true,
//   });
// }

linksInit(events);
initFunctions();

events.on('CHANGING_PAGE', destroyFunctions);
events.on('CHANGED_PAGE', initFunctions);

if (header != null) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
      header.classList.remove('header--scrolled');
    } else {
      header.classList.add('header--scrolled');
    }
  }, supportsPassive ? { passive: true } : false);
}
