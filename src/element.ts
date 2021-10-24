import { scrollHandler } from './scroll-handler.js';

export abstract class ScrollBehaviorElement extends HTMLElement {
  //attributeChangedCallback
  //observedAttributes
  private attributesCache: { [Property in string]: string | null } = {};

  protected abstract readonly attributeName: keyof Omit<
    CSSStyleDeclaration,
    | "length"
    | "parentRule"
    | "getPropertyPriority"
    | "getPropertyValue"
    | "item"
    | "removeProperty"
    | "setProperty"
  >;
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

  //end scroll position
  protected get end() {
    return this.getAttributeByName("end");
  }

  protected get scrollPosition() {
    return window.scrollY;
  }

  //multiplier for scroll position change
  //for opacity 1% per pixel
  protected get speed() {
    return this.getAttributeByName("speed");
  }

  //start scroll position
  protected get start() {
    return this.getAttributeByName("start");
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

    this.percentage =
      (this.scrollPosition - this.computedStart) /
      (this.computedEnd - this.computedStart);

    if (this.percentage <= 0) {
      element.style[this.attributeName] = this.computedStartValue + this.unit;
      return;
    }
    if (this.percentage >= 1) {
      element.style[this.attributeName] = this.computedEndValue + this.unit;
      return;
    }
    element.style[this.attributeName] =
      this.computedStartValue +
      this.percentage * (this.computedEndValue - this.computedStartValue) +
      this.unit;
  }

  protected getAttributeByName(name: string): string | null {
    if (
      scrollHandler.config.alwaysCheckAttributes ||
      !this.attributesCache.hasOwnProperty(name)
    ) {
      const value = this.getAttribute(name);

      this.attributesCache[name] = value;

      return value;
    }

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
      this.computedEnd =
        (this.computedEndValue -
          this.computedStartValue +
          this.computedStart * +this.speed) /
        +this.speed;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart == undefined &&
      this.speed != null
    ) {
      this.computedStart =
        (this.computedEnd * +this.speed -
          this.computedEndValue -
          this.computedStartValue) /
        +this.speed;
    }
    if (
      this.computedEndValue == undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      this.computedEndValue =
        this.computedStartValue -
        (this.computedEnd - this.computedStart) * +this.speed;
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue == undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      this.computedStartValue =
        this.computedEndValue +
        (this.computedEnd - this.computedStart) * +this.speed;
    }
  }
}
export class VerticalMovementBehaviourElement extends ScrollBehaviorElement {
  protected readonly attributeName: keyof Omit<
    CSSStyleDeclaration,
    | "length"
    | "parentRule"
    | "getPropertyPriority"
    | "getPropertyValue"
    | "item"
    | "removeProperty"
    | "setProperty"
  > = "top";
  protected readonly unit: string = "px";

  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  //position of the element after scroll
  protected get endPos() {
    return this.getAttributeByName("end-pos");
  }

  //position of the element before scroll
  protected get startPos() {
    return this.getAttributeByName("start-pos");
  }

  protected computeValues(): void {
    this.computedStartValue = this.startPos
      ? this.stringToPx(this.startPos)
      : undefined;
    this.computedEndValue = this.endPos
      ? this.stringToPx(this.endPos)
      : undefined;
  }
}
customElements.define(
  "vertical-scroll-behavior",
  VerticalMovementBehaviourElement
);
export class VisibilityBehaviourElement extends ScrollBehaviorElement {
  protected readonly attributeName: keyof Omit<
    CSSStyleDeclaration,
    | "length"
    | "parentRule"
    | "getPropertyPriority"
    | "getPropertyValue"
    | "item"
    | "removeProperty"
    | "setProperty"
  > = "opacity";
  protected readonly unit: string = "";

  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  //opacity of the element after scroll
  protected get endOpacity() {
    return this.getAttributeByName("end-opacity");
  }

  //opacity of the element before scroll
  protected get startOpacity() {
    return this.getAttributeByName("start-opacity");
  }

  protected computeValues(): void {
    this.computedStartValue = this.startOpacity
      ? +this.startOpacity
      : undefined;
    this.computedEndValue = this.endOpacity ? +this.endOpacity : undefined;
  }
}
customElements.define("visibility-scroll-behavior", VisibilityBehaviourElement);
