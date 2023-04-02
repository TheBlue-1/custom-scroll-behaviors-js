import { CurrentConfig, getCurrentConfig } from "./config.js";
import { ScrollBehaviorElement } from "./element.js";

class ScrollHandler {
  private static _instance: ScrollHandler;

  public config: CurrentConfig = new CurrentConfig();
  public elements: ScrollElement[] = [];

  private constructor() {}

  public static get instance(): ScrollHandler {
    if (!this._instance) this._instance = new ScrollHandler();
    return this._instance;
  }

  public addBehavior(behavior: ScrollBehaviorElement) {
    const element = behavior.parentElement;
    if (!element) throw new Error("Behaviors must have a parent");
    let scrollElement = this.elements.find((e) => e.element == element);
    if (!scrollElement) {
      scrollElement = new ScrollElement(element);
      this.elements.push(scrollElement);
    }
    scrollElement.behaviors.push(behavior);
  }

  public adjust(): void {
    this.config = getCurrentConfig();

    this.elements.forEach((e) => {
      e.adjust();
    });
  }

  public init() {
    this.config = getCurrentConfig();
    window.addEventListener("scroll", () => this.adjust(), { passive: true });
    window.addEventListener("resize", () => this.onResize(), { passive: true });
    document.addEventListener("DOMContentLoaded", () => this.onResize());
    this.onResize();
  }

  public onResize(): void {
    if (!getCurrentConfig().autoSizePage) return;
    let minimumScroll = 0;
    this.elements.forEach((e) => {
      const elementsMinimumScroll = e.minimumScroll;
      if (elementsMinimumScroll > minimumScroll) {
        minimumScroll = elementsMinimumScroll;
      }
    });
    document.body.style.height = `calc(${minimumScroll}px + 100vh)`;
    document.body.style.setProperty(
      "page-height",
      `calc(${minimumScroll}px + 100vh)`
    );
    this.adjust();
  }
}

class ScrollElement {
  public behaviors: ScrollBehaviorElement[] = [];

  constructor(public element: HTMLElement) {}

  public get minimumScroll() {
    let minimumScroll = 0;
    this.behaviors.forEach((b) => {
      const behaviorsMinimumScroll = b.minimumScroll;
      if (behaviorsMinimumScroll > minimumScroll) {
        minimumScroll = behaviorsMinimumScroll;
      }
    });
    return minimumScroll;
  }

  public adjust() {
    this.behaviors.forEach((b) => b.adjust());
  }
}

//interfering behaviors will be overridden by the last one
export const scrollHandler = ScrollHandler.instance;
