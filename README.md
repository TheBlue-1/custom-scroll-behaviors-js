# custom-scroll-behaviors-js (v1.0.5) - in development

Library for scroll events on webpages, including parallax effects and much more, easy to use with custom elements and JS only approach (coming soon).
See test/example projects and the source at [github]().
Supports all known desktop and mobile browsers (except IE and Opera mini).

### current version (1.0) supports

- custom html elements for scroll behaviors
- predefined behaviors for
  - vertical/horizontal movement
  - color change
  - opacity change
- custom behavior to adjust to your needs
- automatically adjust the height of the body (optional)

### next version (1.1) will support:

- js only approach (without custom html)
- animation types (like ease)

## Install and Import

You can install the module

- with npm: `npm i custom-scroll-behaviors`
- without npm: download the package and move it into your project

To import

- in simple projects (front-end html import):

  ```html
  <head>
    <script type="module" src="../../target/index.js"></script>
    <script type="module">
      import { scrollElementsConfig, scrollHandler } from "../../target/index.js";
      scrollElementsConfig.autoSizePage = true;
      scrollHandler.init();
    </script>
  </head>
  ```

- in React projects:

  ```typescript
  React.useEffect(() => {
    const loadingScrollBehavior = import("custom-scroll-behaviors");
    loadingScrollBehavior.then((scrollBehavior) => {
      scrollBehavior.scrollElementsConfig.autoSizePage = true;
      scrollBehavior.scrollHandler.init();
    });
  }, []);
  ```

## Usage of custom HTML elements

add the behaviors to an element by adding the custom element as a child

```html
<div class="some-style">
  <vertical-scroll-behavior start="0px" end="700px" start-pos="0vh" end-pos="90vh"></vertical-scroll-behavior>
  <rgba-color-scroll-behavior start="100px" end="1000px" start-color="#ff0000ff" end-color="#0000ffff"> </rgba-color-scroll-behavior>
</div>
```

### Elements

| Name                       |
| -------------------------- |
| vertical-scroll-behavior   |
| horizontal-scroll-behavior |
| visibility-scroll-behavior |
| rgba-color-scroll-behavior |
| custom-scroll-behavior     |

### Properties of the custom elements

#### On all behaviors

| name   | usage                                                  | allowed values                                                |
| ------ | ------------------------------------------------------ | ------------------------------------------------------------- |
| start  | start of the animation<br />(scroll distance from top) | number with unit (px,vh,vw)<br />(no unit will default to px) |
| end    | end of the animation<br />(scroll distance from top)   | number with unit (px,vh,vw)<br />(no unit will default to px) |
| speed  | multiplier for scroll-value                            | positive number                                               |
| repeat | let the animation repeat<br />or continue itself       | "repeat" / "continue"<br />optional                           |

Each behavior also has a start and end value (like the start and end position).
Of the five attributes : start,end,speed,"start-value","end-value" exactly 4 have to be specified

#### On vertical and horizontal behaviors

| name      | usage                                                                                | allowed values                                                |
| --------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| start-pos | position of the element at the start of the animation<br />(left/top of the element) | number with unit (px,vh,vw)<br />(no unit will default to px) |
| end-pos   | position of the element at the end of the animation<br />(left/top of the element)   | number with unit (px,vh,vw)<br />(no unit will default to px  |

#### On visibility behavior

| name          | usage                                                | allowed values         |
| ------------- | ---------------------------------------------------- | ---------------------- |
| start-opacity | opacity of the element at the start of the animation | number between 0 and 1 |
| end-opacity   | opacity of the element at the end of the animation   | number between 0 and 1 |

#### On rgba background color behavior

| name        | usage                                              | allowed values             |
| ----------- | -------------------------------------------------- | -------------------------- |
| start-color | color of the element at the start of the animation | hex rgba value (#ffffffff) |
| end-color   | color of the element at the end of the animation   | hex rgba value (#ffffffff) |

#### On custom behavior

| name                   | usage                                              | allowed values           |
| ---------------------- | -------------------------------------------------- | ------------------------ |
| start-value            | value of the element at the start of the animation | number                   |
| end-value              | value of the element at the end of the animation   | number                   |
| css-attribute          | name of the css attribute that is animated         | string (valid attribute) |
| css-attribute-unit     | unit of the attribute (like "px")                  | string                   |
| css-attribute-pre-unit | pre unit of the attribute (like "#" for colors)    | string                   |

## Usage of JS only approach

(coming soon)

## Config

| name         | usage                                                                                                           | allowed values |
| ------------ | --------------------------------------------------------------------------------------------------------------- | -------------- |
| autoSizePage | sets the height of the body to the end of the last animation<br />(won't be the right height for every website) | boolean        |
|              |                                                                                                                 |                |

## General Information

interfering behaviors will be overridden by the last one
