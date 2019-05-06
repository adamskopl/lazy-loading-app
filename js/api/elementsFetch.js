import { fetchThumbnails as timeoutFetch } from './apiTimeoutObjects.js';
import { fetchThumbnails as jsonPlaceholder } from './apiJsonPlaceholder.js';
import { fetchThumbnails as ipla } from './apiIpla.js';

let fetchedElements = [];

export const sources = {
  TIMEOUT_OBJECTS: 'TIMEOUT_OBJECTS',
  JSON_PLACEHOLDER: 'JSON_PLACEHOLDER',
  IPLA: 'IPLA',
};

const apis = {
  [sources.TIMEOUT_OBJECTS]: timeoutFetch,
  [sources.JSON_PLACEHOLDER]: jsonPlaceholder,
  [sources.IPLA]: ipla,
};

// TODO add to config
const sourceChoice = sources.IPLA;

function resolveCallback(res, rej, numberNeeded) {
  apis[sourceChoice]().then(function (elements) {
    if (elements.length === 0) {
      res(fetchedElements.splice(0));
    } else {
      fetchedElements.push(...elements);
      if (fetchedElements.length >= numberNeeded) {
        res(fetchedElements.splice(0, numberNeeded));
      } else {
        resolveCallback(res, rej, numberNeeded);
      }
    }
  }).catch(function (err) {
    rej(err);
  });
}

export function fetchElements(numberNeeded) {
  return new Promise(function (res, rej) {
    if (fetchedElements.length >= numberNeeded) {
      let ret = fetchedElements.splice(0, numberNeeded);
      res(ret);
    } else {
      resolveCallback(res, rej, numberNeeded);
    }
  });
}
