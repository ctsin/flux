const compose = (...fns) => args =>
  fns.reduce((composed, fn) => fn(composed), args);
const oneSecond = () => 1000;
const getCurrentTime = () => new Date();
const clear = () => console.clear();
const log = message => console.log(message);
const display = target => time => target(time);
const HOURS = 'hours';
const MINUTES = 'minutes';
const SECONDS = 'seconds';
const serializeClockTime = date => ({
  [HOURS]: date.getHours(),
  [MINUTES]: date.getMinutes(),
  [SECONDS]: date.getSeconds(),
});
const civilianHours = clockTime => ({
  ...clockTime,
  [HOURS]: clockTime.hours > 12 ? clockTime.hours - 12 : clockTime.hours,
});
const appendAMPM = clockTime => ({
  ...clockTime,
  ampm: clockTime.hours >= 12 ? 'PM' : 'AM',
});
const prependZero = key => clockTime => ({
  ...clockTime,
  [key]: clockTime[key] < 10 ? `0${clockTime[key]}` : clockTime[key],
});
const formatClock = format => time =>
  format
    .replace('hh', time.hours)
    .replace('mm', time.minutes)
    .replace('ss', time.seconds)
    .replace('tt', time.ampm);

const convertToCivilianTime = clockTime =>
  compose(
    appendAMPM,
    civilianHours
  )(clockTime);

const doubleDigits = civilianTime =>
  compose(
    prependZero(HOURS),
    prependZero(MINUTES),
    prependZero(SECONDS)
  )(civilianTime);

const startTicking = () =>
  setInterval(
    compose(
      clear,
      getCurrentTime,
      serializeClockTime,
      convertToCivilianTime,
      doubleDigits,
      formatClock('hh:mm:ss tt'),
      display(log)
    ),
    oneSecond()
  );

startTicking();
