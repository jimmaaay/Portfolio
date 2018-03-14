import EventEmitter from 'eventemitter3';
import { callbackKey, changePageClasses } from './helpers';
import lazyLoad from './lazyload';
import portfolioInit from './portfolio-items';
import techInit from './technology';
import linksInit from './links';
import './form';
import './contact';
import './header';

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



linksInit(events);
initFunctions();
changePageClasses();

events.on('CHANGING_PAGE', destroyFunctions);
events.on('CHANGED_PAGE', initFunctions);