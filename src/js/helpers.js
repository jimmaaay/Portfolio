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