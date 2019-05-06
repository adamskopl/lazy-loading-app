import { debounce } from './utils.js';
import { elementsCollection } from './elements.js';

const classThumb = '.thumb';
const classThumbInit = '.thumb-init';

window.app = new Vue({
  el: '#app',
  data: {
    elements: [],
    furthestRow: 0,
    viewWidth: null,
    viewHeight: null,
    inRow: null,
    inColumn: null,
    appendPromise: Promise.resolve(),
    appending: false,
  },
  methods: {
    appendRows(number) {
      this.appendPromise = this.appendPromise
        .then(() => {
          this.appending = true;
          return elementsCollection.pushRows(number);
        })
        .then(() => {
          this.appending = false;
        });
      return this.appendPromise;
    },
    appendNextRows() {
      this.appendPromise = this.appendPromise
        .then(() => {
          // TODO: add to config (how many rows)
          const targetRowsNumber = this.furthestRow + 1 + this.inColumn * 2;
          const diff = targetRowsNumber - elementsCollection.getRowsNumber();
          this.appending = true;
          // diff could be 0
          return diff && elementsCollection.pushRows(diff);
        })
        .then(() => {
          this.appending = false;
        });
      return this.appendPromise;
    },
    onScrollStop() {
      const thumb = document.querySelectorAll(classThumb)[0];
      if (this.elements.length === 0) { return; }
      if (thumb === undefined) { console.error(`no ${classThumb}`); return; }
      const rect = thumb.getBoundingClientRect();
      const visibleTopIndex = Math.floor(Math.abs(rect.top / rect.height));
      const visibleBottomIndex = visibleTopIndex + this.inColumn;

      elementsCollection.fetchImages(visibleTopIndex, visibleBottomIndex);
      if (visibleBottomIndex > this.furthestRow) {
        this.furthestRow = visibleBottomIndex;
        this.appendNextRows();
      }
    },
  },
  mounted() {
    const el = document.querySelector(classThumbInit);
    this.viewWidth = document.documentElement.clientWidth;
    this.viewHeight = document.documentElement.clientHeight;
    this.inRow = Math.floor(this.viewWidth / el.offsetWidth);
    this.inColumn = Math.floor(this.viewHeight / el.offsetHeight);

    elementsCollection.init(this.inRow, this.elements);
    // append extra row to force scroll visibility
    this.appendRows(this.inColumn * 2)
      .then(() => {
        this.onScrollStop();
      });

    window.addEventListener('scroll', debounce(
      this.onScrollStop.bind(this),
      100,
    ));
  },
});
