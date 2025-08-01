================================================
FILE: README.md
================================================
# Theme toggle effect

Here's how we can create theme toggle effect using view transitions api

This is literally the two lines of js you need

```js
if (!document.startViewTransition) switchTheme()
document.startViewTransition(switchTheme);
```

Then you can write your css as you wish to

For example

```css
::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
}

@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
```

This will create a nice circular transition effect when you switch themes.
![theme-toggle](.github/assets/vta.gif)

For more examples, visit [theme-toggle.rdsx.dev](https://theme-toggle.rdsx.dev)

Don't forget to star the repo if you like it

Follow me on [x (twitter)](https://x.com/rds_agi) & [github](https://github.com/rudrodip)



================================================
FILE: animation-registry.js
================================================
const ANIMATIONS = [
  {
    name: "circle",
    css: `
      ::view-transition-group(root) { 
        animation-timing-function: var(--expo-out); 
      }
      ::view-transition-old(root), .dark::view-transition-old(root) { 
        animation: none; 
        z-index: -1; 
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>') center / 0 no-repeat;
        animation: scale 1s;
      }
      @keyframes scale { 
        to { 
          mask-size: 200vmax; 
        } 
      }
    `,
  },
  {
    name: "circle-with-blur",
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat;
        animation: scale 1s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation: scale 1s;
      }
      @keyframes scale {
        to {
          mask-size: 200vmax;
        }
      }
    `,
  },
  {
    name: "circle-blur-top-left",
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat;
        mask-origin: content-box;
        animation: scale 1s;
        transform-origin: top left;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1s;
        transform-origin: top left;
        z-index: -1;
      }
      @keyframes scale {
        to {
          mask-size: 350vmax;
        }
      }
    `,
  },
  {
    name: "polygon",
    css: `
      ::view-transition-group(root) {
        animation-duration: 0.7s;
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        animation-name: reveal-light;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark;
      }
      @keyframes reveal-dark {
        from {
          clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
        }
        to {
          clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
        }
      }
      @keyframes reveal-light {
        from {
          clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
        }
        to {
          clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
        }
      }
    `,
  },
  {
    name: "polygon-gradient",
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-out);
      }
      ::view-transition-new(root) {
        mask: url('assets/custom-svg.svg') top left / 0 no-repeat;
        mask-origin: top left;
        animation: scale 1.5s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 1.5s;
        z-index: -1;
        transform-origin: top left;
      }
      @keyframes scale {
        to {
          mask-size: 200vmax;
        }
      }
    `,
  },
  {
    name: "gif-1",
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-in);
      }
      ::view-transition-new(root) {
        mask: url('https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif') center / 0 no-repeat;
        animation: scale 3s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 3s;
      }
      @keyframes scale {
        0% {
          mask-size: 0;
        }
        10% {
          mask-size: 50vmax;
        }
        90% {
          mask-size: 50vmax;
        }
        100% {
          mask-size: 2000vmax;
        }
      }
    `,
  },
  {
    name: "gif-2",
    css: `
      ::view-transition-group(root) {
        animation-timing-function: var(--expo-in);
      }
      ::view-transition-new(root) {
        mask: url('https://media.tenor.com/Jz0aSpk9VIQAAAAi/i-love-you-love.gif') center / 0 no-repeat;
        animation: scale 2s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale 2s;
      }
      @keyframes scale {
        0% {
          mask-size: 0;
        }
        10% {
          mask-size: 50vmax;
        }
        90% {
          mask-size: 50vmax;
        }
        100% {
          mask-size: 2000vmax;
        }
      }
    `,
  },
];


================================================
FILE: animations.txt
================================================
/* circle */

::view-transition-group(root) { 
  animation-timing-function: var(--expo-out); 
}
::view-transition-old(root), .dark::view-transition-old(root) { 
  animation: none; 
  z-index: -1; 
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
}
@keyframes scale { 
  to { 
    mask-size: 200vmax; 
  } 
}
    

