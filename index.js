// Theme mode switching start
const themeSwitcher = document.querySelector('.switcher.theme');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

setBgToThemeSwitcher();


function setBgToThemeSwitcher() {
  if (prefersDarkScheme.matches && !localStorage.getItem('theme')) {
    themeSwitcher.children[0].setAttribute('checked', 'checked');
  }
}

themeSwitcher.addEventListener('change', switchTheme);

function switchTheme() {
  let theme;

  if (prefersDarkScheme.matches) {
    document.documentElement.classList.toggle('light-theme');

    theme = document.documentElement.classList.contains('light-theme')
      ? 'light'
      : 'dark';
  } else {
    document.documentElement.classList.toggle('dark-theme');

    theme = document.documentElement.classList.contains('dark-theme')
      ? 'dark'
      : 'light';
  }

  setThemeToLS(theme);
}

function setThemeToLS(theme) {
  localStorage.setItem('theme', theme);
}

// Theme mode switching end
// Language switching start
const langSwitcher = document.querySelector('.switcher.lang');
let lang = document.documentElement.lang;

langSwitcher.addEventListener('change', switchLang);

function switchLang() {
  lang = document.documentElement.lang = lang === 'en' ? 'ru' : 'en';

  const navLinks = document.querySelectorAll('.nav .link');
  const timerInputLabels = document.querySelectorAll('.timer__item-label');
  const timerBtns = document.querySelectorAll('.timer__btn');
  const appH1 = document.querySelectorAll('.h1');

  const appContent = {
    en: {
      nav: ['Clock', 'Timer'],
      timerInputLabels: ['Hours', 'Minutes', 'Seconds'],
      timerBtns: ['Stop', 'Start', 'Pause'],
    },
    ru: {
      nav: ['Часы', 'Таймер'],
      timerInputLabels: ['Часы', 'Минуты', 'Секунды'],
      timerBtns: ['Стоп', 'Старт', 'Пауза'],
    },
  };

  for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].textContent = appContent[lang]['nav'][i];
  }

  for (let i = 0; i < timerInputLabels.length; i++) {
    timerInputLabels[i].textContent = appContent[lang]['timerInputLabels'][i];
  }

  for (let i = 0; i < timerBtns.length; i++) {
    timerBtns[i].textContent = appContent[lang]['timerBtns'][i];
  }

  for (let i = 0; i < appH1.length; i++) {
    appH1[i].toggleAttribute('hidden');
  }

  generateEvent(lang);
}

function generateEvent(lang) {
  const event = new CustomEvent('changeLang', {
    bubbles: true,
    detail: { lang: `${lang}` },
  });

  langSwitcher.dispatchEvent(event);
}

// Theme mode switching end
// Navigation start
const nav = document.querySelector('.nav');
const views = document.querySelector('.main').children;
nav.addEventListener('click', toggleView);

function toggleView(event) {
  const view = event.target.getAttribute('href').slice(1);

  for (let i = 0; i < nav.querySelectorAll('*').length; i++) {
    nav.querySelectorAll('*')[i].classList.remove('nav__link--active');
  }

  event.target.classList.add('nav__link--active');

  for (let i = 0; i < views.length; i++) {
    if (views[i].id === view) {
      views[i].classList.remove('visually-hidden');
      continue;
    }

    views[i].classList.add('visually-hidden');
  }
}

// Navigation end

// Clock start
function createElement(tagName, classNames, children, attrs, textContent) {
  element = document.createElement(tagName);

  if (classNames) {
    element.classList.add(classNames);
  }

  if (children && children.length) {
    for (let i = 0; i < children.length; i++) {
      element.append(children[i]);
    }
  }

  if (attrs && attrs.length) {
    for (let i = 0; i < attrs.length; i++) {
      element.setAttribute(attrs[i][0], attrs[i][1]);
    }
  }

  if (textContent) {
    element.innerHTML = textContent;
  }

  return element;
}

