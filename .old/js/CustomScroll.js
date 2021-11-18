/**
 * © 2019 Mayrhofer Maximilian
 */

let customScroll = {};
customScroll.elements = [];
customScroll.toPx = (val) => {
  let type = typeof val;
  if (type == "number") return val;
  if (type == "string") {
    let unit = val.slice(-2);
    let value = val.slice(0, -2);
    if (unit == "px") {
      return value;
    }
    if (unit == "vh") {
      return (window.innerHeight * value) / 100;
    }
  }
  throw "Incorrect value given: " + val;
};
customScroll.adjust = () => {
  for (let i = 0; i < customScroll.elements.length; i++) {
    let sElem = customScroll.elements[i];
    let behaviors = sElem.currentOrNextOrLastBehavior();
    if (behaviors[0]) {
      behavior = behaviors[0];
      sElem.elem.style.transform =
        "translateY(" +
        (behavior.pxStartPos +
          (window.scrollY - behavior.pxStart) * behavior.speed) +
        "px)";
      if (behavior.opacityBefore != null && behavior.opacityAfter != null) {
        sElem.elem.style.opacity =
          ((window.scrollY - behavior.pxStart) /
            (behavior.pxEnd - behavior.pxStart)) *
            (behavior.opacityAfter - behavior.opacityBefore) +
          behavior.opacityBefore;
      }
    } else if (behaviors[1]) {
      behavior = behaviors[1];
      sElem.elem.style.transform = "translateY(" + behavior.pxStartPos + "px)";
      if (behavior.opacityBefore != null) {
        sElem.elem.style.opacity = behavior.opacityBefore;
      }
    } else {
      behavior = behaviors[2];
      sElem.elem.style.transform =
        "translateY(" +
        (behavior.pxStartPos +
          (behavior.pxEnd - behavior.pxStart) * behavior.speed) +
        "px)";
      if (behavior.opacityAfter != null) {
        sElem.elem.style.opacity = behavior.opacityAfter;
      }
    }
  }
};
customScroll.onResize = (setPx = true) => {
  let height = 0;
  for (let i = 0; i < customScroll.elements.length; i++) {
    for (let j = 0; j < customScroll.elements[i].behaviors.length; j++) {
      let b = customScroll.elements[i].behaviors[j];
      if (setPx) b.resetPxs();
      if (b.pxEnd > height) height = b.pxEnd;
    }
  }
  document.body.style.height = "calc(100vh + " + height + "px)";
  customScroll.adjust();
};
window.addEventListener("scroll", customScroll.adjust);
window.addEventListener("resize", customScroll.onResize);
class OldScrollElement {
  behaviors = [];
  elem;
  constructor(elem) {
    this.elem = elem;
    customScroll.elements.push(this);
  }
  addBehavior(behavior) {
    this.behaviors.push(behavior);
    customScroll.onResize(false);
    return this;
  }
  opacityAt(pos, fromopacity, toopacity, elementPos = 0) {
    this.addBehavior(
      new PositionBehavior(pos, pos, 1, elementPos, fromopacity, toopacity)
    );
    return this;
  }
  currentOrNextOrLastBehavior() {
    let scrollPos = window.scrollY;
    let next = undefined;
    let last = undefined;
    for (let i = 0; i < this.behaviors.length; i++) {
      let behavior = this.behaviors[i];
      if (scrollPos >= behavior.pxStart && scrollPos <= behavior.pxEnd) {
        return [behavior, undefined, undefined];
      }
      if (
        scrollPos < behavior.pxStart &&
        (!next || next.pxStart > behavior.pxStart)
      )
        next = behavior;
      if (
        !next &&
        scrollPos > behavior.pxEnd &&
        (!last || last.pxEnd < behavior.pxEnd)
      )
        last = behavior;
    }
    return [undefined, next, last];
  }
}
class PositionBehavior {
  start;
  end;
  speed;
  startPos;
  opacityBefore;
  opacityAfter;
  pxStart;
  pxEnd;
  pxStartPos;
  constructor(
    start,
    end,
    speed,
    startPos,
    opacityBefore = undefined,
    opacityAfter = undefined
  ) {
    this.speed = speed;
    this.end = end;
    this.start = start;
    this.startPos = startPos;
    this.opacityBefore = opacityBefore;
    this.opacityAfter = opacityAfter;
    this.resetPxs();
  }

  resetPxs() {
    this.pxStart = this.start ? customScroll.toPx(this.start) : 0;
    this.pxEnd = this.end
      ? customScroll.toPx(this.end)
      : document.body.clientHeight;
    this.pxStartPos = customScroll.toPx(this.startPos);
  }
}
