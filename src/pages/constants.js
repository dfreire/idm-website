import _ from 'underscore'

const allTlds = _.uniq(require('./tlds-all.json'));
const weirdTlds = _.uniq(require('./tlds-weird.json'));
export const tlds = _.difference(allTlds, weirdTlds);

export const serviceName = 'Simple Domain Monitor';

export const version = 1;
export const inBrowser = typeof document !== 'undefined';

export const currency = '$';
export const basePrice = 10;
export const baseQty = 10;
// export const priceFormat = `${currency}0.00`;
export const priceFormat = `${currency}0`;