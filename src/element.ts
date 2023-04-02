import { average } from "./misc.js";
import { scrollHandler } from "./scroll-handler.js";

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
  | "length"
  | "parentRule"
  | "getPropertyPriority"
  | "getPropertyValue"
  | "item"
  | "removeProperty"
  | "setProperty"
>;
export abstract class ScrollBehaviorElement extends HTMLElement {
  private attributesCache: { [Property in Attributes]?: string | null } = {};

  protected abstract readonly attributeName: CssAttributes;
  protected abstract readonly preUnit: string;
  protected readonly transformFunction: string = "";
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
    this.style.display = "none";
  }

  public static get observedAttributes() {
    return Object.keys(Attributes).map((k) => (<any>Attributes)[k]);
  }

  public get minimumScroll() {
    this.computeRange();
    if (this.computedEnd == undefined || this.computedStart == undefined) {
      throw new Error("start and/or end couldn't be computed");
    }
    return this.computedEnd > this.computedStart
      ? this.computedEnd
      : this.computedStart;
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

  private get currentValueString(): string {
    if (
      this.computedStartValue == undefined ||
      this.computedEndValue == undefined ||
      this.percentage == undefined
    )
      throw new Error("values have not been computed");

    if (
      !Array.isArray(this.computedStartValue) &&
      !Array.isArray(this.computedEndValue)
    ) {
      return (
        this.preUnit +
        (this.computedStartValue +
          this.percentage * (this.computedEndValue - this.computedStartValue)) +
        this.unit
      );
    }

    if (
      !Array.isArray(this.computedStartValue) ||
      !Array.isArray(this.computedEndValue)
    )
      throw new Error(
        "multiple starts and/or multiple ends have not been computed"
      );
    if (this.computedStartValue.length != this.computedEndValue.length)
      throw new Error("starts and ends dont have the same length");
    const currentValues = this.computeMultiValueProgress(
      this.computedStartValue,
      this.computedEndValue,
      this.percentage
    );
    return this.multiToSingleValue(currentValues);
  }

  private get endValueString(): string {
    if (!Array.isArray(this.computedEndValue))
      return this.preUnit + this.computedEndValue + this.unit;
    return this.multiToSingleValue(this.computedEndValue);
  }

  private get startValueString(): string {
    if (!Array.isArray(this.computedStartValue))
      return this.preUnit + this.computedStartValue + this.unit;
    return this.multiToSingleValue(this.computedStartValue);
  }

  public adjust(): void {
    this.computeRange();
    if (
      this.computedEnd == undefined ||
      this.computedStart == undefined ||
      this.computedEndValue == undefined ||
      this.computedStartValue == undefined
    ) {
      throw new Error("start and/or end couldn't be computed");
    }

    this.percentage =
      (this.scrollPosition - this.computedStart) /
      (this.computedEnd - this.computedStart);

    if (this.repeat == "restart") {
      this.percentage = this.percentage - Math.floor(this.percentage);
    }
    const parentElement = this.parentElement;
    if (parentElement == null) return;
    if (this.percentage <= 0) {
      this.setValue(parentElement, this.startValueString);
      return;
    }
    if (this.percentage >= 1) {
      if (this.repeat != "continue") {
        this.setValue(parentElement, this.endValueString);
        return;
      }
    }
    this.setValue(parentElement, this.currentValueString);
  }

  public attributeChangedCallback(
    name: Attributes,
    oldValue: string,
    newValue: string
  ) {
    this.attributesCache[name] = newValue;
  }

  protected computeMultiValueProgress(
    startValues: number[],
    endValues: number[],
    percentage: number
  ): any[] {
    const result: number[] = [];
    for (let i = 0; i < startValues.length; i++) {
      result.push(
        startValues[i] + percentage * (endValues[i] - startValues[i])
      );
    }

    return result;
  }

  protected getAttributeByName(name: Attributes): string | null | undefined {
    return this.attributesCache[name];
  }

  protected multiToSingleValue(values: number[]): string {
    let result = this.preUnit;
    for (let i = 0; i < values.length; i++) {
      result += values[i];
    }
    return result + this.unit;
  }

  protected setValue(element: HTMLElement, value: string) {
    if (this.attributeName != "transform")
      element.style[this.attributeName] = value;
    else {
      const oldValue: string = element.style["transform"];
      const transformRegex = new RegExp(
        `${this.transformFunction}\\s?\\(.*?\\)`
      );
      if (oldValue.match(transformRegex))
        element.style["transform"] = oldValue.replace(
          transformRegex,
          `${this.transformFunction}(${value})`
        );
      else
        element.style["transform"] =
          oldValue + ` ${this.transformFunction}(${value})`;
    }
  }

  protected stringToPx(value: string, isWidth: boolean = false): number {
    let offset = 0;
    if (value.endsWith("self")) {
      offset = isWidth
        ? this.parentElement?.clientWidth ?? 0
        : this.parentElement?.clientHeight ?? 0;
      if (value[value.length - 5] == "-") {
        offset = -offset;
      } else value = value.slice(0, -5);
    }

    //TODO better and more than just vh
    let unit = value.slice(-2);
    if (!Number.isNaN(+unit)) {
      return +value + offset;
    }
    let val = value.slice(0, -2);
    if (unit == "px") {
      return +val + offset;
    }
    if (unit == "vh") {
      return (window.innerHeight * +val) / 100 + offset;
    }
    if (unit == "vw") {
      return (window.innerWidth * +val) / 100 + offset;
    }

    throw new Error("Unsupported value given: " + value);
  }

  //sets  computedEndValue,computedStartValue
  protected abstract computeValues(): void;

  private averageRange(startValues: number[], endValues: number[]) {
    if (startValues.length != endValues.length)
      throw new Error("starts and ends dont have the same length");
    const values: number[] = [];
    for (let i = 0; i < startValues.length; i++) {
      values.push(endValues[i] - startValues[i]);
    }
    return average(values);
  }

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
      if (
        !Array.isArray(this.computedStartValue) ||
        !Array.isArray(this.computedEndValue)
      ) {
        if (
          Array.isArray(this.computedStartValue) ||
          Array.isArray(this.computedEndValue)
        ) {
          throw new Error(
            "start and end have to be both single or both multi values"
          );
        }

        this.computedEnd =
          this.computedStart +
          (this.computedEndValue - this.computedStartValue) / +this.speed;
      } else {
        this.computedEnd =
          this.computedStart +
          this.averageRange(this.computedStartValue, this.computedEndValue) /
            +this.speed;
      }
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart == undefined &&
      this.speed != null
    ) {
      if (
        !Array.isArray(this.computedStartValue) ||
        !Array.isArray(this.computedEndValue)
      ) {
        if (
          Array.isArray(this.computedStartValue) ||
          Array.isArray(this.computedEndValue)
        ) {
          throw new Error(
            "start and end have to be both single or both multi values"
          );
        }

        this.computedStart =
          this.computedEnd -
          (this.computedEndValue - this.computedStartValue) / +this.speed;
      } else {
        this.computedStart =
          this.computedEnd -
          this.averageRange(this.computedStartValue, this.computedEndValue) /
            +this.speed;
      }
    }
    if (
      this.computedEndValue == undefined &&
      this.computedStartValue != undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      if (!Array.isArray(this.computedStartValue))
        this.computedEndValue =
          this.computedStartValue +
          (this.computedEnd - this.computedStart) * +this.speed;
      else {
        this.computedEndValue = [];
        for (let i = 0; i < this.computedStartValue.length; i++) {
          this.computedEndValue.push(
            this.computedStartValue[i] +
              (this.computedEnd - this.computedStart) * +this.speed
          );
        }
      }
    }
    if (
      this.computedEndValue != undefined &&
      this.computedStartValue == undefined &&
      this.computedEnd != undefined &&
      this.computedStart != undefined &&
      this.speed != null
    ) {
      if (!Array.isArray(this.computedEndValue))
        this.computedStartValue =
          this.computedEndValue -
          (this.computedEnd - this.computedStart) * +this.speed;
      else {
        this.computedStartValue = [];
        for (let i = 0; i < this.computedEndValue.length; i++) {
          this.computedStartValue.push(
            this.computedEndValue[i] -
              (this.computedEnd - this.computedStart) * +this.speed
          );
        }
      }
    }
  }
}
