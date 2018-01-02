import { parents } from './helpers';
const form = Array.from(document.querySelectorAll('.form'));

if (form.length !== 0) {
  const eventFired = (e) => {
    const { target } = e;
    // Check to see if element that triggered event is in .form element
    if (parents(target, '.form') === false) return; 
    const item = parents(target, '.form__item');
    const isOpen = item.classList.contains('form__item--open');
    const value = target.value.trim();
    if (value === '' && isOpen) item.classList.remove('form__item--open');
    else if (value !== '' && !isOpen) item.classList.add('form__item--open');
  };
  document.addEventListener('change', eventFired);
  document.addEventListener('input', eventFired);
}