/* circle-with-blur */

::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
}
@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
    

/* circle-blur-top-left */

::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat;
  mask-origin: content-box;
  animation: scale 1s;
  transform-origin: top left;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1s;
  transform-origin: top left;
  z-index: -1;
}
@keyframes scale {
  to {
    mask-size: 350vmax;
  }
}
    

/* polygon */

::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  animation-name: reveal-light;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation-name: reveal-dark;
}
@keyframes reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}
@keyframes reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}
    

/* polygon-gradient */

::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}
::view-transition-new(root) {
  mask: url('assets/custom-svg.svg') top left / 0 no-repeat;
  mask-origin: top left;
  animation: scale 1.5s;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1.5s;
  z-index: -1;
  transform-origin: top left;
}
@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
    

/* gif-1 */

::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}
::view-transition-new(root) {
  mask: url('https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif') center / 0 no-repeat;
  animation: scale 3s;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 3s;
}
@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
    

/* gif-2 */

::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}
::view-transition-new(root) {
  mask: url('https://media.tenor.com/Jz0aSpk9VIQAAAAi/i-love-you-love.gif') center / 0 no-repeat;
  animation: scale 2s;
}
::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 2s;
}
@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}

/* animation timing functions */
:root {
  --expo-in: linear(
    0 0%, 0.0085 31.26%, 0.0167 40.94%,
    0.0289 48.86%, 0.0471 55.92%,
    0.0717 61.99%, 0.1038 67.32%,
    0.1443 72.07%, 0.1989 76.7%,
    0.2659 80.89%, 0.3465 84.71%,
    0.4419 88.22%, 0.554 91.48%,
    0.6835 94.51%, 0.8316 97.34%, 1 100%
  );
  --expo-out: linear(
    0 0%, 0.1684 2.66%, 0.3165 5.49%,
    0.446 8.52%, 0.5581 11.78%,
    0.6535 15.29%, 0.7341 19.11%,
    0.8011 23.3%, 0.8557 27.93%,
    0.8962 32.68%, 0.9283 38.01%,
    0.9529 44.08%, 0.9711 51.14%,
    0.9833 59.06%, 0.9915 68.74%, 1 100%
  );
}



================================================
FILE: index.html
================================================
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="theme toggle using view transitions api"
    />
    <meta
      name="keywords"
      content="view transitions api, theme toggle, css mask, css clip-path"
    />
    <title>Theme toggle - view transition api</title>
    <meta property="og:title" content="Theme toggle - view transition api" />
    <meta
      property="og:description"
      content="Theme toggle using view transitions api."
    />
    <meta
      property="og:image"
      content="https://theme-toggle.rdsx.dev/assets/og.png"
    />
    <meta property="og:url" content="https://theme-toggle.rdsx.dev" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Theme toggle - view transition api" />
    <meta
      name="twitter:description"
      content="Theme toggle using view transitions api."
    />
    <meta
      name="twitter:image"
      content="https://theme-toggle.rdsx.dev/assets/og.png"
    />
    <meta name="twitter:site" content="@rds_agi" />
    <link rel="icon" href="./assets/favicon.svg" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="prism.css" />
  </head>
  <body>
    <h1 style="margin-top: 5rem">Theme toggle effect</h1>
    <h2 style="font-size: 2rem">
      using
      <a
        href="https://developer.chrome.com/docs/web-platform/view-transitions/"
        target="_blank"
        rel="noopener noreferrer"
      >
        view transitions api
      </a>
    </h2>
    <div
      style="
        display: flex;
        align-items: center;
        gap: 1rem;
        height: 40px;
        margin-top: 1rem;
      "
    >
      <a
        href="https://github.com/rudrodip/theme-toggle-effect"
        target="_blank"
        rel="noopener noreferrer"
      >
        github
      </a>
      <a href="https://x.com/rds_agi" target="_blank" rel="noopener noreferrer">
        x (twitter)
      </a>
    </div>
    <a href="/animations.txt" style="font-size: smaller"
      >click here to get all the css written for the following examples</a
    >
    <div
      style="
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0rem;
      "
    >
      <h3>
        this is literally all the
        <code style="color: #fed602">javascript</code> you need
      </h3>
      <pre>
      <code class="language-js">if (!document.startViewTransition) switchTheme()
