import { factoryThumbnail } from './factoryThumbnail.js';

let photoId = 0; // starting from 1
const endpoint = 'https://jsonplaceholder.typicode.com/photos';

export function fetchThumbnails() {
  photoId += 1;
  return fetch(`${endpoint}/${photoId}`)
    .then(res => res.json())
    .then(function (json) {
      return [
        factoryThumbnail.create({
          thumbUrlSmall: json.thumbnailUrl,
          thumbUrlBig: json.url,
        }),
      ];
    });
}
