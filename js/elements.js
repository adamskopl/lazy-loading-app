import { fetchElements } from './api/elementsFetch.js';
import { factoryThumbnail } from './api/factoryThumbnail.js';

export const elementsCollection = {
  init(inRowNumber, elements) {
    this.inRowNumber = inRowNumber;
    this.elements = elements;
    this.rowCache = new Map();
  },
  getRowsNumber() {
    return Math.ceil(this.elements.length / this.inRowNumber);
  },
  pushRows(rowsNumber) {
    return fetchElements(this.inRowNumber * rowsNumber)
      .then(function (elements) {
        this.elements.push(...elements);
      }.bind(this));
  },
  fetchImages(rowIndexTop, rowIndexBottom) {
    this.getElementsRows(rowIndexTop, rowIndexBottom).forEach(function (el) {
      factoryThumbnail.fetchImage(el);
    });
  },
  getElementsRows(rowIndexTop, rowIndexBottom) {
    const indexStart = rowIndexTop * this.inRowNumber;
    const indexEnd = rowIndexBottom * this.inRowNumber + this.inRowNumber;
    return this.elements.slice(indexStart, indexEnd);
  },
};
