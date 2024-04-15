import { SnackbarDuration, UmSnackbar, ThemeBuilder } from './index.js';

await customElements.whenDefined('u-side-navigation');
document.body.style.display = '';

window.ThemeMode = {
  Auto: 0,
  Light: 1,
  Dark: 2
};

(function () {

  const sideNavigation = document.querySelector("u-side-navigation");

  function toggleRtl() {
    document.body.classList.toggle("rtl");
  }

  document
    .getElementById("menu-toggle")
    .addEventListener("click", () => sideNavigation.toggleDrawer = !sideNavigation.toggleDrawer);

  document
    .getElementById("rtl-toggle")
    ?.addEventListener("click", toggleRtl);


  let textField = document.querySelector('.u-text-field-box');
  const textInput = document.querySelector('#text-field-box');
  if (textInput) {
    textInput.addEventListener('input', function () {
      if (textInput.value) {
        textField.classList.remove('invalid');
      } else {
        textField.classList.add('invalid');
      }
    });
  }

  function setActiveNavigationItem() {
    const navItems = document.querySelectorAll('u-drawer-item');

    for (let i = 0; i < navItems.length; i++) {
      const navItem = navItems[i];
      if (navItem.pathname !== location.pathname) {
        continue;
      }

      navItem.active = true;
      if (navItem.parentElement.classList.contains('nested-menu-items')) {
        navItem.parentElement.classList.add('expanded');
      }

      break;
    }
  }

  function setExpandableMenus() {
    const nestedMenus = document.querySelectorAll('.nested-menu-items');

    for (const nestedMenu of nestedMenus) {
      const nestedMenuToggle = nestedMenu.previousElementSibling;
      nestedMenuToggle.addEventListener('click', () => nestedMenu.classList.toggle('expanded'));
    }
  }

  function setToggleButtons() {
    const toggleButtons = document.querySelectorAll('.u-icon-toggle-btn');

    for (const button of toggleButtons) {
      const icon = button.firstElementChild;
      button.addEventListener('click', () => {
        if (button.classList.contains('selected')) {
          button.classList.remove('selected');
          icon.classList.remove('mdi-cards-heart');
          icon.classList.add('mdi-cards-heart-outline');
          return;
        }

        button.classList.add('selected');
        icon.classList.add('mdi-cards-heart');
        icon.classList.remove('mdi-cards-heart-outline');
      });
    }
  }

  window.onload = () => setActiveNavigationItem();
  setExpandableMenus();
  setToggleButtons();
})();

hljs.highlightAll();

let currentThemeMode = parseInt(localStorage.currentThemeMode, 10) || 0;

window.setThemeMode = mode => {
  currentThemeMode = mode;
  localStorage.currentThemeMode = mode;
  applyThemeMode();
}

function applyThemeMode() {
  const darkMode = currentThemeMode === ThemeMode.Dark ||
    currentThemeMode  === ThemeMode.Auto && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!darkMode) {
    document.body.classList.remove('u-dark-mode');
    return;
  }

  document.body.classList.add('u-dark-mode');
}

applyThemeMode();

window.createTheme = color => {
  const styles = ThemeBuilder.create(color).build();

  let themeStylesElement = document.getElementById('theme-styles');

  if (!themeStylesElement) {
    themeStylesElement = document.createElement('style');
    themeStylesElement.id = 'theme-styles';
    document.head.appendChild(themeStylesElement);
  }

  themeStylesElement.innerText = styles;
}

window.UmSnackbar = UmSnackbar;
window.SnackbarDuration = SnackbarDuration;
