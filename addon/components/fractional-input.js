import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/fractional-input';

export default Component.extend({
  layout,
  classNames: ["ember-fractional-input"],
  "wrapper-class": "form-group",
  "input-class": "form-control",
  placeholder: 'Enter your value',
  actions: {
    blurred() {
      if (this.get("on-blur")) {
        this.get("on-blur")(this.value)
      }
    }
  },
  denominator: 16,
  fractions: computed(function () {
    let denominator = this.get("denominator");
    let result = A();
    for (let i = 1; i < denominator; i++) {
      let displayValue = this.reduceFraction(i, denominator);

      result.pushObject({ value: parseFloat(i / denominator), display: `${displayValue[0]}/${displayValue[1]}` });
    }
    return result;
  }),


  valueWhole: computed({
    get() {
      return this.getWhole("value");
    },
    set(key, value) {
      return this.setWhole("value", value);
    }
  }),
  valueFraction: computed({
    get() {
      return this.getFraction("value");
    },
    set(key, value) {
      return this.setFraction("value", value);
    }
  }),
  getWhole(key) {
    let fullNumber = this.get(key);
    if (fullNumber === undefined)
      return "";

    return parseInt(fullNumber);
  },
  setWhole(key, value) {
    let calcValue = this.calcValue(value);
    let fraction = this.calcValue(this.get(`${key}Fraction`));
    this.set(key, parseFloat(calcValue) + parseFloat(fraction));
    return value;
  },
  getFraction(key) {
    let fraction = this.get(key);
    return fraction - parseInt(fraction);
  },
  setFraction(key, value) {
    let calcValue = this.calcValue(value);
    let whole = this.calcValue(this.get(`${key}Whole`));
    this.set(key, parseFloat(whole) + parseFloat(calcValue));
    return value;
  },
  calcValue(value) {
    return isEmpty(value) || isNaN(value) ? 0 : value;
  },
  reduceFraction(numerator, denominator) {
    var gcd = function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
  }
});
