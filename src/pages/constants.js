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

export const feedbackFormUrl = "https://goo.gl/forms/qQBe2c4yt39i8lW73";
export const addDomainFormUrl = "https://goo.gl/forms/dYSPEDkfrkQlDFK83";
export const removeDomainFormUrl = "https://goo.gl/forms/DL5Dr3zQG5EGQQyz2";
export const troubleshootDomainFormUrl = "https://goo.gl/forms/JxGxZ2yuAGDAzqIb2";
export const changeEmailFormUrl = "https://goo.gl/forms/3Yvak8ZSLDRVKx4k2";