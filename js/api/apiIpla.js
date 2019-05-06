import { factoryThumbnail } from './factoryThumbnail.js';

const url = 'https://b2c-www.redefine.pl/rpc/navigation/';
const headers = {
  Accept: 'application/json, text/plain, */*',
  Referer: 'https://www.ipla.tv/wideo/serial/Pierwsza-milosc/828?seasonId=829',
  Origin: 'https://www.ipla.tv',
  'Content-Type': 'text/plain',
};
const body = {
  id: 1,
  jsonrpc: '2.0',
  method: 'getCategoryContentWithFlatNavigation',
  params: {
    ua: 'www_iplatv/12345 (Mozilla/5.0 Macintosh; Intel Mac OS X 10_10_5 AppleWebKit/537.36 KHTML,like Gecko Chrome/69.0.3497.100Safari/537.36)',
    catid: 829,
    limit: 100,
    offset: 0,
    clientId: 'c921d668-1fdc-4e71-b15e-e8338d2c9bb2',
  },
};

function getThumbnails(iplaResult) {
  let small = null;
  let big = null;
  try {
    small = iplaResult.thumbnails.find(
      t => t.size.width === 136).src; // TODO: add to config
    big = iplaResult.thumbnails.find(
      t => t.size.width === 435).src; // TODO: add to config
  } catch (e) {
    return { small: '', big: '' };
  }
  return { small, big };
}

export function fetchThumbnails() {
  if (body.params.offset === null) {
    return Promise.resolve([]);
  }
  return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (json) {
      const results = json.result.results;
      let thumbnails = [];
      if (results.length === 0) {
        body.params.offset = null;
      } else {
        body.params.offset += 100;
        thumbnails = results.map(function (iplaResult) {
          const thumbs = getThumbnails(iplaResult);
          return factoryThumbnail.create({
            thumbUrlSmall: thumbs.small,
            thumbUrlBig: thumbs.big,
          });
        });
      }
      return thumbnails;
    })
    .catch(function (err) {
      console.error(err);
    });
}
