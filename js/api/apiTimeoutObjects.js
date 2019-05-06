import { factoryThumbnail } from './factoryThumbnail.js';

let numberFetched = 10;
let timeout = 300;

function createElements(number) {
  let arr = [];
  for (let i = 0; i < number; i++) {
    arr.push(factoryThumbnail.create());
  }
  return arr;
}

export function fetchThumbnails() {
  return new Promise(function (res) {
    setTimeout(function () {
      res(createElements(numberFetched));
    }, timeout);
  });
}
