import lazyLoad from './lazyload';
import { parents, domBuilder } from './helpers';

document.addEventListener('lazyload:loaded', (e) => {
  const { target } = e;
  const item = parents(target, '.portfolio__item');
  if (item === false) return;
  const loader = item.querySelector('.loader');
  if (loader == null) return;
  loader.parentElement.removeChild(loader);
});

let portfolioJSON = false;

export default () => {

  const INITIAL_NO_SHOWING = 3;
  let noShowing = INITIAL_NO_SHOWING;

  const fetchPortfolioJSON = () => {
    return fetch('/portfolio/index.json')
      .then(_ => _.json())
      .then(_ => portfolioJSON = _);
  }

  // Read comment on domBuilder fn about JSX
  const makeItem = (obj) => {

    // Destructure here as UglifyJS wasn't liking destructuring in the parenthesis
    const { url, imgSrc, imgAlt, title } = obj;
    return (
      <li class="portfolio__item">
        <a href={url} class="portfolio__item__a a-reset">
          <div class="loader"></div>
          <img src={imgSrc} alt={imgAlt} class="portfolio__item__image"/>
          <div class="portfolio__item__overlay">
            <h3>{title}</h3>
          </div>
        </a>
      </li>
    );
  };

  const items = document.querySelector('.portfolio__items');
  if (items == null) return;
  const total = parseInt(items.getAttribute('data-total'), 10);
  const loadMoreButton = document.querySelector('.portfolio__load-more');

  // TODO: keep portfolio items loaded if go off the page and back onto it again?
  if (total > INITIAL_NO_SHOWING) {
    const loadClick = () => {
    
      const addItems = () => {
        const itemsToAdd = portfolioJSON
          .slice(noShowing) // skip over items already showing
          .slice(0, 3); // limit to 3 items
        
        itemsToAdd.forEach(({ link, listImage, title }) => {
          const item = makeItem({
            title,
            url: link,
            imgSrc: listImage,
            imgAlt: title,
          });
          items.appendChild(item);
        });

        noShowing = noShowing + itemsToAdd.length;
        if (noShowing === total) {
          loadMoreButton.removeEventListener('click', loadClick);
          loadMoreButton.parentElement.removeChild(loadMoreButton);
        }
        loadMoreButton.disabled = false;
      };

      loadMoreButton.disabled = true;
      if (portfolioJSON === false) {
        // TODO: handle error getting JSON better
        return fetchPortfolioJSON()
          .then(addItems)
          .catch((err) => {
            console.log(err);
          });
      }
      addItems();
    };

    loadMoreButton.style.display = '';
    loadMoreButton.addEventListener('click', loadClick);

    return () => {
      if (loadMoreButton != null) loadMoreButton.removeEventListener('click', loadClick);
    }

  }


}