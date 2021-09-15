import { CurrentConfig, getCurrentConfig } from './config.js';
import { ScrollBehaviorElement } from './element.js';

class ScrollHandler {
  private static _instance: ScrollHandler;

  public config: CurrentConfig;
  public elements: ScrollElement[] = [];

  private constructor() {
    this.config = getCurrentConfig();
    window.addEventListener("scroll", () => this.adjust());
    window.addEventListener("resize", () => this.onResize());
  }

  public static get instance(): ScrollHandler {
    if (!this._instance) this._instance = new ScrollHandler();
    return this._instance;
  }

  public addBehavior(behavior: ScrollBehaviorElement) {
    const element = behavior.parentElement;
    if (!element) throw "Behaviors must have a parent";
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

  public onResize(): void {}
}

class ScrollElement {
  public behaviors: ScrollBehaviorElement[] = [];

  constructor(public element: HTMLElement) {}

  public adjust() {
    this.behaviors.forEach((b) => b.adjust(this.element));
  }
}
//interfering behaviors will be overridden by the last one
export const scrollHandler = ScrollHandler.instance;
