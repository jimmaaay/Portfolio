// use similar to $($0).parents('.selector')
export const parents = (e, selector) => {
  let el = e;
  while(! el.matches(selector)) {
    el = el.parentElement;
    if (el == null) {
      el = false;
      break;
    }
  }
  return el;
};

export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

/* 
  JSX is converted using babel-preset-react with the 'pragma' changed to domBuilder
  this allows me to build dom objects using JSX with the below function
*/
export const domBuilder = (tag, props, ...children) => {

  const items = children.map((item) => {
    if (typeof item === 'string') return document.createTextNode(item);
    return item;
  });

  let element;
  if (tag !== '') {
    element = document.createElement(tag);
    if (props != null) {
      for (let key in props) {
        const realKey = key === 'className' ? 'class' : key;
        element.setAttribute(realKey, props[key]);
      }
    }

    items.forEach((el) => {
      element.appendChild(el);
    });

    return element;
  }

};