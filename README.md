# custom-scroll-behaviors-js

library for scroll events on webpages, including paralax effects and much more, easy to use with custom elements and JS only approach (coming soon)
see test/example projects and the source at https://github.com/TheBlue-1/custom-scroll-behaviors-js

### current version supports

- custom html elements for scroll behaviors
- predefined behaviors for
  - vertical/horizontal movement
  - color change
  - opacity change
- custom behavior to adjust to your needs
- automaticly adjust the height of the body (optional)

### next version will support:

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

## Usage of JS only approach

(coming soon)

## General Information

interfering behaviors will be overridden by the last one