document.startViewTransition(switchTheme);</code>
    </pre>
    </div>
    <h3>Here's some demos</h3>
    <div
      id="demo-container"
      style="
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: center;
        margin: 1rem 0rem;
      "
    ></div>
    <h3 style="margin-top: 2rem">Now you can write your css as you wish to</h3>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>following is a simple example, that uses a circular mask</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="circle"
        id="toggle1"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="white"/></svg>')
    center / 0 no-repeat;
  animation: scale 1s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
}

@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
</style></code>
    </pre>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>lets add a little blur to the svg</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="circle-with-blur"
        id="toggle3"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>') center / 0 no-repeat;
  animation: scale 1s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation: scale 1s;
}

@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
</style></code>
    </pre>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>let's try to pivot the center of the circle to top left</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="circle-blur-top-left"
        id="toggle4"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-new(root) {
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="0" cy="0" r="18" fill="white" filter="url(%23blur)"/></svg>') top left / 0 no-repeat;
  mask-origin: content-box;
  animation: scale 1s;
  transform-origin: top left;
}

::view-transition-old(root),
  .dark::view-transition-old(root) {
  animation: scale 1s;
  transform-origin: top left;
  z-index: -1;
}

@keyframes scale {
  to {
    mask-size: 350vmax;
  }
}
</style></code>
    </pre>
    <h4 style="margin: 1rem 0rem">
      see this is simple, now the skylimit is your imagination
    </h4>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>
        we've seen all the svg mask animations, but we can use clip-paths too
      </p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="polygon"
        id="toggle5"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-duration: 0.7s;
  animation-timing-function: var(--expo-out);
}
      
::view-transition-new(root) {
  animation-name: reveal-light;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: none;
  z-index: -1;
}
.dark::view-transition-new(root) {
  animation-name: reveal-dark;
}

@keyframes reveal-dark {
  from {
    clip-path: polygon(50% -71%, -50% 71%, -50% 71%, 50% -71%);
  }
  to {
    clip-path: polygon(50% -71%, -50% 71%, 50% 171%, 171% 50%);
  }
}

@keyframes reveal-light {
  from {
    clip-path: polygon(171% 50%, 50% 171%, 50% 171%, 171% 50%);
  }
  to {
    clip-path: polygon(171% 50%, 50% 171%, -50% 71%, 50% -71%);
  }
}
</style></code>
    </pre>
    <p>
      the issue with using clip path is that you can't do much with it, like
      adding gradient or blur. so svg should be a good choice for most cases
    </p>
    <br />
    <p>
      lets see how can we improve the clip-path animation with a custom svg with
      linear gradient
    </p>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>we can use local assets too</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="polygon-gradient"
        id="toggle6"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-timing-function: var(--expo-out);
}

::view-transition-new(root) {
  mask: url('assets/custom-svg.svg') top left / 0 no-repeat;
  mask-origin: top left;
  animation: scale 1.5s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1.5s;
  z-index: -1;
  transform-origin: top left;
}

@keyframes scale {
  to {
    mask-size: 200vmax;
  }
}
</style></code>
    </pre>
    <h1>here's the cool part</h1>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>you can use gifs too</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="gif-1"
        id="toggle7"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/cyORI7kwShQAAAAi/shigure-ui-dance.gif') center / 0 no-repeat;
  animation: scale 3s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 3s;
}

