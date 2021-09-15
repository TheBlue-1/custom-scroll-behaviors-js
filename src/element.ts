import { scrollHandler } from './scroll-handler.js';

export abstract class ScrollBehaviorElement extends HTMLElement {
  private attributesCache: { [Property in string]: string | null } = {};

  protected computedEnd: number | undefined;
  protected computedStart: number | undefined;
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
    if (this.computedEnd == undefined || this.computedStart == undefined) {
      throw "error";
    }
    this.percentage =
      (this.scrollPosition - this.computedStart) /
      (this.computedEnd - this.computedStart);
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

  protected abstract computeRangeWithSpeed(): void;

  private computeRange() {
    if (
      !scrollHandler.config.alwaysCheckAttributes &&
      this.computedEnd !== undefined &&
      this.computedStart !== undefined
    )
      return;
    if (this.start !== null && this.end !== null) {
      this.computedStart = this.stringToPx(this.start);
      this.computedEnd = this.stringToPx(this.end);
      return;
    }
    this.computeRangeWithSpeed();
  }
}
export class VerticalMovementBehaviourElement extends ScrollBehaviorElement {
  //position of the element after scroll
  protected get endPos() {
    return this.getAttributeByName("endPos");
  }

  //position of the element before scroll
  protected get startPos() {
    return this.getAttributeByName("startPos");
  }

  public adjust(element: HTMLElement): void {
    super.adjust(element);
  }

  protected computeRangeWithSpeed(): void {
    throw new Error("Method not implemented.");
  }
}
customElements.define(
  "vertical-scroll-behavior",
  VerticalMovementBehaviourElement
);
export class VisibilityBehaviourElement extends ScrollBehaviorElement {
  //opacity of the element after scroll
  protected get endOpacity() {
    return this.getAttributeByName("endOpacity");
  }

  //opacity of the element before scroll
  protected get startOpacity() {
    return this.getAttributeByName("startOpacity");
  }

  public adjust(element: HTMLElement): void {
    super.adjust(element);
    if (
      this.percentage === undefined ||
      this.startOpacity === null ||
      this.endOpacity === null
    )
      throw "error";
    if (this.percentage <= 0) {
      element.style.opacity = this.startOpacity;
      return;
    }
    if (this.percentage >= 1) {
      element.style.opacity = this.endOpacity;
      return;
    }
    element.style.opacity = (
      +this.startOpacity +
      this.percentage * (+this.endOpacity - +this.startOpacity)
    ).toString();
  }

  protected computeRangeWithSpeed(): void {
    throw new Error("Method not implemented.");
  }
}
customElements.define("visibility-scroll-behavior", VisibilityBehaviourElement);
