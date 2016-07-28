require('./style/splash-screen.scss');
require('./style/vendor/pacman.css');

const pacmanMarkup = `
<div class="splashWrapper">
  <div class="la-pacman la-3x">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>`;

let rootEl;

const createPacman = () => {
  rootEl = document.createElement('div');
  rootEl.setAttribute('id', 'splashScreen');
  rootEl.innerHTML = pacmanMarkup;
  document.body.appendChild(rootEl);
};

const create = () => createPacman();

const destroy = () => document.body.removeChild(rootEl);

export default {
  create,
  destroy,
};