createClockFace();

function createClockFace() {
  const clockFaceWrap = document.querySelector('.clock__face');
  let deg = -90;

  for (let i = 0; i < clockFaceWrap.children.length; i++) {
    if (!clockFaceWrap.children[i].textContent) {
      clockFaceWrap.children[
        i
      ].style.transform = `rotate(${deg}deg) translateX(440%)`;
    }

    deg += 360 / 12;
  }
}

const hourHand = document.querySelector('.clock__hour-hand');
const minuteHand = document.querySelector('.clock__minute-hand');
const secondHand = document.querySelector('.clock__second-hand');

showTime();

function showTime() {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  hourHand.style.transform = `rotate(${360 * (hour / 12) - 90}deg)`;
  minuteHand.style.transform = `rotate(${360 * (minute / 60) - 90}deg)`;
  secondHand.style.transform = `rotate(${360 * (second / 60) - 90}deg)`;

  setTimeout(showTime, 1000);
}

// Clock end
// Digital clock start
const digitalClock = document.querySelector('.digital-clock');

tickDigitalClock();

function tickDigitalClock() {
  const timeObj = new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());

  const timeFlattedObj = {};

  for (let i = 0; i < timeObj.length; i++) {
    timeFlattedObj[timeObj[i].type] = timeObj[i].value;
  }

  digitalClock.textContent = `${timeFlattedObj.hour}:${timeFlattedObj.minute}:${timeFlattedObj.second}`;

  setTimeout(tickDigitalClock, 1000);
}

// Digital clock end
// Date start
const dateParagr = document.querySelector('.date');

showDate();
function showDate(event) {
  let lang = event?.detail ? `${event.detail.lang}` : 'en';

  const dateObj = new Intl.DateTimeFormat(`${lang}`, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).formatToParts(new Date());
  const dateFlattedObj = {};

  for (let i = 0; i < dateObj.length; i++) {
    dateFlattedObj[dateObj[i].type] = dateObj[i].value;
  }

  dateParagr.textContent = `${dateFlattedObj.weekday}, ${dateFlattedObj.day} ${dateFlattedObj.month} ${dateFlattedObj.year}`;
}

document.addEventListener('changeLang', showDate);

// Date end
// Countdown timer start
// Timer input item
class TimerInputItem {
  timeoutId;

  constructor(i) {
    this.input = document.querySelectorAll('.timer__input')[i];
    this.btnPlus = document.querySelectorAll('.timer__btn--plus')[i];
    this.btnMinus = document.querySelectorAll('.timer__btn--minus')[i];

    this.input.addEventListener('input', this.handleInputChange);
    this.input.addEventListener('focusout', this.handleFocusout);

    this.btnPlus.addEventListener('pointerdown', this.increaseValue);
    this.btnPlus.addEventListener('pointerup', this.stopChanging);
    this.btnPlus.addEventListener('pointerout', this.stopChanging);
    this.btnMinus.addEventListener('pointerdown', this.decreaseValue);
    this.btnMinus.addEventListener('pointerup', this.stopChanging);
    this.btnMinus.addEventListener('pointerout', this.stopChanging);
  }

  handleInputChange = (event) => {
    if (event?.inputType === 'insertText') {
      this.listenLength();
      this.listenValue();
      return;
    }

    this.createValueLoop();
    this.listenLength();
    this.listenValue();
  };

  createValueLoop = () => {
    if (this.input.value === this.input.max) {
      this.input.value = `${+this.input.min + 1}`;
      return;
    }

    if (this.input.value === this.input.min) {
      this.input.value = this.input.max - 1;
    }
  };

  listenLength = () => {
    if (this.input.value.length > this.input.maxLength) {
      this.input.value = this.input.value.slice(0, this.input.maxLength);
    }
  };

  listenValue = () => {
    if (
      this.input.value > this.input.max ||
      this.input.value[0] == 0 ||
      this.input.value == this.input.max
    ) {
      this.input.value = this.input.value.slice(0, this.input.maxLength - 1);
    }
  };

