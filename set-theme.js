setTheme();

function setTheme() {
  if (isThemeInLocalStorage()) {
    const theme = localStorage.getItem('theme');

    document.documentElement.classList.toggle(`${theme}-theme`);

    changeThemeSwitcherBg(theme);

    return;
  }
}

function isThemeInLocalStorage() {
  return !!localStorage.getItem('theme');
}

function changeThemeSwitcherBg(theme) {
  if (theme === 'dark') {
    document.addEventListener('DOMContentLoaded', () => {
      document
        .querySelector('.switcher.theme')
        .children[0].setAttribute('checked', 'checked');
    });
  }
}