@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
</style></code>
    </pre>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0.5rem 0rem;
      "
    >
      <p>this one's good 😉</p>
      <button
        aria-pressed="false"
        class="theme-toggle"
        data-animation="gif-2"
        id="toggle8"
      >
        Demo
      </button>
    </div>
    <pre>
      <code class="language-css"><style>::view-transition-group(root) {
  animation-timing-function: var(--expo-in);
}

::view-transition-new(root) {
  mask: url('https://media.tenor.com/Jz0aSpk9VIQAAAAi/i-love-you-love.gif') center / 0 no-repeat;
  animation: scale 1.5s;
}

::view-transition-old(root),
.dark::view-transition-old(root) {
  animation: scale 1.5s;
}

@keyframes scale {
  0% {
    mask-size: 0;
  }
  10% {
    mask-size: 50vmax;
  }
  90% {
    mask-size: 50vmax;
  }
  100% {
    mask-size: 2000vmax;
  }
}
</style></code>
    </pre>
    <p>
      here are the two animation timing functions i'm using for the examples
    </p>
    <pre>
      <code class="language-css"><style>:root {
  --expo-in: linear(
    0 0%, 0.0085 31.26%, 0.0167 40.94%,
    0.0289 48.86%, 0.0471 55.92%,
    0.0717 61.99%, 0.1038 67.32%,
    0.1443 72.07%, 0.1989 76.7%,
    0.2659 80.89%, 0.3465 84.71%,
    0.4419 88.22%, 0.554 91.48%,
    0.6835 94.51%, 0.8316 97.34%, 1 100%
  );
  --expo-out: linear(
    0 0%, 0.1684 2.66%, 0.3165 5.49%,
    0.446 8.52%, 0.5581 11.78%,
    0.6535 15.29%, 0.7341 19.11%,
    0.8011 23.3%, 0.8557 27.93%,
    0.8962 32.68%, 0.9283 38.01%,
    0.9529 44.08%, 0.9711 51.14%,
    0.9833 59.06%, 0.9915 68.74%, 1 100%
  );
}
</style></code>
    </pre>
    <h2>
      thats basically it. you have enough context to build cool theme
      transitions with view transitions api
    </h2>
    <div style="display: flex; align-items: center; gap: 1rem; height: 50px">
      <a
        href="https://github.com/rudrodip/theme-toggle-effect"
        target="_blank"
        rel="noopener noreferrer"
      >
        github
      </a>
      <a href="https://x.com/rds_agi" target="_blank" rel="noopener noreferrer">
        x (twitter)
      </a>
    </div>
    <div
      class="tweets-wrapper"
      style="
        width: 100%;
        max-width: 65rem;
        margin-left: auto;
        margin-right: auto;
      "
    >
      <div class="tweet-container">
        <h3>Used by</h3>
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            btw we&#39;ve updated our landing
            <a href="https://t.co/rNNavmEu5Q">pic.twitter.com/rNNavmEu5Q</a>
          </p>
          &mdash; Drizzle ORM (@DrizzleORM)
          <a
            href="https://twitter.com/DrizzleORM/status/1820528062632755211?ref_src=twsrc%5Etfw"
            >August 5, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="tl" dir="ltr">
            Shigure Ui ftw
            <a href="https://t.co/wK9O86PVOy">https://t.co/wK9O86PVOy</a>
            <a href="https://t.co/FAVVKQxdmw">pic.twitter.com/FAVVKQxdmw</a>
          </p>
          &mdash; SaltyAom (@saltyAom)
          <a
            href="https://twitter.com/saltyAom/status/1805166513433055723?ref_src=twsrc%5Etfw"
            >June 24, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            OK, you can do some fun things quite simply now with View
            Transitions API.<br /><br />Thanks for showing me
            <a href="https://twitter.com/rds_agi?ref_src=twsrc%5Etfw"
              >@rds_agi</a
            >
            via
            <a href="https://twitter.com/saltyAom?ref_src=twsrc%5Etfw"
              >@saltyAom</a
            >
            ❤️ <a href="https://t.co/dEBYHsmKra">pic.twitter.com/dEBYHsmKra</a>
          </p>
          &mdash; Lucie (@li_hbr)
          <a
            href="https://twitter.com/li_hbr/status/1805289665907290307?ref_src=twsrc%5Etfw"
            >June 24, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            🔦 flowplane now has a light mode<br /><br />credits to
            <a href="https://twitter.com/rds_agi?ref_src=twsrc%5Etfw"
              >@rds_agi</a
            >
            for the css transition.<a
              href="https://twitter.com/_nightsweekends?ref_src=twsrc%5Etfw"
              >@_nightsweekends</a
            >
            <a href="https://twitter.com/_buildspace?ref_src=twsrc%5Etfw"
              >@_buildspace</a
            >
            <a href="https://t.co/lUFgzJrEGD">pic.twitter.com/lUFgzJrEGD</a>
          </p>
          &mdash; shiv (@sxhivs)
          <a
            href="https://twitter.com/sxhivs/status/1804558706606256446?ref_src=twsrc%5Etfw"
            >June 22, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            leapflow now also has a light mode :) <br /><br />cc:
            <a href="https://twitter.com/rds_agi?ref_src=twsrc%5Etfw"
              >@rds_agi</a
            >
            <a href="https://t.co/lwZr5QkcIj">pic.twitter.com/lwZr5QkcIj</a>
          </p>
          &mdash; Suhas Sumukh (@suhasasumukh)
          <a
            href="https://twitter.com/suhasasumukh/status/1804560307508965677?ref_src=twsrc%5Etfw"
            >June 22, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="en" dir="ltr">
            Ultimate Rick Roll with Framer 😏<br /><br />page transition effect
            in .<a href="https://twitter.com/framer?ref_src=twsrc%5Etfw"
              >@framer</a
            >
            <a href="https://t.co/qAglIZ3uMg">pic.twitter.com/qAglIZ3uMg</a>
          </p>
          &mdash; Ruddro (@ruddro29)
          <a
            href="https://twitter.com/ruddro29/status/1806345425064190366?ref_src=twsrc%5Etfw"
            >June 27, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
      <div class="tweet-container">
        <blockquote class="twitter-tweet">
          <p lang="zh" dir="ltr">
            给博客加上了主题切换效果， thank you
            <a href="https://twitter.com/rds_agi?ref_src=twsrc%5Etfw"
              >@rds_agi</a
            >
            <a href="https://t.co/0lYlc0YQZ0">pic.twitter.com/0lYlc0YQZ0</a>
          </p>
          &mdash; Godruoyi (@godruoyi)
          <a
            href="https://twitter.com/godruoyi/status/1805502949961220553?ref_src=twsrc%5Etfw"
            >June 25, 2024</a
          >
        </blockquote>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
      </div>
    </div>
    <script type="module" src="script.js"></script>
    <script src="animation-registry.js"></script>
  </body>
