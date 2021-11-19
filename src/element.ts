import { scrollHandler } from './scroll-handler.js';

export enum Attributes {
  CssAttribute = "css-attribute",
  CssAttributeUnit = "css-attribute-unit",
  Speed = "speed",
  End = "end",
  Start = "start",
  EndValue = "end-value",
  StartValue = "start-value",
  EndPos = "end-pos",
  StartPos = "start-pos",
  EndOpacity = "end-opacity",
  StartOpacity = "start-opacity",
}
export type CssAttributes = keyof Omit<
  CSSStyleDeclaration,
  "length" | "parentRule" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty"
>;
export abstract class ScrollBehaviorElement extends HTMLElement {
  private attributesCache: { [Property in Attributes]?: string | null } = {};

  protected abstract readonly attributeName: CssAttributes;
  protected abstract readonly unit: string;

  protected computedEnd: number | undefined;
  protected abstract computedEndValue: number | undefined;
  protected computedStart: number | undefined;
  protected abstract computedStartValue: number | undefined;
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
      throw "error";
    }
    return this.computedEnd > this.computedStart ? this.computedEnd : this.computedStart;
  }

  //end scroll position
  protected get end() {
    return this.getAttributeByName(Attributes.End);
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
      throw "error";
    }

    this.percentage = (this.scrollPosition - this.computedStart) / (this.computedEnd - this.computedStart);

    if (this.percentage <= 0) {
      element.style[this.attributeName] = this.computedStartValue + this.unit;
      return;
    }
    if (this.percentage >= 1) {
      element.style[this.attributeName] = this.computedEndValue + this.unit;
      return;
    }
    element.style[this.attributeName] =
      this.computedStartValue + this.percentage * (this.computedEndValue - this.computedStartValue) + this.unit;
  }

  public attributeChangedCallback(name: Attributes, oldValue: string, newValue: string) {
    this.attributesCache[name] = newValue;
  }

  protected getAttributeByName(name: Attributes): string | null | undefined {
    return this.attributesCache[name];
  }

  protected stringToPx(value: string): number {
    //TODO better and more than just vh
    let unit = value.slice(-2);
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

    throw "Incorrect value given: " + value;
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
      this.computedEnd = (this.computedEndValue - this.computedStartValue + this.computedStart * +this.speed) / +this.speed;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart == undefined &&
      this.speed != null
    ) {
      this.computedStart = (this.computedEnd * +this.speed - this.computedEndValue - this.computedStartValue) / +this.speed;
    }
    if (
      this.computedEndValue == undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      this.computedEndValue = this.computedStartValue - (this.computedEnd - this.computedStart) * +this.speed;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue == undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      this.computedStartValue = this.computedEndValue + (this.computedEnd - this.computedStart) * +this.speed;
    }
  }
}
