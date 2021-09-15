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
    let behaviours = sElem.currentOrNextOrLastBehaviour();
    if (behaviours[0]) {
      behaviour = behaviours[0];
      sElem.elem.style.transform =
        "translateY(" +
        (behaviour.pxStartPos +
          (window.scrollY - behaviour.pxStart) * behaviour.speed) +
        "px)";
      if (behaviour.opacityBefore != null && behaviour.opacityAfter != null) {
        sElem.elem.style.opacity =
          ((window.scrollY - behaviour.pxStart) /
            (behaviour.pxEnd - behaviour.pxStart)) *
            (behaviour.opacityAfter - behaviour.opacityBefore) +
          behaviour.opacityBefore;
      }
    } else if (behaviours[1]) {
      behaviour = behaviours[1];
      sElem.elem.style.transform = "translateY(" + behaviour.pxStartPos + "px)";
      if (behaviour.opacityBefore != null) {
        sElem.elem.style.opacity = behaviour.opacityBefore;
      }
    } else {
      behaviour = behaviours[2];
      sElem.elem.style.transform =
        "translateY(" +
        (behaviour.pxStartPos +
          (behaviour.pxEnd - behaviour.pxStart) * behaviour.speed) +
        "px)";
      if (behaviour.opacityAfter != null) {
        sElem.elem.style.opacity = behaviour.opacityAfter;
      }
    }
  }
};
customScroll.onResize = (setPx = true) => {
  let height = 0;
  for (let i = 0; i < customScroll.elements.length; i++) {
    for (let j = 0; j < customScroll.elements[i].behaviours.length; j++) {
      let b = customScroll.elements[i].behaviours[j];
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
  behaviours = [];
  elem;
  constructor(elem) {
    this.elem = elem;
    customScroll.elements.push(this);
  }
  addBehaviour(behaviour) {
    this.behaviours.push(behaviour);
    customScroll.onResize(false);
    return this;
  }
  opacityAt(pos, fromopacity, toopacity, elementPos = 0) {
    this.addBehaviour(
      new PositionBehaviour(pos, pos, 1, elementPos, fromopacity, toopacity)
    );
    return this;
  }
  currentOrNextOrLastBehaviour() {
    let scrollPos = window.scrollY;
    let next = undefined;
    let last = undefined;
    for (let i = 0; i < this.behaviours.length; i++) {
      let behaviour = this.behaviours[i];
      if (scrollPos >= behaviour.pxStart && scrollPos <= behaviour.pxEnd) {
        return [behaviour, undefined, undefined];
      }
      if (
        scrollPos < behaviour.pxStart &&
        (!next || next.pxStart > behaviour.pxStart)
      )
        next = behaviour;
      if (
        !next &&
        scrollPos > behaviour.pxEnd &&
        (!last || last.pxEnd < behaviour.pxEnd)
      )
        last = behaviour;
    }
    return [undefined, next, last];
  }
}
class PositionBehaviour {
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
