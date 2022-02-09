import { Attributes, CssAttributes, ScrollBehaviorElement } from './element.js';

export class CustomBehaviorElement extends ScrollBehaviorElement {
  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  protected get attributeName(): CssAttributes {
    const c = this.getAttributeByName(Attributes.CssAttribute);
    if (!c) throw new Error("attribute name must be set");

    if (Object.keys(CSSStyleDeclaration).indexOf(c) < 0) throw new Error("attribute name must be set to a valid css attribute name");
    return <CssAttributes>c;
  }

  //value of the attribute of the element after scroll
  protected get endValue() {
    return this.getAttributeByName(Attributes.EndValue);
  }

  protected get preUnit(): string {
    const u = this.getAttributeByName(Attributes.CssAttributePreUnit);
    if (!u) return "";
    return u;
  }

  //value of the attribute of the element before scroll
  protected get startValue() {
    return this.getAttributeByName(Attributes.StartValue);
  }

  protected get unit(): string {
    const u = this.getAttributeByName(Attributes.CssAttributeUnit);
    if (!u) return "";
    return u;
  }

  protected computeValues(): void {
    //currently only supports numbers or lengths
    this.computedStartValue = +(this.startValue ?? 0);
    this.computedEndValue = +(this.endValue ?? 0);
  }
}
customElements.define("custom-scroll-behavior", CustomBehaviorElement);

export class VerticalMovementBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "transform";
  protected readonly preUnit: string = "";
  protected readonly transformFunction: string = "translateY";
  protected readonly unit: string = "px";

  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  //position of the element after scroll
  protected get endPos() {
    return this.getAttributeByName(Attributes.EndPos);
  }

  //position of the element before scroll
  protected get startPos() {
    return this.getAttributeByName(Attributes.StartPos);
  }

  protected computeValues(): void {
    this.computedStartValue = this.startPos ? this.stringToPx(this.startPos) : undefined;
    this.computedEndValue = this.endPos ? this.stringToPx(this.endPos) : undefined;
  }
}
customElements.define("vertical-scroll-behavior", VerticalMovementBehaviorElement);
export class HorizontalMovementBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "transform";
  protected readonly preUnit: string = "";
  protected readonly transformFunction: string = "translateX";
  protected readonly unit: string = "px";

  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  //position of the element after scroll
  protected get endPos() {
    return this.getAttributeByName(Attributes.EndPos);
  }

  //position of the element before scroll
  protected get startPos() {
    return this.getAttributeByName(Attributes.StartPos);
  }

  protected computeValues(): void {
    this.computedStartValue = this.startPos ? this.stringToPx(this.startPos, true) : undefined;
    this.computedEndValue = this.endPos ? this.stringToPx(this.endPos, true) : undefined;
  }
}
customElements.define("horizontal-scroll-behavior", HorizontalMovementBehaviorElement);
export class VisibilityBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "opacity";
  protected readonly preUnit: string = "";
  protected readonly unit: string = "";

  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  //opacity of the element after scroll
  protected get endOpacity() {
    return this.getAttributeByName(Attributes.EndOpacity);
  }

  //opacity of the element before scroll
  protected get startOpacity() {
    return this.getAttributeByName(Attributes.StartOpacity);
  }

  protected computeValues(): void {
    this.computedStartValue = this.startOpacity ? +this.startOpacity : undefined;
    this.computedEndValue = this.endOpacity ? +this.endOpacity : undefined;
  }
}
customElements.define("visibility-scroll-behavior", VisibilityBehaviorElement);
export class RgbaBackgroundColorBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "backgroundColor";
  protected readonly preUnit: string = "#";
  protected readonly unit: string = "";

  protected computedEndValue: number[] | undefined;
  protected computedStartValue: number[] | undefined;

  //color of the element after scroll
  protected get endColor() {
    return this.getAttributeByName(Attributes.EndColor);
  }

  //color of the element before scroll
  protected get startColor() {
    return this.getAttributeByName(Attributes.StartColor);
  }

  protected computeValues(): void {
    this.computedStartValue = this.startColor ? this.splitColor(this.startColor) : undefined;
    this.computedEndValue = this.endColor ? this.splitColor(this.endColor) : undefined;
  }

  protected multiToSingleValue(values: number[]): string {
    let result = this.preUnit;
    for (let i = 0; i < values.length; i++) {
      result += ("00" + Math.round(values[i])).slice(-2);
    }
    return result + this.unit;
  }

  protected splitColor(color: string): number[] {
    return [
      Number("0x" + color.slice(1, 3)),
      Number("0x" + color.slice(3, 5)),
      Number("0x" + color.slice(5, 7)),
      Number("0x" + color.slice(7, 9)),
    ];
  }
}
customElements.define("rgba-color-scroll-behavior", RgbaBackgroundColorBehaviorElement);
