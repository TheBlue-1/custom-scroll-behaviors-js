let header = document.getElementById("header");
let topElem1 = document.getElementById("top1");
let topElem2 = document.getElementById("top2");
let content = document.getElementById("content");
let page1 = document.getElementById("infoPage1");
let page2 = document.getElementById("infoPage2");
let inbeetween1 = document.getElementById("inbetweenPage1");

let sHeader = new ScrollElement(header).addBehaviour(
  new PositionBehaviour(0, "66.67vh", -1, "-100vh", 1, 0)
);
let sTop2 = new ScrollElement(topElem2).addBehaviour(
  new PositionBehaviour("66.67vh", "116.67vh", 1, 0, 1, 1)
);
let sTop1 = new ScrollElement(topElem1).addBehaviour(
  new PositionBehaviour("66.67vh", "175vh", -0.46153, 0)
);

let sPage1 = new ScrollElement(page1)
  .addBehaviour(new PositionBehaviour("91.67vh", "300vh", -0.4, "-729.17vh"))
  .addBehaviour(new PositionBehaviour("333.33vh", "400vh", -0.75, "-812.5vh"));
let sPage2 = new ScrollElement(page2).addBehaviour(
  new PositionBehaviour("300vh", "420vh", -1, "-762.5vh")
);
let siPage1 = new ScrollElement(inbeetween1)
  .addBehaviour(new PositionBehaviour("175vh", "400vh", 2.5, "-662.5vh", 1, 1))
  .opacityAt("175vh", 0, 1, "-50vh")
  .opacityAt("450vh", 0, 0, 0);