</html>



================================================
FILE: prism.css
================================================
/* Prism Code */

/* PrismJS 1.23.0
https://prismjs.com/download.html#themes=prism-tomorrow&languages=css+css-extras&plugins=line-numbers+inline-color+toolbar+copy-to-clipboard */
/**
 * prism.js tomorrow night eighties for JavaScript, CoffeeScript, CSS and HTML
 * Based on https://github.com/chriskempson/tomorrow-theme
 * @author Rose Pritchard
 */

 .dark code[class*="language-"],
 .dark pre[class*="language-"] {
   color: #ccc;
 }
 
 code[class*="language-"],
 pre[class*="language-"] {
   color: hsl(0 0% 20%);
   background: none;
   font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
   font-size: 0.8rem;
   text-align: left;
   white-space: pre;
   word-spacing: normal;
   word-break: normal;
   word-wrap: normal;
   line-height: 1.5;
 
   -moz-tab-size: 4;
   -o-tab-size: 4;
   tab-size: 4;
 
   -webkit-hyphens: none;
   -moz-hyphens: none;
   -ms-hyphens: none;
   hyphens: none;
 
 }
 
 /* Code blocks */
 pre[class*="language-"] {
   padding: 1rem;
   margin: 1rem 0rem;
   overflow: auto;
   outline: transparent;
 }
 
 :not(pre) > code[class*="language-"],
 pre[class*="language-"] {
   background: hsl(0, 0%, 100%);
 }
 
 .dark :not(pre) > code[class*="language-"],
 .dark pre[class*="language-"] {
   background: #2d2d2d;
 }
 
 /* Inline code */
 :not(pre) > code[class*="language-"] {
   padding: .1em;
   white-space: normal;
 }
 
 pre {
   height: 100%;
   display: flex;
   flex-direction: column;
   border: 1px solid var(--border);
 }
 
 .token.comment,
 .token.block-comment,
 .token.prolog,
 .token.doctype,
 .token.cdata {
   color: #999;
 }
 
 .dark .token.punctuation {
   color: #ccc;
 }
 
 .token-punctuation {
   color: red;
 }
 
 .token.tag,
 .token.attr-name,
 .token.namespace,
 .token.deleted {
   color: #e2777a;
 }
 
 .token.function-name {
   color: #6196cc;
 }
 
 .token.boolean,
 .token.number,
 .token.function {
   color: hsl(10 100% 50%);
 }
 .dark .token.boolean,
 .dark .token.number,
 .dark .token.function {
   color: hsl(20 100% 70%);
 }
 
 .token.property,
 .token.class-name,
 .token.constant,
 .token.symbol {
   color: #f8c555;
 }
 
 .token.selector,
 .token.important,
 .token.atrule,
 .token.keyword,
 .token.builtin {
   color: hsl(280 80% 50%);
 }
 
 .dark .token.selector,
 .dark .token.important,
 .dark .token.atrule,
 .dark .token.keyword,
 .dark .token.builtin {
   color: hsl(280 80% 80%);
 }
 
 .token.string,
 .token.char,
 .token.attr-value,
 .token.regex,
 .token.variable {
   color: #7ec699;
 }
 
 .token.operator,
 .token.entity,
 .token.url {
   color: hsl(140 100% 30%);
 }
 
 .dark .token.operator,
 .dark .token.entity,
 .dark .token.url {
   color: hsl(140 100% 80%);
 }
 
 .token.important,
 .token.bold {
   font-weight: bold;
 }
 .token.italic {
   font-style: italic;
 }
 
 .token.entity {
   cursor: help;
 }
 
 .token.inserted {
   color: green;
 }
 
 pre[class*="language-"].line-numbers {
   position: relative;
   padding-left: 3.8em;
   counter-reset: linenumber;
 }
 
 pre[class*="language-"].line-numbers > code {
   position: relative;
   white-space: inherit;
 }
 
 .line-numbers .line-numbers-rows {
   position: absolute;
   pointer-events: none;
   top: 0;
   font-size: 100%;
   left: -3.8em;
   width: 3em; /* works for line-numbers below 1000 lines */
   letter-spacing: -1px;
   border-right: 1px solid #999;
 
   -webkit-user-select: none;
   -moz-user-select: none;
   -ms-user-select: none;
   user-select: none;
 
 }
 
   .line-numbers-rows > span {
     display: block;
     counter-increment: linenumber;
   }
 
     .line-numbers-rows > span:before {
       content: counter(linenumber);
       color: #999;
       display: block;
       padding-right: 0.8em;
       text-align: right;
     }
 
 span.inline-color-wrapper {
   /*
    * The background image is the following SVG inline in base 64:
    *
    * <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2">
    *     <path fill="gray" d="M0 0h2v2H0z"/>
    *     <path fill="white" d="M0 0h1v1H0zM1 1h1v1H1z"/>
    * </svg>
    *
    * SVG-inlining explained:
    * https://stackoverflow.com/a/21626701/7595472
    */
   background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9ImdyYXkiIGQ9Ik0wIDBoMnYySDB6Ii8+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48L3N2Zz4=");
   /* This is to prevent visual glitches where one pixel from the repeating pattern could be seen. */
   background-position: center;
   background-size: 110%;
 
   display: inline-block;
   height: 1.333ch;
   width: 1.333ch;
   margin: 0 .333ch;
   box-sizing: border-box;
   border: 1px solid white;
   outline: 1px solid rgba(0,0,0,.5);
   overflow: hidden;
 }
 
 span.inline-color {
   display: block;
   /* To prevent visual glitches again */
   height: 120%;
   width: 120%;
 }
 
 div.code-toolbar {
   height: 100%;
   position: relative;
 }
 
 div.code-toolbar > .toolbar {
   position: absolute;
   top: .3em;
   right: .2em;
   opacity: 1;
 }
 
 div.code-toolbar:hover > .toolbar {
   opacity: 1;
 }
 
 /* Separate line b/c rules are thrown out if selector is invalid.
    IE11 and old Edge versions don't support :focus-within. */
 div.code-toolbar:focus-within > .toolbar {
   opacity: 1;
 }
 
 div.code-toolbar > .toolbar .toolbar-item {
   display: inline-block;
 }
 
 div.code-toolbar > .toolbar a {
   cursor: pointer;
 }
 
 div.code-toolbar > .toolbar button {
   background: none;
   border: 0;
   color: inherit;
   font: inherit;
   line-height: normal;
   overflow: visible;
   padding: 0;
   -webkit-user-select: none; /* for button */
   -moz-user-select: none;
   -ms-user-select: none;
 }
 
 div.code-toolbar > .toolbar a,
 div.code-toolbar > .toolbar button {
   color: #bbb;
   font-size: 1rem;
   padding: 0.5rem;
   font-family: sans-serif;
   background: hsl(0, 0%, 25%);
   outline: transparent;
   cursor: pointer;
 }
 
 div.code-toolbar > .toolbar a:hover,
 div.code-toolbar > .toolbar a:focus,
 div.code-toolbar > .toolbar button:hover,
 div.code-toolbar > .toolbar button:focus,
 div.code-toolbar > .toolbar span:hover,
 div.code-toolbar > .toolbar span:focus {
  background: hsl(0, 0%, 40%);
   text-decoration: none;
 }


