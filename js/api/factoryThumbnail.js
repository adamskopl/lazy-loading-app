let id = -1;

const defaultThumbUrlSmall = 'https://nullprogram.com/img/spatial/image-test-small-ave.png';
const defaultThumbUrlBig = 'https://d1cr57qij2cwzh.cloudfront.net/wp-content/uploads/2018/04/EmailTesting_Icon.png';
// TODO add to config
const smallSize = 800;

function onLoadImg(thumbnail) {
  thumbnail.status.loading = false;
  thumbnail.src = thumbnail.img.src;
  thumbnail.img.onload = null;
  thumbnail.img = null;
}

export const factoryThumbnail = {
  create({
    thumbUrlSmall = defaultThumbUrlSmall,
    thumbUrlBig = defaultThumbUrlBig,
  } = {}) {
    id += 1;
    return {
      id,
      thumbUrlSmall,
      thumbUrlBig,
      src: '',
      status: {
        loading: false,
      },
      img: null,
    };
  },
  fetchImage(thumbnail) {
    if (thumbnail.src !== '' || thumbnail.status.loading) { return; }
    let thumbProp = 'thumbUrlBig';
    if (document.documentElement.clientWidth <= smallSize) {
      thumbProp = 'thumbUrlSmall';
    }
    thumbnail.status.loading = true;
    thumbnail.img = new Image();
    thumbnail.img.onload = onLoadImg.bind(null, thumbnail);
    thumbnail.img.src = thumbnail[thumbProp];
  },
};
