import { Attributes, CssAttributes, ScrollBehaviorElement } from './element';

export class CustomBehaviorElement extends ScrollBehaviorElement {
  protected computedEndValue: number | undefined;
  protected computedStartValue: number | undefined;

  protected get attributeName(): CssAttributes {
    const c = this.getAttributeByName(Attributes.CssAttribute);
    if (!c) throw "error";

    if (Object.keys(CSSStyleDeclaration).indexOf(c) < 0) throw "error";
    return <CssAttributes>c;
  }

  //value of the attribute of the element after scroll
  protected get endValue() {
    return this.getAttributeByName(Attributes.EndValue);
  }

  //value of the attribute of the element before scroll
  protected get startValue() {
    return this.getAttributeByName(Attributes.StartValue);
  }

  protected get unit(): string {
    const u = this.getAttributeByName(Attributes.CssAttributeUnit);
    if (!u) throw "error";
    return u;
  }

  protected computeValues(): void {
    this.computedStartValue = this.startValue ? this.stringToPx(this.startValue) : undefined;
    this.computedEndValue = this.endValue ? this.stringToPx(this.endValue) : undefined;
  }
}
customElements.define("custom-scroll-behavior", CustomBehaviorElement);

export class VerticalMovementBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "top";
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
  protected readonly attributeName: CssAttributes = "left";
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
customElements.define("horizontal-scroll-behavior", HorizontalMovementBehaviorElement);
export class VisibilityBehaviorElement extends ScrollBehaviorElement {
  protected readonly attributeName: CssAttributes = "opacity";
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