================================================
FILE: script.js
================================================
import Prism from 'https://cdn.skypack.dev/prismjs'

let styleElement = document.createElement('style');
document.head.appendChild(styleElement);

let activeButton = null;
let currentTheme = 'light'; // Assuming 'light' is the default theme

const injectCSS = (css) => {
  styleElement.textContent = css;
};

const SWITCH = (button, animation) => {
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  button.setAttribute("aria-pressed", newTheme === 'dark');
  document.documentElement.className = newTheme;
  currentTheme = newTheme;
  injectCSS(animation.css);
};

const updateButtonStates = () => {
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    if (btn === activeButton) {
      btn.disabled = false;
      btn.setAttribute("aria-pressed", currentTheme === 'dark');
    } else {
      btn.disabled = currentTheme === 'dark';
      btn.setAttribute("aria-pressed", "false");
    }
  });
};

const TOGGLE_THEME = (button, animation) => {
  if (activeButton && activeButton !== button) {
    return; // If there's an active button and it's not this one, do nothing
  }

  if (!document.startViewTransition) {
    SWITCH(button, animation);
    activeButton = currentTheme === 'dark' ? button : null;
    updateButtonStates();
  } else {
    const transition = document.startViewTransition(() => {
      SWITCH(button, animation);
      activeButton = currentTheme === 'dark' ? button : null;
    });
    transition.finished.then(() => {
      updateButtonStates();
    });
  }
};

