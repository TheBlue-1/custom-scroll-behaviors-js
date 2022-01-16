import { scrollHandler } from './scroll-handler.js';

export enum Attributes {
  CssAttribute = "css-attribute",
  CssAttributeUnit = "css-attribute-unit",
  CssAttributePreUnit = "css-attribute-pre-unit",
  Speed = "speed",
  End = "end",
  Start = "start",
  EndValue = "end-value",
  StartValue = "start-value",
  EndPos = "end-pos",
  StartPos = "start-pos",
  EndOpacity = "end-opacity",
  StartOpacity = "start-opacity",
  EndColor = "end-color",
  StartColor = "start-color",
  Repeat = "repeat",
}
export type Repeat = "restart" | "continue";
export type CssAttributes = keyof Omit<
  CSSStyleDeclaration,
  "length" | "parentRule" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty"
>;
export abstract class ScrollBehaviorElement extends HTMLElement {
  private attributesCache: { [Property in Attributes]?: string | null } = {};

  protected abstract readonly attributeName: CssAttributes;
  protected abstract readonly preUnit: string;
  protected abstract readonly unit: string;

  protected computedEnd: number | undefined;
  protected abstract computedEndValue: number | number[] | undefined;
  protected computedStart: number | undefined;
  protected abstract computedStartValue: number | number[] | undefined;
  // negative: before behavior
  // 0-1: behavior percentage
  // above 1: after behavior
  protected percentage: number | undefined;

  constructor() {
    super();
    scrollHandler.addBehavior(this);
  }

  public static get observedAttributes() {
    return Object.keys(Attributes).map((k) => (<any>Attributes)[k]);
  }

  public get minimumScroll() {
    this.computeRange();
    if (this.computedEnd == undefined || this.computedStart == undefined) {
      throw new Error("error");
    }
    return this.computedEnd > this.computedStart ? this.computedEnd : this.computedStart;
  }

  protected get averageDifference() {
    return 3;
  }

  //end scroll position
  protected get end() {
    return this.getAttributeByName(Attributes.End);
  }

  //repeat (never stop)
  protected get repeat(): Repeat {
    return this.getAttributeByName(Attributes.Repeat) as Repeat;
  }

  protected get scrollPosition() {
    return window.scrollY;
  }

  //multiplier for scroll position change
  //for opacity 1% per pixel
  protected get speed() {
    return this.getAttributeByName(Attributes.Speed);
  }

  //start scroll position
  protected get start() {
    return this.getAttributeByName(Attributes.Start);
  }

  public adjust(element: HTMLElement): void {
    this.computeRange();
    if (
      this.computedEnd == undefined ||
      this.computedStart == undefined ||
      this.computedEndValue == undefined ||
      this.computedStartValue == undefined
    ) {
      throw new Error("error");
    }

    this.percentage = (this.scrollPosition - this.computedStart) / (this.computedEnd - this.computedStart);

    if (this.percentage <= 0) {
      element.style[this.attributeName] = this.preUnit + this.computedStartValue + this.unit;
      return;
    }
    if (this.percentage >= 1) {
      if (!this.repeat) {
        element.style[this.attributeName] = this.preUnit + this.computedEndValue + this.unit;
        return;
      }
      if (this.repeat == "restart") {
        this.percentage = this.percentage - Math.floor(this.percentage);
      }
    }
    if (!Array.isArray(this.computedStartValue) && !Array.isArray(this.computedEndValue))
      element.style[this.attributeName] =
        this.preUnit + (this.computedStartValue + this.percentage * (this.computedEndValue - this.computedStartValue)) + this.unit;
    else {
      element.style[this.attributeName] = this.multiToSingleValue();
    }
  }

  public attributeChangedCallback(name: Attributes, oldValue: string, newValue: string) {
    this.attributesCache[name] = newValue;
  }

  protected getAttributeByName(name: Attributes): string | null | undefined {
    return this.attributesCache[name];
  }

  protected multiToSingleValue(): string {
    if (!Array.isArray(this.computedStartValue) || !Array.isArray(this.computedEndValue) || !this.percentage) throw new Error("error");
    if (this.computedStartValue.length != this.computedEndValue.length) throw new Error("error");
    let result = "";
    for (let i = 0; i < this.computedStartValue.length; i++) {
      result += (
        "00" +
        Math.round(this.computedStartValue[i] + this.percentage * (this.computedEndValue[i] - this.computedStartValue[i])).toString(16)
      ).slice(-2);
    }
    return this.preUnit + result + this.unit;
  }

  protected stringToPx(value: string, isWidth: boolean = false): number {
    let offset = 0;
    if (value.endsWith("self")) {
      offset = isWidth ? this.clientWidth : this.clientHeight;
      if (value[value.length - 5] == "-") {
        offset = -offset;
      }
      value = value.slice(0, -5);
    }

    //TODO better and more than just vh
    let unit = value.slice(-2);
    if (!Number.isNaN(+unit)) {
      return +value;
    }
    let val = value.slice(0, -2);
    if (unit == "px") {
      return +val;
    }
    if (unit == "vh") {
      return (window.innerHeight * +val) / 100;
    }
    if (unit == "vw") {
      return (window.innerWidth * +val) / 100;
    }

    throw new Error("Incorrect value given: " + value);
  }

  //sets  computedEndValue,computedStartValue
  protected abstract computeValues(): void;

  private computeRange() {
    this.computedStart = this.start ? this.stringToPx(this.start) : undefined;
    this.computedEnd = this.end ? this.stringToPx(this.end) : undefined;

    this.computeValues();
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined
    ) {
      return;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd == undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      this.computedEnd = (this.averageDifference + this.computedStart * +this.speed) / +this.speed;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart == undefined &&
      this.speed != null
    ) {
      this.computedStart = (this.computedEnd * +this.speed - this.averageDifference) / +this.speed;
    }
    if (
      this.computedEndValue == undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      if (!Array.isArray(this.computedStartValue))
        this.computedEndValue = this.computedStartValue - (this.computedEnd - this.computedStart) * +this.speed;
      else throw new Error("error"); //can not compute array with only one speed
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue == undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      if (!Array.isArray(this.computedEndValue))
        this.computedStartValue = this.computedEndValue + (this.computedEnd - this.computedStart) * +this.speed;
      else throw new Error("error"); //can not compute array with only one speed
    }
  }
}