  handleFocusout = () => {
    if (this.input.value.length === 0) {
      this.input.value = this.input.min;
    }
  };

  increaseValue = () => {
    const input = this.getSiblingInput(this.btnPlus);

    input.stepUp();
    this.handleInputChange();

    this.timeoutId = setTimeout(this.increaseValue, 150);
  };

  decreaseValue = () => {
    const input = this.getSiblingInput(this.btnMinus);

    input.stepDown();
    this.handleInputChange();

    this.timeoutId = setTimeout(this.decreaseValue, 150);
  };

  stopChanging = () => {
    clearInterval(this.timeoutId);
  };

  getSiblingInput = (btn) => {
    const parentForBtn = btn.parentNode;
    return parentForBtn.previousElementSibling;
  };
}

new TimerInputItem(0);
new TimerInputItem(1);
new TimerInputItem(2);

// Timer
const timerForm = document.querySelector('.timer__form');
const timerFieldset = document.querySelector('.timer__fieldset');
const timerOutput = document.querySelector('.timer__output');
const btnStart = document.querySelector('.timer__btn--start');
const btnPause = document.querySelector('.timer__btn--pause');
const btnStop = document.querySelector('.timer__btn--stop');
let timeoutId;

timerForm.addEventListener('outputTick', changeInputValue);
btnStart.addEventListener('click', createTimer);
btnPause.addEventListener('click', pauseTimer);
btnStop.addEventListener('click', stopTimer);

function createTimer() {
  toggleInputOutput('start');
  toggleTimerBtns('start');

  const formData = new FormData(timerForm);

  let hours = formData.get('hours');
  let minutes = formData.get('minutes');
  let seconds = formData.get('seconds');

  timeoutId = setTimeout(async function tickTimer() {
    timerOutput.textContent = `${new Intl.DateTimeFormat(`en`, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    }).format(new Date().setHours(`${hours}`, `${minutes}`, `${seconds}`))}`;

    let event = new CustomEvent('outputTick', {
      bubbles: true,
      detail: { seconds },
    });
    timerOutput.dispatchEvent(event);

    seconds--;

    if (hours == 0 && minutes == 0 && seconds == -1) {
      await playAudio();
      stopTimer();

      return;
    }
    timeoutId = setTimeout(tickTimer, 1000);
  }, 0);
}

function pauseTimer() {
  clearInterval(timeoutId);
  toggleTimerBtns('pause');
}

function changeInputValue(event) {
  timerForm.seconds.value = `${event.detail.seconds}`;
}

function stopTimer() {
  clearInterval(timeoutId);

  timerForm.hours.value = 0;
  timerForm.minutes.value = 0;
  timerForm.seconds.value = 0;

  toggleInputOutput('stop');
  toggleTimerBtns('stop');
}

function playAudio() {
  const audio = document.querySelector('.timer-audio');

  return new Promise((resolve) => {
    audio.play();
    audio.onended = resolve;
  });
}

function toggleInputOutput(flag) {
  if (flag === 'start') {
    timerOutput.classList.remove('visually-hidden');
    timerFieldset.classList.add('visually-hidden');
    return;
  }

  timerOutput.classList.add('visually-hidden');
  timerFieldset.classList.remove('visually-hidden');
}

function toggleTimerBtns(flag) {
  if (flag === 'start') {
    btnStart.classList.add('visually-hidden');
    btnPause.classList.remove('visually-hidden');
    btnStop.classList.remove('visually-hidden');
    return;
  }

  if (flag === 'pause') {
    btnStart.classList.remove('visually-hidden');
    btnPause.classList.add('visually-hidden');
    return;
  }

  btnStart.classList.remove('visually-hidden');
  btnPause.classList.add('visually-hidden');
  btnStop.classList.add('visually-hidden');
}
// Countdown timer end