const getAnimationByName = (name) => {
  return ANIMATIONS.find(animation => animation.name === name);
};

// Use event delegation on the document body
document.body.addEventListener('click', (event) => {
  if (event.target.classList.contains('theme-toggle') && !event.target.disabled) {
    const animationName = event.target.dataset.animation;
    const animation = getAnimationByName(animationName);
    
    if (animation) {
      TOGGLE_THEME(event.target, animation);
    } else {
      console.warn(`Animation "${animationName}" not found for button:`, event.target);
    }
  }
});

// demo containers
const DEMO_CONTAINER = document.getElementById("demo-container");

ANIMATIONS.forEach((animation) => {
  const button = document.createElement("button");
  button.setAttribute("aria-pressed", "false");
  button.className = "theme-toggle";
  button.dataset.animation = animation.name;
  button.textContent = animation.name;
  DEMO_CONTAINER.appendChild(button);
});

// Initial button state setup
updateButtonStates();


================================================
FILE: style.css
================================================
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  padding: 0rem 0.3rem;
  min-height: 100vh;
  width: 100%;
  max-width: 42rem;
  margin: auto;
  color: var(--color);
  background: var(--bg);
  font-family: "Manrope", sans-serif;
  font-optical-sizing: auto;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

:root {
  --color: hsl(0 0% 6%);
  --bg: hsl(0 0% 98%);
  --border: hsl(0, 0%, 22%);
  --expo-out: linear(
    0 0%,
    0.1684 2.66%,
    0.3165 5.49%,
    0.446 8.52%,
    0.5581 11.78%,
    0.6535 15.29%,
    0.7341 19.11%,
    0.8011 23.3%,
    0.8557 27.93%,
    0.8962 32.68%,
    0.9283 38.01%,
    0.9529 44.08%,
    0.9711 51.14%,
    0.9833 59.06%,
    0.9915 68.74%,
    1 100%
  );
  --expo-in: linear(
    0 0%,
    0.0085 31.26%,
    0.0167 40.94%,
    0.0289 48.86%,
    0.0471 55.92%,
    0.0717 61.99%,
    0.1038 67.32%,
    0.1443 72.07%,
    0.1989 76.7%,
    0.2659 80.89%,
    0.3465 84.71%,
    0.4419 88.22%,
    0.554 91.48%,
    0.6835 94.51%,
    0.8316 97.34%,
    1 100%
  );
}

h1 {
  letter-spacing: -0.05em;
  font-size: clamp(2rem, 4vw + 1rem, 4rem);
  line-height: 1;
  font-weight: bolder;
}

pre {
  max-width: 100%;
}

p {
  width: 60ch;
  max-width: 100%;
}

a {
  color: var(--color);
  text-decoration: none;
  border-bottom: 1px solid var(--color);
}

a:is(:hover, :focus-visible) {
  border-bottom: 2px solid rgb(0, 140, 255);
}

.dark a:is(:hover, :focus-visible) {
  border-bottom: 2px solid rgb(0, 183, 255);
}

.dark {
  --color: hsl(0 0% 98%);
  --bg: hsl(0 0% 6%);
  --border: hsl(0, 0%, 52%);
}

.theme-toggle {
  color: var(--color);
  padding: 5px 10px;
  background-color: var(--bg);
  border: 1px solid var(--border);
  display: grid;
  place-items: center;
  background: transparent;
  transition: background 0.2s;
  cursor: pointer;
  z-index: 10;
}

.theme-toggle:is(:hover, :focus-visible) {
  background: hsl(0 0% 90%);
}

.dark .theme-toggle:is(:hover, :focus-visible) {
  background: hsl(0 0% 30%);
}

.theme-toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tweet-container {
  flex: 1;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.tweets-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.twitter-tweet {
  flex: 1;
}

