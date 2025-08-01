Directory structure:
└── googlechromelabs-dark-mode-toggle/
    ├── README.md
    ├── CODE_OF_CONDUCT.md
    ├── CONTRIBUTING.md
    ├── eslint.config.js
    ├── LICENSE
    ├── package.json
    ├── .prettierrc
    ├── demo/
    │   ├── common.css
    │   ├── dark-mode-toggle-playground.mjs
    │   ├── dark.css
    │   ├── dist.html
    │   ├── index.html
    │   ├── internal-stylesheets.html
    │   ├── light.css
    │   ├── slider.css
    │   ├── unstyled.html
    │   ├── with-flashing.html
    │   └── without-flashing.html
    ├── src/
    │   ├── dark-mode-toggle-stylesheets-loader.js
    │   ├── dark-mode-toggle.d.ts
    │   ├── dark-mode-toggle.mjs
    │   └── template-contents.tpl
    └── .github/
        └── workflows/
            └── main.yml


Files Content:

================================================
FILE: README.md
================================================
# `<dark-mode-toggle>` Element

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/dark-mode-toggle)

A custom element that allows you to easily put a _Dark Mode 🌒_ toggle or switch
on your site, so you can initially adhere to your users' preferences according
to
[`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme),
but also allow them to (optionally permanently) override their system setting
for just your site.

📚 Read all(!) about dark mode in the related article
[Hello Darkness, My Old Friend](https://web.dev/prefers-color-scheme/).

## Installation

Install from npm:

```bash
npm install --save dark-mode-toggle
```

Or, alternatively, use a `<script type="module">` tag (served from unpkg's CDN):

```html
<script type="module" src="https://unpkg.com/dark-mode-toggle"></script>
```

![Dark mode toggle live coding sample.](https://user-images.githubusercontent.com/145676/94532333-0466b580-023e-11eb-947e-f73044a7cd63.gif)

(See the [original HD version](https://youtu.be/qfsvoPhx-bE) so you can pause.)

## Usage

There are three ways how you can use `<dark-mode-toggle>`:

### ① Using different stylesheets per color scheme that are conditionally loaded

The custom element assumes that you have organized your CSS in different files
that you load conditionally based on the **`media`** attribute in the
stylesheet's corresponding `link` element. This is a great performance pattern,
as you don't force people to download CSS that they don't need based on their
current theme preference, yet non-matching stylesheets still get loaded, but
don't compete for bandwidth in the critical rendering path. You can also have
more than one file per theme. The example below illustrates the principle.

<!--
```
<custom-element-demo>
  <template>
    <link rel="stylesheet" href="https://googlechromelabs.github.io/dark-mode-toggle/demo/common.css">
    <link rel="stylesheet" href="https://googlechromelabs.github.io/dark-mode-toggle/demo/light.css" media="(prefers-color-scheme: light)">
    <link rel="stylesheet" href="https://googlechromelabs.github.io/dark-mode-toggle/demo/dark.css" media="(prefers-color-scheme: dark)">
    <script type="module" src="https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs"></script>
    <style>
      #dark-mode-toggle-1 {
        --dark-mode-toggle-dark-icon: url("https://googlechromelabs.github.io/dark-mode-toggle/demo/moon.png");
        --dark-mode-toggle-light-icon: url("https://googlechromelabs.github.io/dark-mode-toggle/demo/sun.png");
        --dark-mode-toggle-remember-icon-checked: url("https://googlechromelabs.github.io/dark-mode-toggle/demo/checked.svg");
        --dark-mode-toggle-remember-icon-unchecked: url("https://googlechromelabs.github.io/dark-mode-toggle/demo/unchecked.svg");
        --dark-mode-toggle-remember-font: 0.75rem 'Helvetica';
        --dark-mode-toggle-legend-font: bold 0.85rem 'Helvetica';
        --dark-mode-toggle-label-font: 0.85rem 'Helvetica';
        --dark-mode-toggle-color: var(--text-color);
        --dark-mode-toggle-background-color: none;
        --dark-mode-toggle-active-mode-background-color: var(--accent-color);
        --dark-mode-toggle-remember-filter: invert(100%);
      }
    </style>
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->

```html
<head>
  <link rel="stylesheet" href="common.css" />
  <link
    rel="stylesheet"
    href="light.css"
    media="(prefers-color-scheme: light)"
  />
  <link rel="stylesheet" href="dark.css" media="(prefers-color-scheme: dark)" />
  <script
    type="module"
    src="https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs"
  ></script>
</head>
<!-- ... -->
<main>
  <h1>Hi there</h1>
  <img
    src="https://googlechromelabs.github.io/dark-mode-toggle/demo/cat.jpg"
    alt="Sitting cat in front of a tree"
    width="320"
    height="195"
  />
  <p>Check out the dark mode toggle in the upper right corner!</p>
</main>
<aside>
  <dark-mode-toggle
    id="dark-mode-toggle-1"
    legend="Theme Switcher"
    appearance="switch"
    dark="Dark"
    light="Light"
    remember="Remember this"
  ></dark-mode-toggle>
</aside>
```

The above method might cause flashing
([#77](https://github.com/GoogleChromeLabs/dark-mode-toggle/issues/77)) when the
page loads, as the dark mode toggle module is loaded after the page is rendered.
A loader script can be used to apply the saved theme before the page is
rendered. Wrap the stylesheet tags with
`<noscript id="dark-mode-toggle-stylesheets">...</noscript>` and add the loader
script as follows:

```html
<head>
  <link rel="stylesheet" href="common.css" />
  <noscript id="dark-mode-toggle-stylesheets">
    <link
      rel="stylesheet"
      href="light.css"
      media="(prefers-color-scheme: light)"
    />
    <link
      rel="stylesheet"
      href="dark.css"
      media="(prefers-color-scheme: dark)"
    />
    <meta name="color-scheme" content="dark light" />
  </noscript>
  <script src="https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle-stylesheets-loader.js"></script>
  <script
    type="module"
    src="https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs"
  ></script>
</head>
<!-- ... -->
```

### ② Using a CSS class that you toggle

If you prefer to not split your CSS in different files based on the color
scheme, you can instead work with a class that you toggle, for example
`class="dark"`. You can see this in action in
[this demo](https://googlechrome.github.io/samples/dark-mode-class-toggle/).

```js
import * as DarkModeToggle from 'https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs';

const toggle = document.querySelector('dark-mode-toggle');
const body = document.body;

// Set or remove the `dark` class the first time.
toggle.mode === 'dark'
  ? body.classList.add('dark')
  : body.classList.remove('dark');

// Listen for toggle changes (which includes `prefers-color-scheme` changes)
// and toggle the `dark` class accordingly.
toggle.addEventListener('colorschemechange', () => {
  body.classList.toggle('dark', toggle.mode === 'dark');
});
```

### ③ Using internal stylesheets for each color scheme

This approach allows you to define styles directly within your HTML using
`<style>` tags, scoped to specific color schemes.

⚠️ **Warning**  
Internal stylesheets do not benefit from the loading optimizations provided by
`<link>` elements, which may increase the page's initial load time.

```html
<head>
  <style media="(prefers-color-scheme: light)">
    body {
      background-color: #ffffff;
      color: #000000;
    }
  </style>
  <style media="(prefers-color-scheme: dark)">
    body {
      background-color: #000000;
      color: #ffffff;
    }
  </style>
  <script
    type="module"
    src="https://googlechromelabs.github.io/dark-mode-toggle/src/dark-mode-toggle.mjs"
  ></script>
</head>
<!-- ... -->
```

## Demo

See the custom element in action in the
[interactive demo](https://googlechromelabs.github.io/dark-mode-toggle/demo/index.html).
It shows four different kinds of synchronized `<dark-mode-toggle>`s. If you use
Chrome on an Android device, pay attention to the address bar's theme color, and
also note how the favicon changes.

<img src="https://user-images.githubusercontent.com/145676/59537453-ec5b0d80-8ef6-11e9-9efb-c44ed9db24b6.png" width="400" alt="Dark">
<img src="https://user-images.githubusercontent.com/145676/59537454-ec5b0d80-8ef6-11e9-8a89-5e3fbda9c15c.png" width="400" alt="Light">

## Properties

Properties can be set directly on the custom element at creation time, or
dynamically via JavaScript.

👉 Note that the dark and light **icons** are set via CSS variables, see
[Style Customization](#style-customization) below.

| Name         | Required | Values                          | Default                                                                                                                                                            | Description                                                                                                                                            |
| ------------ | -------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode`       | No       | Any of `"dark"` or `"light"`    | Defaults to whatever the user's preferred color scheme is according to `prefers-color-scheme`, or `"light"` if the user's browser doesn't support the media query. | If set overrides the user's preferred color scheme.                                                                                                    |
| `appearance` | No       | Any of `"toggle"` or `"switch"` | Defaults to `"toggle"`.                                                                                                                                            | The `"switch"` appearance conveys the idea of a theme switcher (light/dark), whereas `"toggle"` conveys the idea of a dark mode toggle (on/off).       |
| `permanent`  | No       | `true` if present               | Defaults to not remember the last choice.                                                                                                                          | If present remembers the last selected mode (`"dark"` or `"light"`), which allows the user to permanently override their usual preferred color scheme. |
| `legend`     | No       | Any string                      | Defaults to no legend.                                                                                                                                             | Any string value that represents the legend for the toggle or switch.                                                                                  |
| `light`      | No       | Any string                      | Defaults to no label.                                                                                                                                              | Any string value that represents the label for the `"light"` mode.                                                                                     |
| `dark`       | No       | Any string                      | Defaults to no label.                                                                                                                                              | Any string value that represents the label for the `"dark"` mode.                                                                                      |
| `remember`   | No       | Any string                      | Defaults to no label.                                                                                                                                              | Any string value that represents the label for the "remember the last selected mode" functionality.                                                    |

## Events

- `colorschemechange`: Fired when the color scheme gets changed.
- `permanentcolorscheme`: Fired when the color scheme should be permanently
  remembered or not.

## Complete Example

Interacting with the custom element:

```js
/* On the page */
const darkModeToggle = document.querySelector('dark-mode-toggle');

// Set the mode to dark
darkModeToggle.mode = 'dark';
// Set the mode to light
darkModeToggle.mode = 'light';

// Set the legend to "Dark Mode"
darkModeToggle.legend = 'Dark Mode';
// Set the light label to "off"
darkModeToggle.light = 'off';
// Set the dark label to "on"
darkModeToggle.dark = 'on';

// Set the appearance to resemble a switch (theme: light/dark)
darkModeToggle.appearance = 'switch';
// Set the appearance to resemble a toggle (dark mode: on/off)
darkModeToggle.appearance = 'toggle';

// Set a "remember the last selected mode" label
darkModeToggle.remember = 'Remember this';

// Remember the user's last color scheme choice
darkModeToggle.setAttribute('permanent', '');
// Forget the user's last color scheme choice
darkModeToggle.removeAttribute('permanent');
```

Reacting on color scheme changes:

```js
/* On the page */
document.addEventListener('colorschemechange', (e) => {
  console.log(`Color scheme changed to ${e.detail.colorScheme}.`);
});
```

Reacting on "remember the last selected mode" functionality changes:

```js
/* On the page */
document.addEventListener('permanentcolorscheme', (e) => {
  console.log(
    `${e.detail.permanent ? 'R' : 'Not r'}emembering the last selected mode.`,
  );
});
```

## Style Customization

You can style the custom element with
[`::part()`](https://developer.mozilla.org/en-US/docs/Web/CSS/::part). See the
demo's
[CSS source code](https://github.com/GoogleChromeLabs/dark-mode-toggle/blob/master/demo/common.css)
for some concrete examples. The exposed parts and their names can be seen below:

```html
<form part="form">
  <fieldset part="fieldset">
    <legend part="legend"></legend>
    <input part="lightRadio" id="l" name="mode" type="radio" />
    <label part="lightLabel" for="l"></label>
    <input part="darkRadio" id="d" name="mode" type="radio" />
    <label part="darkLabel" for="d"></label>
    <input part="toggleCheckbox" id="t" type="checkbox" />
    <label part="toggleLabel" for="t"></label>
    <aside part="aside">
      <input part="permanentCheckbox" id="p" type="checkbox" />
      <label part="permanentLabel" for="p"></label>
    </aside>
  </fieldset>
</form>
```

Additionally, you can use a number of exposed CSS variables, as listed in the
following:

| CSS Variable Name                                 | Default                                | Description                                                                                                                                                              |
| ------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--dark-mode-toggle-light-icon`                   | No icon                                | The icon for the light state in `background-image:` notation.                                                                                                            |
| `--dark-mode-toggle-dark-icon`                    | No icon                                | The icon for the dark state in `background-image:` notation.                                                                                                             |
| `--dark-mode-toggle-icon-size`                    | 1rem                                   | The icon size in CSS length data type notation.                                                                                                                          |
| `--dark-mode-toggle-remember-icon-checked`        | No icon                                | The icon for the checked "remember the last selected mode" functionality in `background-image:` notation.                                                                |
| `--dark-mode-toggle-remember-icon-unchecked`      | No icon                                | The icon for the unchecked "remember the last selected mode" functionality in `background-image:` notation.                                                              |
| `--dark-mode-toggle-color`                        | User-Agent stylesheet text color       | The main text color in `color:` notation.                                                                                                                                |
| `--dark-mode-toggle-background-color`             | User-Agent stylesheet background color | The main background color in `background-color:` notation.                                                                                                               |
| `--dark-mode-toggle-legend-font`                  | User-Agent `<legend>` font             | The font of the legend in shorthand `font:` notation.                                                                                                                    |
| `--dark-mode-toggle-label-font`                   | User-Agent `<label>` font              | The font of the labels in shorthand `font:` notation.                                                                                                                    |
| `--dark-mode-toggle-remember-font`                | User-Agent `<label>` font              | The font of the "remember the last selected mode" functionality label in shorthand `font:` notation.                                                                     |
| `--dark-mode-toggle-icon-filter`                  | No filter                              | The filter for the dark icon (so you can use all black or all white icons and just invert one of them) in `filter:` notation.                                            |
| `--dark-mode-toggle-remember-filter`              | No filter                              | The filter for the "remember the last selected mode" functionality icon (so you can use all black or all white icons and just invert one of them) in `filter:` notation. |
| `--dark-mode-toggle-active-mode-background-color` | No background color                    | The background color for the currently active mode in `background-color:` notation.                                                                                      |

## Hacking on `<dark-mode-toggle>`

The core custom element code lives in
[`src/dark-mode-toggle.mjs`](https://github.com/GoogleChromeLabs/dark-mode-toggle/blob/master/src/dark-mode-toggle.mjs).
You can start hacking and testing your changes by running `npm run start` and
then navigating to <http://localhost:8080/demo/>. No build step required 🎉,
this happens automatically upon `npm publish`ing. If for whatever reason you
want to build locally, run `npm run build`. You can lint by running
`npm run lint`.

The HTML and the CSS used by `<dark-mode-toggle>` is hard-coded as a template
literal in the file `src/dark-mode-toggle.mjs`. For optimal performance, the
contents of this literal are hand-minified. If you need to tweak the HTML or the
CSS, find the unminified template literal contents in
`src/template-contents.tpl` and copy them over to `src/dark-mode-toggle.mjs`.
Once your changes are done, commit them to both the `*.tpl` file (in unminified
form) and the `*.mjs` file (in minified form).

(This is actually just making a strong argument for
[CSS Modules](https://github.com/w3c/webcomponents/issues/759) and
[HTML Modules](https://github.com/w3c/webcomponents/issues/645) that would allow
for proper tools integration).

## Proudly used on…

- [**v8.dev**](https://v8.dev/): V8 is Google’s open source high-performance
  JavaScript and WebAssembly engine, written in C++.

  ![v8.dev in light mode](https://user-images.githubusercontent.com/145676/66128744-c913b580-e5ee-11e9-8c44-e2ca1d24dacb.png)

  ![v8.dev in dark mode](https://user-images.githubusercontent.com/145676/66128803-ea74a180-e5ee-11e9-8792-c411a54346fc.png)

- Your site here…

## Notes

This is not an official Google product.

## Acknowledgements

Thanks to all
[contributors](https://github.com/GoogleChromeLabs/dark-mode-toggle/graphs/contributors)
for making `<dark-mode-toggle>` even better! Usage video by
[Tomek Sułkowski](https://twitter.com/sulco).

## License

Copyright 2019 Google LLC

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.



================================================
FILE: CODE_OF_CONDUCT.md
================================================
# Code of Conduct

All Google open source projects are covered by our
[community guidelines](https://opensource.google/conduct/) which define the kind
of respectful behavior we expect of all participants.



================================================
FILE: CONTRIBUTING.md
================================================
# How to Contribute

We'd love to accept your patches and contributions to this project. There are
just a few small guidelines you need to follow.

## Contributor License Agreement

Contributions to this project must be accompanied by a Contributor License
Agreement. You (or your employer) retain the copyright to your contribution;
this simply gives us permission to use and redistribute your contributions as
part of the project. Head over to <https://cla.developers.google.com/> to see
your current agreements on file or to sign a new one.

You generally only need to submit a CLA once, so if you've already submitted one
(even if it was for a different project), you probably don't need to do it
again.

## Code reviews

All submissions, including submissions by project members, require review. We
use GitHub pull requests for this purpose. Consult
[GitHub Help](https://help.github.com/articles/about-pull-requests/) for more
information on using pull requests.

## Community Guidelines

This project follows
[Google's Open Source Community Guidelines](https://opensource.google.com/conduct/).



================================================
FILE: eslint.config.js
================================================
// eslint.config.js
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 8,
      sourceType: 'module',
    },
    rules: {
      'require-jsdoc': 'off',
      'max-len': [
        'error',
        {
          ignoreTemplateLiterals: true,
        },
      ],
    },
  },
];



================================================
FILE: LICENSE
================================================
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.



================================================
FILE: package.json
================================================
{
  "name": "dark-mode-toggle",
  "version": "0.17.0",
  "description": "Web Component that toggles dark mode 🌒",
  "main": "./dist/dark-mode-toggle.min.mjs",
  "module": "./dist/dark-mode-toggle.min.mjs",
  "unpkg": "./dist/dark-mode-toggle.min.mjs",
  "exports": {
    ".": {
      "types": "./src/dark-mode-toggle.d.ts",
      "module": "./dist/dark-mode-toggle.min.mjs",
      "import": "./dist/dark-mode-toggle.min.mjs",
      "browser": "./dist/dark-mode-toggle.min.mjs"
    }
  },
  "files": [
    "src",
    "dist"
  ],
  "scripts": {
    "start": "npx http-server && echo \"Server running on http://localhost:8080/demo/\"",
    "clean": "shx rm -rf ./dist && mkdir dist",
    "lint:js": "npx eslint \"./src/*.mjs\" --fix && npx eslint \"./demo/*.mjs\" --fix",
    "lint:css": "shx cp ./src/template-contents.tpl ./src/template-contents.html && npx stylelint \"./src/*.html\" --fix && shx cp ./src/template-contents.html ./src/template-contents.tpl && shx rm ./src/template-contents.html && npx stylelint \"./demo/*.css\" --fix",
    "lint": "npm run lint:js && npm run lint:css",
    "fix": "npx prettier --write .",
    "build": "npm run clean && npx terser ./src/dark-mode-toggle.mjs --toplevel --mangle-props regex=\\\"^_\\\" --comments /@license/ --ecma=8 -o ./dist/dark-mode-toggle.min.mjs && npx terser ./src/dark-mode-toggle-stylesheets-loader.js --toplevel --mangle-props regex=\\\"^_\\\" --comments /@license/ --ecma=8 -o ./dist/dark-mode-toggle-stylesheets-loader.min.js",
    "prepare": "npm run lint && npm run fix && npm run build"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/googlechromelabs/dark-mode-toggle.git"
  },
  "keywords": [
    "dark",
    "mode"
  ],
  "author": "Thomas Steiner <steiner.thomas@gmail.com> (https://blog.tomayac.com/)",
  "license": "Apache-2.0",
  "bugs": {
    "url": "https://github.com/googlechromelabs/dark-mode-toggle/issues"
  },
  "homepage": "https://github.com/googlechromelabs/dark-mode-toggle#readme",
  "devDependencies": {
    "eslint": "^9.26.0",
    "eslint-config-google": "^0.14.0",
    "http-server": "^14.1.1",
    "postcss-html": "^1.8.0",
    "prettier": "^3.5.3",
    "shx": "^0.4.0",
    "stylelint": "^16.19.1",
    "stylelint-config-standard": "^38.0.0",
    "terser": "^5.39.0"
  },
  "stylelint": {
    "extends": "stylelint-config-standard",
    "rules": {
      "selector-type-no-unknown": [
        true,
        {
          "ignore": [
            "custom-elements"
          ]
        }
      ],
      "property-no-unknown": [
        true,
        {
          "ignoreProperties": []
        }
      ]
    },
    "overrides": [
      {
        "files": [
          "*.html",
          "**/*.html"
        ],
        "customSyntax": "postcss-html"
      }
    ]
  }
}



================================================
FILE: .prettierrc
================================================
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "embeddedLanguageFormatting": "auto",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxSingleQuote": false,
  "printWidth": 80,
  "proseWrap": "always",
  "quoteProps": "consistent",
  "requirePragma": false,
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false,
  "vueIndentScriptAndStyle": false
}



================================================
FILE: demo/common.css
================================================
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
:root {
  --heading-color: red;
  --duration: 0.5s;
  --timing: ease;
}

*,
::before,
::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  transition:
    color var(--duration) var(--timing),
    background-color var(--duration) var(--timing);
  font-family: sans-serif;
  font-size: 12pt;
  background-color: var(--background-color);
  color: var(--text-color);
  display: flex;
  justify-content: center;
}

main {
  margin: 1rem;
  max-width: 30rem;
  position: relative;
}

h1 {
  color: var(--heading-color);
  text-shadow: 0.1rem 0.1rem 0.1rem var(--shadow-color);
  transition: text-shadow var(--duration) var(--timing);
}

img {
  max-width: 100%;
  height: auto;
  transition: filter var(--duration) var(--timing);
}

p {
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

fieldset {
  border: solid 0.1rem;
  box-shadow: 0.1rem 0.1rem 0.1rem var(--shadow-color);
  transition: box-shadow var(--duration) var(--timing);
}

div {
  padding: 0.5rem;
}

aside {
  position: absolute;
  right: 0;
  padding: 0.5rem;
}

aside:nth-of-type(1) {
  top: 0;
}

aside:nth-of-type(2) {
  top: 3rem;
}

aside:nth-of-type(3) {
  top: 7rem;
}

aside:nth-of-type(4) {
  top: 12rem;
}

aside:nth-of-type(5) {
  width: 10rem;
  top: 16rem;
}

aside:nth-of-type(6) {
  width: 20rem;
  top: 0;
  left: 0 !important;
}

#content select,
#content button,
#content input[type='text'],
#content input[type='search'] {
  width: 15rem;
}

dark-mode-toggle {
  --dark-mode-toggle-remember-icon-checked: url('checked.svg');
  --dark-mode-toggle-remember-icon-unchecked: url('unchecked.svg');
  --dark-mode-toggle-remember-font: 0.75rem 'Helvetica';
  --dark-mode-toggle-legend-font: bold 0.85rem 'Helvetica';
  --dark-mode-toggle-label-font: 0.85rem 'Helvetica';
  --dark-mode-toggle-color: var(--text-color);
  --dark-mode-toggle-background-color: none;

  margin-bottom: 1.5rem;
}

#dark-mode-toggle-1 {
  --dark-mode-toggle-dark-icon: url('sun.png');
  --dark-mode-toggle-light-icon: url('moon.png');
}

#dark-mode-toggle-2 {
  --dark-mode-toggle-dark-icon: url('sun.svg');
  --dark-mode-toggle-light-icon: url('moon.svg');
  --dark-mode-toggle-icon-size: 2rem;
  --dark-mode-toggle-icon-filter: invert(100%);
}

#dark-mode-toggle-3,
#dark-mode-toggle-4 {
  --dark-mode-toggle-dark-icon: url('moon.png');
  --dark-mode-toggle-light-icon: url('sun.png');
}

#dark-mode-toggle-3 {
  --dark-mode-toggle-remember-filter: invert(100%);
}

#dark-mode-toggle-4 {
  --dark-mode-toggle-active-mode-background-color: var(--accent-color);
  --dark-mode-toggle-remember-filter: invert(100%);
}

#dark-mode-toggle-6 {
  --dark-mode-toggle-active-mode-background-color: var(--accent-color);
  --dark-mode-toggle-remember-filter: invert(100%);
}



================================================
FILE: demo/dark-mode-toggle-playground.mjs
================================================
/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

((doc) => {
  const themeColor = doc.querySelector('meta[name="theme-color"]');
  const icon = doc.querySelector('link[rel="icon"]');
  const colorScheme = doc.querySelector('meta[name="color-scheme"]');
  const body = doc.body;

  doc.addEventListener('colorschemechange', (e) => {
    // The event fires right before the color scheme goes into effect,
    // so we need the `color` value.
    themeColor.content = getComputedStyle(body).color;
    colorScheme.content = e.detail.colorScheme;
    icon.href = e.detail.colorScheme === 'dark' ? 'moon.png' : 'sun.png';
    console.log(
      `${e.target.id} changed the color scheme to ${e.detail.colorScheme}`,
    );
  });

  doc.addEventListener('permanentcolorscheme', (e) => {
    const permanent = e.detail.permanent;
    console.log(
      `${permanent ? 'R' : 'Not r'}emembering the last selected mode.`,
    );
  });
})(document);



================================================
FILE: demo/dark.css
================================================
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
:root {
  color-scheme: dark; /* stylelint-disable-line property-no-unknown */

  --background-color: rgb(15 15 15);
  --text-color: rgb(240 240 240);
  --shadow-color: rgb(240 240 240 / 50%);
  --accent-color: rgb(0 0 240 / 50%);
}

img {
  filter: grayscale(50%);
}

.icon {
  filter: invert(100%);
}

a {
  color: yellow;
}



================================================
FILE: demo/dist.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <title>Hello Dark Mode</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="" />
    <link rel="icon" content="" />
    <script>
      // If `prefers-color-scheme` is not supported, fall back to light mode.
      // In this case, light.css will be downloaded with `highest` priority.
      if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
        document.documentElement.style.display = 'none';
        document.head.insertAdjacentHTML(
          'beforeend',
          '<link rel="stylesheet" href="light.css" onload="document.documentElement.style.display = ``">',
        );
      }
    </script>
    <link
      rel="stylesheet"
      href="dark.css"
      media="(prefers-color-scheme: dark)"
    />
    <link
      rel="stylesheet"
      href="light.css"
      media="(prefers-color-scheme: light)"
    />
    <link rel="stylesheet" href="common.css" />
    <script type="module" src="dark-mode-toggle-playground.mjs"></script>
    <script type="module" src="../dist/dark-mode-toggle.min.mjs"></script>
  </head>
  <body>
    <main>
      <h1>Hi there!</h1>
      <img
        src="cat.jpg"
        alt="Sitting cat in front of a tree"
        width="640"
        height="390"
      />
      <p>
        Lorem ipsum dolor sit amet, legere ancillae ne vis. Ne vim laudem
        accusam consectetuer, eu utinam integre abhorreant sea. Quo eius veri
        ei, nibh invenire democritum vel in, utamur vulputate id est. Possit
        ceteros vis an.
      </p>
      <form id="content">
        <fieldset>
          <legend>Lorem ipsum</legend>
          <div>
            <select>
              <option>Lorem</option>
              <option>Ipsum</option>
            </select>
          </div>
          <div>
            <button type="button">Lorem</button>
          </div>
          <div>
            <label>
              <input type="text" value="Lorem ipsum" />
              Lorem ipsum
            </label>
          </div>
          <div>
            <label>
              <input type="search" value="Lorem ipsum" />
              Lorem ipsum
            </label>
          </div>
          <div>
            <label><input checked type="checkbox" /> Lorem</label>
            <label><input type="checkbox" /> Ipsum</label>
          </div>
          <div>
            <label><input checked name="foo" type="radio" /> Lorem</label>
            <label><input name="foo" type="radio" /> Ipsum</label>
          </div>
        </fieldset>
      </form>
      <p>
        Also see the <a href="unstyled.html">unstyled variant</a>
        that shows the out-of-the-box experience.
      </p>
    </main>
    <aside>
      <dark-mode-toggle id="dark-mode-toggle-1"></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle id="dark-mode-toggle-2"></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle
        id="dark-mode-toggle-3"
        legend="Dark Mode"
        light="off"
        dark="on"
        remember="always"
      ></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle
        id="dark-mode-toggle-4"
        legend="Theme Switcher"
        light="Light"
        dark="Dark"
        remember="Remember this"
        appearance="switch"
      ></dark-mode-toggle>
    </aside>
  </body>
</html>



================================================
FILE: demo/index.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <title>Hello Dark Mode</title>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="" />
    <link rel="icon" content="" />
    <script>
      // If `prefers-color-scheme` is not supported, fall back to light mode.
      // In this case, light.css will be downloaded with `highest` priority.
      if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
        document.documentElement.style.display = 'none';
        document.head.insertAdjacentHTML(
          'beforeend',
          '<link rel="stylesheet" href="light.css" onload="document.documentElement.style.display = ``">',
        );
      }
    </script>
    <link
      rel="stylesheet"
      href="dark.css"
      media="(prefers-color-scheme: dark)"
    />
    <link
      rel="stylesheet"
      href="light.css"
      media="(prefers-color-scheme: light)"
    />
    <link rel="stylesheet" href="common.css" />
    <link rel="stylesheet" href="slider.css" />
    <script type="module" src="dark-mode-toggle-playground.mjs"></script>
    <script type="module" src="../src/dark-mode-toggle.mjs"></script>
  </head>
  <body>
    <main>
      <h1>Hi there!</h1>
      <img
        src="cat.jpg"
        alt="Sitting cat in front of a tree"
        width="640"
        height="390"
      />
      <p>
        Lorem ipsum dolor sit amet, legere ancillae ne vis. Ne vim laudem
        accusam consectetuer, eu utinam integre abhorreant sea. Quo eius veri
        ei, nibh invenire democritum vel in, utamur vulputate id est. Possit
        ceteros vis an.
      </p>
      <form id="content">
        <fieldset>
          <legend>Lorem ipsum</legend>
          <div>
            <select>
              <option>Lorem</option>
              <option>Ipsum</option>
            </select>
          </div>
          <div>
            <button type="button">Lorem</button>
          </div>
          <div>
            <label>
              <input type="text" value="Lorem ipsum" />
              Lorem ipsum
            </label>
          </div>
          <div>
            <label>
              <input type="search" value="Lorem ipsum" />
              Lorem ipsum
            </label>
          </div>
          <div>
            <label><input checked type="checkbox" /> Lorem</label>
            <label><input type="checkbox" /> Ipsum</label>
          </div>
          <div>
            <label><input checked name="foo" type="radio" /> Lorem</label>
            <label><input name="foo" type="radio" /> Ipsum</label>
          </div>
        </fieldset>
      </form>
      <p>
        Also see the <a href="unstyled.html">unstyled variant</a>
        that shows the out-of-the-box experience.
      </p>
      <p>
        Run <code>npm run build</code> and see the
        <a href="dist.html">built variant</a> that uses the minified version of
        the script in the <code>dist</code> folder.
      </p>
      <p>
        Per default, the custom element is optimized for loading speed.
        Depending on your page, this can introduce flashing (<a
          href="with-flashing.html"
          >example with flashing</a
        >). At the expense of loading speed using
        <code>document.write()</code> and following the
        <a
          href="https://github.com/GoogleChromeLabs/dark-mode-toggle?tab=readme-ov-file#-using-different-stylesheets-per-color-scheme-that-are-conditionally-loaded"
          >instructions in the README</a
        >, you can prevent this (<a href="without-flashing.html"
          >example without flashing</a
        >).
      </p>
      <p>
        You can also check out the
        <a href="internal-stylesheets.html">demo with internal stylesheets</a>.
      </p>
    </main>
    <aside>
      <dark-mode-toggle id="dark-mode-toggle-1"></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle id="dark-mode-toggle-2"></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle
        id="dark-mode-toggle-3"
        legend="Dark Mode"
        light="off"
        dark="on"
        remember="always"
      ></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle
        id="dark-mode-toggle-4"
        legend="Theme Switcher"
        light="Light"
        dark="Dark"
        remember="Remember this"
        appearance="switch"
      ></dark-mode-toggle>
    </aside>
    <aside>
      <p>
        You can also style the toggle into a slider appearance like below,
        checkout the <code>slider.css</code> file.
      </p>
      <p>
        Unfortunately this slider toggle will not work with custom CSS
        properties such as <code>--dark-mode-toggle-icon-size</code> etc.
        properly. You must replace these values manually in
        <code>slider.css</code> due to the fact that pseudo elements cannot
        inherit the defined values.
      </p>
      <dark-mode-toggle
        id="dark-mode-toggle-5"
        class="slider"
        legend="Dark Slider"
        remember="Remember this"
        appearance="toggle"
      ></dark-mode-toggle>
    </aside>
    <aside>
      <dark-mode-toggle
        id="dark-mode-toggle-6"
        legend="3-way Theme Switcher"
        light="Light"
        system="System"
        dark="Dark"
        appearance="three-way"
      ></dark-mode-toggle>
    </aside>
  </body>
</html>



================================================
FILE: demo/internal-stylesheets.html
================================================
<!doctype html>
<html>
  <head>
    <style media="(prefers-color-scheme: light)">
      :root {
        --background-color: #fff;
        --text-color: #000;
      }
    </style>
    <style media="(prefers-color-scheme: dark)">
      :root {
        --background-color: #000;
        --text-color: #fff;
      }
    </style>
    <style>
      body {
        background-color: var(--background-color);
        color: var(--text-color);
      }
    </style>
    <script type="module" src="../src/dark-mode-toggle.mjs"></script>
  </head>
  <body>
    <h1>Demo with internal stylesheets</h1>
    <p>
      Lorem ipsum dolor sit amet, legere ancillae ne vis. Ne vim laudem accusam
      consectetuer, eu utinam integre abhorreant sea. Quo eius veri ei, nibh
      invenire democritum vel in, utamur vulputate id est. Possit ceteros vis
      an.
    </p>
    <div>
      Switch theme:
      <dark-mode-toggle permanent></dark-mode-toggle>
    </div>
  </body>
</html>



================================================
FILE: demo/light.css
================================================
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
:root {
  color-scheme: light; /* stylelint-disable-line property-no-unknown */

  --background-color: rgb(240 240 240);
  --text-color: rgb(15 15 15);
  --shadow-color: rgb(15 15 15 / 50%);
  --accent-color: rgb(240 0 0 / 50%);
}



================================================
FILE: demo/slider.css
================================================
dark-mode-toggle.slider::part(toggleLabel) {
  display: inline-block;
  position: relative;
  height: calc(var(--dark-mode-toggle-icon-size, 1rem) * 2);
  width: calc(var(--dark-mode-toggle-icon-size, 1rem) * 3.5);
  background-color: #b7bbbd;
  border-radius: var(--dark-mode-toggle-icon-size, 1rem);
  transition: 0.4s;
}

dark-mode-toggle.slider[mode='dark']::part(toggleLabel) {
  background-color: #4e5255;
}

dark-mode-toggle.slider::part(toggleLabel)::before {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: calc(var(--dark-mode-toggle-icon-size, 1rem) * 0.25);
  left: calc(var(--dark-mode-toggle-icon-size, 1rem) * 0.25);
  height: calc(var(--dark-mode-toggle-icon-size, 1rem) * 1.5);
  width: calc(var(--dark-mode-toggle-icon-size, 1rem) * 1.5);
  border-radius: 100%;
  box-shadow:
    0 0.15em 0.3em rgb(0 0 0 / 15%),
    0 0.2em 0.5em rgb(0 0 0 / 30%);
  background-color: #fff;
  color: #333;
  transition: 0.4s;
  content: '';
  background-position: center;
  background-size: var(--dark-mode-toggle-icon-size, 1rem);
  background-image: var(--dark-mode-toggle-light-icon, url('sun.svg'));
  box-sizing: border-box;
}

dark-mode-toggle.slider[mode='dark']::part(toggleLabel)::before {
  left: calc(100% - var(--dark-mode-toggle-icon-size, 1rem) * 1.75);
  border-color: #000;
  background-color: #ccc;
  color: #000;
  background-size: var(--dark-mode-toggle-icon-size, 1rem);
  background-image: var(--dark-mode-toggle-dark-icon, url('moon.svg'));
  filter: var(--dark-mode-toggle-icon-filter, invert(100%));
  box-shadow: 0 0.5px hsl(0deg 0% 100% / 16%);
}

dark-mode-toggle.slider::part(toggleLabel)::after {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: calc(var(--dark-mode-toggle-icon-size, 1rem) * 0.25);
  left: calc(100% - var(--dark-mode-toggle-icon-size, 1rem) * 1.75);
  height: calc(var(--dark-mode-toggle-icon-size, 1rem) * 1.5);
  width: calc(var(--dark-mode-toggle-icon-size, 1rem) * 1.5);
  border-radius: 100%;
  color: #333;
  content: '';
  background-position: center;
  background-size: var(--dark-mode-toggle-icon-size, 1rem);
  background-image: var(--dark-mode-toggle-dark-icon, url('moon.svg'));
  background-repeat: no-repeat;
  box-sizing: border-box;
  opacity: 0.5;
}

dark-mode-toggle.slider[mode='dark']::part(toggleLabel)::after {
  left: calc(var(--dark-mode-toggle-icon-size, 1rem) * 0.25);
  background-image: var(--dark-mode-toggle-light-icon, url('sun.svg'));
  filter: var(--dark-mode-toggle-icon-filter, invert(100%));
}



================================================
FILE: demo/unstyled.html
================================================
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="module" src="../src/dark-mode-toggle.mjs"></script>
    <style>
      body {
        font-family: sans-serif;
      }
      .dark {
        color: #fff;
        background-color: #000;
      }
    </style>
  </head>
  <body>
    <h1>Unstyled out-of-the-box experience</h1>
    <aside>
      <code>&lt;dark-mode-toggle&gt;&lt;/dark-mode-toggle&gt;</code>
      <dark-mode-toggle></dark-mode-toggle>
      <code
        >&lt;dark-mode-toggle
        appearance="switch"&gt;&lt;/dark-mode-toggle&gt;</code
      >
      <dark-mode-toggle appearance="switch"></dark-mode-toggle>
      <code
        >&lt;dark-mode-toggle permanent
        remember="Remember"&gt;&lt;/dark-mode-toggle&gt;</code
      >
      <dark-mode-toggle permanent remember="Remember"></dark-mode-toggle>
      <code
        >&lt;dark-mode-toggle appearance="switch" permanent
        remember="Remember"&gt;&lt;/dark-mode-toggle&gt;</code
      >
      <dark-mode-toggle
        appearance="switch"
        permanent
        remember="Remember"
      ></dark-mode-toggle>
      <code
        >&lt;dark-mode-toggle
        appearance="three-way"&gt;&lt;/dark-mode-toggle&gt;</code
      >
      <dark-mode-toggle appearance="three-way"></dark-mode-toggle>
    </aside>
    <script>
      window.addEventListener('colorschemechange', (e) => {
        document.body.classList.toggle('dark', e.target.mode === 'dark');
      });
    </script>
  </body>
</html>



================================================
FILE: demo/with-flashing.html
================================================
<!doctype html>
<html>
  <head>
    <link
      rel="stylesheet"
      href="light.css"
      media="(prefers-color-scheme: light)"
    />
    <link
      rel="stylesheet"
      href="dark.css"
      media="(prefers-color-scheme: dark)"
    />
  </head>
  <body>
    <h1>Demo with flashing</h1>

    <div>Refresh to test: <a href="with-flashing.html">Refresh</a></div>

    <div>
      Go to the version <a href="without-flashing.html">without flashing</a>
    </div>

    <div>
      Switch theme:
      <dark-mode-toggle permanent></dark-mode-toggle>
    </div>

    <script type="module" src="../src/dark-mode-toggle.mjs"></script>
    <script>
      // Load uncached script to simulate a slow loading.
      const rand = Math.random();
      document.write('<script src="1-mb.js?r=' + rand + '"><\/script>');
    </script>
  </body>
</html>



================================================
FILE: demo/without-flashing.html
================================================
<!doctype html>
<html>
  <head>
    <noscript id="dark-mode-toggle-stylesheets">
      <link
        rel="stylesheet"
        href="light.css"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="stylesheet"
        href="dark.css"
        media="(prefers-color-scheme: dark)"
      />
      <meta name="color-scheme" content="dark light" />
    </noscript>
    <script src="../src/dark-mode-toggle-stylesheets-loader.js"></script>
  </head>
  <body>
    <h1>Demo without flashing</h1>
    <div>Refresh to test: <a href="without-flashing.html">Refresh</a></div>
    <div>Go to the version <a href="with-flashing.html">with flashing</a></div>
    <div>
      Switch theme:
      <dark-mode-toggle permanent></dark-mode-toggle>
    </div>
    <script type="module" src="../src/dark-mode-toggle.mjs"></script>
    <script>
      // Load uncached script to simulate a slow loading.
      const rand = Math.random();
      document.write('<script src="1-mb.js?r=' + rand + '"><\/script>');
    </script>
  </body>
</html>



================================================
FILE: src/dark-mode-toggle-stylesheets-loader.js
================================================
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2024 Google LLC. Licensed under the Apache License, Version 2.0.
/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2024 Google LLC. Licensed under the Apache License, Version 2.0.
(() => {
  const ELEMENT_ID = 'dark-mode-toggle-stylesheets';
  const STORAGE_NAME = 'dark-mode-toggle';
  const LIGHT = 'light';
  const DARK = 'dark';

  let stylesheetsAndMetatag = document.getElementById(ELEMENT_ID).textContent;

  let mode = null;
  try {
    mode = localStorage.getItem(STORAGE_NAME);
  } catch (e) {
    return;
  }

  const lightCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*light\s*\)/gi;
  const darkCSSMediaRegex = /\(\s*prefers-color-scheme\s*:\s*dark\s*\)/gi;
  const darkLightRegex = /\b(?:dark\s+light|light\s+dark)\b/;

  switch (mode) {
    case LIGHT:
      stylesheetsAndMetatag = stylesheetsAndMetatag
        .replace(lightCSSMediaRegex, '$&, all')
        .replace(darkCSSMediaRegex, '$& and not all')
        .replace(darkLightRegex, mode);
      break;

    case DARK:
      stylesheetsAndMetatag = stylesheetsAndMetatag
        .replace(darkCSSMediaRegex, '$&, all')
        .replace(lightCSSMediaRegex, '$& and not all')
        .replace(darkLightRegex, mode);
      break;
  }

  document.write(stylesheetsAndMetatag);
})();



================================================
FILE: src/dark-mode-toggle.d.ts
================================================
/**
 * Reflects the user’s desire that the page use a light or dark color theme.
 */
export type ColorScheme = 'light' | 'dark';

export class DarkModeToggle extends HTMLElement {
  /**
   * The user's preferred color scheme.
   */
  mode: ColorScheme;

  /**
   * The "switch" appearance conveys the idea of a theme switcher (light/dark),
   * whereas "toggle" conveys the idea of a dark mode toggle (on/off).
   * The "three-way" option will feature a central state that aligns with the user's system preferred color mode, while both the left and right states will consistently apply a fixed color scheme, irrespective of the system settings.
   */
  appearance: 'toggle' | 'switch' | 'three-way';

  /**
   * If true, remember the last selected mode ("dark" or "light"),
   * which allows the user to permanently override their usual preferred color scheme.
   */
  permanent: boolean;

  /**
   * Any string value that represents the legend for the toggle or switch.
   */
  legend: string;

  /**
   * Any string value that represents the label for the "light" mode.
   */
  light: string;

  /**
   * Any string value that represents the label for the "dark" mode.
   */
  dark: string;

  /**
   * Any string value that represents the label for the
   * "remember the last selected mode" functionality.
   */
  remember: string;
}

/**
 * Fired when the color scheme gets changed.
 */
export type ColorSchemeChangeEvent = CustomEvent<{ colorScheme: ColorScheme }>;

/**
 * Fired when the color scheme should be permanently remembered or not.
 */
export type PermanentColorSchemeEvent = CustomEvent<{ permanent: boolean }>;

declare global {
  interface HTMLElementTagNameMap {
    'dark-mode-toggle': DarkModeToggle;
  }

  interface GlobalEventHandlersEventMap {
    colorschemechange: ColorSchemeChangeEvent;
    permanentcolorscheme: PermanentColorSchemeEvent;
  }
}



================================================
FILE: src/dark-mode-toggle.mjs
================================================
/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// @license © 2019 Google LLC. Licensed under the Apache License, Version 2.0.
const doc = document;
let store = {};
try {
  store = localStorage;
} catch (err) {
  // Do nothing. The user probably blocks cookies.
}
const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
const MEDIA = 'media';
const LIGHT = 'light';
const DARK = 'dark';
const SYSTEM = 'system';
const MQ_DARK = `(${PREFERS_COLOR_SCHEME}:${DARK})`;
const MQ_LIGHT = `(${PREFERS_COLOR_SCHEME}:${LIGHT})`;
const LINK_REL_STYLESHEET = 'link[rel=stylesheet]';
const STYLE = 'style';
const REMEMBER = 'remember';
const LEGEND = 'legend';
const TOGGLE = 'toggle';
const SWITCH = 'switch';
const THREE_WAY = 'three-way';
const APPEARANCE = 'appearance';
const PERMANENT = 'permanent';
const MODE = 'mode';
const COLOR_SCHEME_CHANGE = 'colorschemechange';
const PERMANENT_COLOR_SCHEME = 'permanentcolorscheme';
const ALL = 'all';
const NOT_ALL = 'not all';
const NAME = 'dark-mode-toggle';
const DEFAULT_URL = 'https://googlechromelabs.github.io/dark-mode-toggle/demo/';

// See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html ↵
// #reflecting-content-attributes-in-idl-attributes.
const installStringReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      const value = this.getAttribute(attrName);
      return value === null ? '' : value;
    },
    set(v) {
      this.setAttribute(attrName, v);
    },
  });
};

const installBoolReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      return this.hasAttribute(attrName);
    },
    set(v) {
      if (v) {
        this.setAttribute(attrName, '');
      } else {
        this.removeAttribute(attrName);
      }
    },
  });
};

const template = doc.createElement('template');
// ⚠️ Note: this is a minified version of `src/template-contents.tpl`.
// Compress the CSS with https://cssminifier.com/, then paste it here.

template.innerHTML = `<style>*,::after,::before{box-sizing:border-box}:host{contain:content;display:block}:host([hidden]){display:none}form{background-color:var(--${NAME}-background-color,transparent);color:var(--${NAME}-color,inherit);padding:0}fieldset{border:none;margin:0;padding-block:.25rem;padding-inline:.25rem}legend{font:var(--${NAME}-legend-font,inherit);padding:0}input,label{cursor:pointer}label{white-space:nowrap}input{opacity:0;position:absolute;pointer-events:none}input:focus-visible+label{outline:#e59700 auto 2px;outline:-webkit-focus-ring-color auto 5px}label::before{content:"";display:inline-block;background-size:var(--${NAME}-icon-size,1rem);background-repeat:no-repeat;height:var(--${NAME}-icon-size,1rem);width:var(--${NAME}-icon-size,1rem);vertical-align:middle}label:not(:empty)::before{margin-inline-end:.5rem}[part=lightLabel]::before,[part=lightThreeWayLabel]::before{background-image:var(--${NAME}-light-icon, url("${DEFAULT_URL}sun.png"))}[part=darkLabel]::before,[part=darkThreeWayLabel]::before{filter:var(--${NAME}-icon-filter, none);background-image:var(--${NAME}-dark-icon, url("${DEFAULT_URL}moon.png"))}[part=systemThreeWayLabel]::before{background-image:var(--${NAME}-system-icon, url("${DEFAULT_URL}system.png"))}[part=toggleLabel]::before{background-image:var(--${NAME}-checkbox-icon,none)}[part=permanentLabel]::before{background-image:var(--${NAME}-remember-icon-unchecked, url("${DEFAULT_URL}unchecked.svg"))}[part$=ThreeWayLabel],[part=darkLabel],[part=lightLabel],[part=toggleLabel]{font:var(--${NAME}-label-font,inherit)}[part$=ThreeWayLabel]:empty,[part=darkLabel]:empty,[part=lightLabel]:empty,[part=toggleLabel]:empty{font-size:0;padding:0}[part=permanentLabel]{font:var(--${NAME}-remember-font,inherit)}input:checked+[part=permanentLabel]::before{background-image:var(--${NAME}-remember-icon-checked, url("${DEFAULT_URL}checked.svg"))}input:checked+[part$=ThreeWayLabel],input:checked+[part=darkLabel],input:checked+[part=lightLabel]{background-color:var(--${NAME}-active-mode-background-color,transparent)}input:checked+[part$=ThreeWayLabel]::before,input:checked+[part=darkLabel]::before,input:checked+[part=lightLabel]::before{background-color:var(--${NAME}-active-mode-background-color,transparent)}input:checked+[part=toggleLabel]::before,input[part=toggleCheckbox]:checked~[part=threeWayRadioWrapper] [part$=ThreeWayLabel]::before{filter:var(--${NAME}-icon-filter, none)}input:checked+[part=toggleLabel]~aside [part=permanentLabel]::before{filter:var(--${NAME}-remember-filter, invert(100%))}aside{visibility:hidden;margin-block-start:.15rem}[part=darkLabel]:focus-visible~aside,[part=lightLabel]:focus-visible~aside,[part=toggleLabel]:focus-visible~aside{visibility:visible;transition:visibility 0s}aside [part=permanentLabel]:empty{display:none}@media (hover:hover){aside{transition:visibility 3s}aside:hover{visibility:visible}[part=darkLabel]:hover~aside,[part=lightLabel]:hover~aside,[part=toggleLabel]:hover~aside{visibility:visible;transition:visibility 0s}}</style><form part=form><fieldset part=fieldset><legend part=legend></legend><input id=l part=lightRadio type=radio name=mode> <label for=l part=lightLabel></label> <input id=d part=darkRadio type=radio name=mode> <label for=d part=darkLabel></label> <input id=t part=toggleCheckbox type=checkbox> <label for=t part=toggleLabel></label> <span part=threeWayRadioWrapper><input id=3l part=lightThreeWayRadio type=radio name=three-way-mode> <label for=3l part=lightThreeWayLabel></label> <input id=3s part=systemThreeWayRadio type=radio name=three-way-mode> <label for=3s part=systemThreeWayLabel></label> <input id=3d part=darkThreeWayRadio type=radio name=three-way-mode> <label for=3d part=darkThreeWayLabel></label></span><aside part=aside><input id=p part=permanentCheckbox type=checkbox> <label for=p part=permanentLabel></label></aside></fieldset></form>`;

export class DarkModeToggle extends HTMLElement {
  static get observedAttributes() {
    return [MODE, APPEARANCE, PERMANENT, LEGEND, LIGHT, DARK, REMEMBER];
  }

  constructor() {
    super();

    installStringReflection(this, MODE);
    installStringReflection(this, APPEARANCE);
    installStringReflection(this, LEGEND);
    installStringReflection(this, LIGHT);
    installStringReflection(this, DARK);
    installStringReflection(this, SYSTEM);
    installStringReflection(this, REMEMBER);

    installBoolReflection(this, PERMANENT);

    this._darkCSS = null;
    this._lightCSS = null;

    doc.addEventListener(COLOR_SCHEME_CHANGE, (event) => {
      this.mode = event.detail.colorScheme;
      this._updateRadios();
      this._updateCheckbox();
      this._updateThreeWayRadios();
    });

    doc.addEventListener(PERMANENT_COLOR_SCHEME, (event) => {
      this.permanent = event.detail.permanent;
      this._permanentCheckbox.checked = this.permanent;
      this._updateThreeWayRadios();
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.append(template.content.cloneNode(true));

    // We need to support `media="(prefers-color-scheme: dark)"` (with space)
    // and `media="(prefers-color-scheme:dark)"` (without space)
    this._darkCSS = doc.querySelectorAll(
      `${LINK_REL_STYLESHEET}[${MEDIA}*=${PREFERS_COLOR_SCHEME}][${MEDIA}*="${DARK}"],
       ${STYLE}[${MEDIA}*=${PREFERS_COLOR_SCHEME}][${MEDIA}*="${DARK}"]`,
    );
    this._lightCSS = doc.querySelectorAll(
      `${LINK_REL_STYLESHEET}[${MEDIA}*=${PREFERS_COLOR_SCHEME}][${MEDIA}*="${LIGHT}"], 
       ${STYLE}[${MEDIA}*=${PREFERS_COLOR_SCHEME}][${MEDIA}*="${LIGHT}"]`,
    );

    // Get DOM references.
    this._lightRadio = shadowRoot.querySelector('[part=lightRadio]');
    this._lightLabel = shadowRoot.querySelector('[part=lightLabel]');
    this._darkRadio = shadowRoot.querySelector('[part=darkRadio]');
    this._darkLabel = shadowRoot.querySelector('[part=darkLabel]');
    this._darkCheckbox = shadowRoot.querySelector('[part=toggleCheckbox]');
    this._checkboxLabel = shadowRoot.querySelector('[part=toggleLabel]');
    this._lightThreeWayRadio = shadowRoot.querySelector(
      '[part=lightThreeWayRadio]',
    );
    this._lightThreeWayLabel = shadowRoot.querySelector(
      '[part=lightThreeWayLabel]',
    );
    this._systemThreeWayRadio = shadowRoot.querySelector(
      '[part=systemThreeWayRadio]',
    );
    this._systemThreeWayLabel = shadowRoot.querySelector(
      '[part=systemThreeWayLabel]',
    );
    this._darkThreeWayRadio = shadowRoot.querySelector(
      '[part=darkThreeWayRadio]',
    );
    this._darkThreeWayLabel = shadowRoot.querySelector(
      '[part=darkThreeWayLabel]',
    );
    this._legendLabel = shadowRoot.querySelector('legend');
    this._permanentAside = shadowRoot.querySelector('aside');
    this._permanentCheckbox = shadowRoot.querySelector(
      '[part=permanentCheckbox]',
    );
    this._permanentLabel = shadowRoot.querySelector('[part=permanentLabel]');
  }

  connectedCallback() {
    // Does the browser support native `prefers-color-scheme`?
    const hasNativePrefersColorScheme = matchMedia(MQ_DARK).media !== NOT_ALL;
    // Listen to `prefers-color-scheme` changes.
    if (hasNativePrefersColorScheme) {
      matchMedia(MQ_DARK).addListener(({ matches }) => {
        if (this.permanent) {
          return;
        }
        this.mode = matches ? DARK : LIGHT;
        this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
      });
    }
    // Set initial state, giving preference to a remembered value, then the
    // native value (if supported), and eventually defaulting to a light
    // experience.
    let rememberedValue = false;
    try {
      rememberedValue = store.getItem(NAME);
    } catch (err) {
      // Do nothing. The user probably blocks cookies.
    }
    if (rememberedValue && [DARK, LIGHT].includes(rememberedValue)) {
      this.mode = rememberedValue;
      this._permanentCheckbox.checked = true;
      this.permanent = true;
    } else if (hasNativePrefersColorScheme) {
      this.mode = matchMedia(MQ_LIGHT).matches ? LIGHT : DARK;
    }
    if (!this.mode) {
      this.mode = LIGHT;
    }
    if (this.permanent && !rememberedValue) {
      try {
        store.setItem(NAME, this.mode);
      } catch (err) {
        // Do nothing. The user probably blocks cookies.
      }
    }

    // Default to toggle appearance.
    if (!this.appearance) {
      this.appearance = TOGGLE;
    }

    // Update the appearance to toggle, switch or three-way.
    this._updateAppearance();

    // Update the radios
    this._updateRadios();

    // Make the checkbox reflect the state of the radios
    this._updateCheckbox();

    // Make the 3 way radio reflect the state of the radios
    this._updateThreeWayRadios();

    // Synchronize the behavior of the radio and the checkbox.
    [this._lightRadio, this._darkRadio].forEach((input) => {
      input.addEventListener('change', () => {
        this.mode = this._lightRadio.checked ? LIGHT : DARK;
        this._updateCheckbox();
        this._updateThreeWayRadios();
        this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
      });
    });
    this._darkCheckbox.addEventListener('change', () => {
      this.mode = this._darkCheckbox.checked ? DARK : LIGHT;
      this._updateRadios();
      this._updateThreeWayRadios();
      this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
    });
    this._lightThreeWayRadio.addEventListener('change', () => {
      this.mode = LIGHT;
      this.permanent = true;
      this._updateCheckbox();
      this._updateRadios();
      this._updateThreeWayRadios();
      this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
      this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
        permanent: this.permanent,
      });
    });
    this._darkThreeWayRadio.addEventListener('change', () => {
      this.mode = DARK;
      this.permanent = true;
      this._updateCheckbox();
      this._updateRadios();
      this._updateThreeWayRadios();
      this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
      this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
        permanent: this.permanent,
      });
    });
    this._systemThreeWayRadio.addEventListener('change', () => {
      this.mode = this._getPrefersColorScheme();
      this.permanent = false;
      this._updateCheckbox();
      this._updateRadios();
      this._updateThreeWayRadios();
      this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
      this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
        permanent: this.permanent,
      });
    });
    // Make remembering the last mode optional
    this._permanentCheckbox.addEventListener('change', () => {
      this.permanent = this._permanentCheckbox.checked;
      this._updateThreeWayRadios();
      this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
        permanent: this.permanent,
      });
    });

    // Finally update the mode and let the world know what's going on
    this._updateMode();
    this._dispatchEvent(COLOR_SCHEME_CHANGE, { colorScheme: this.mode });
    this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
      permanent: this.permanent,
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === MODE) {
      const allAttributes = [LIGHT, SYSTEM, DARK];
      if (!allAttributes.includes(newValue)) {
        throw new RangeError(
          `Allowed values are: "${allAttributes.join(`", "`)}".`,
        );
      }
      // Only show the dialog programmatically on devices not capable of hover
      // and only if there is a label
      if (matchMedia('(hover:none)').matches && this.remember) {
        this._showPermanentAside();
      }
      if (this.permanent) {
        try {
          store.setItem(NAME, this.mode);
        } catch (err) {
          // Do nothing. The user probably blocks cookies.
        }
      }
      this._updateRadios();
      this._updateCheckbox();
      this._updateThreeWayRadios();
      this._updateMode();
    } else if (name === APPEARANCE) {
      const allAppearanceOptions = [TOGGLE, SWITCH, THREE_WAY];
      if (!allAppearanceOptions.includes(newValue)) {
        throw new RangeError(
          `Allowed values are: "${allAppearanceOptions.join(`", "`)}".`,
        );
      }
      this._updateAppearance();
    } else if (name === PERMANENT) {
      if (this.permanent) {
        if (this.mode) {
          try {
            store.setItem(NAME, this.mode);
          } catch (err) {
            // Do nothing. The user probably blocks cookies.
          }
        }
      } else {
        try {
          store.removeItem(NAME);
        } catch (err) {
          // Do nothing. The user probably blocks cookies.
        }
      }
      this._permanentCheckbox.checked = this.permanent;
    } else if (name === LEGEND) {
      this._legendLabel.textContent = newValue;
    } else if (name === REMEMBER) {
      this._permanentLabel.textContent = newValue;
    } else if (name === LIGHT) {
      this._lightLabel.textContent = newValue;
      if (this.mode === LIGHT) {
        this._checkboxLabel.textContent = newValue;
      }
    } else if (name === DARK) {
      this._darkLabel.textContent = newValue;
      if (this.mode === DARK) {
        this._checkboxLabel.textContent = newValue;
      }
    }
  }

  _getPrefersColorScheme() {
    return matchMedia(MQ_LIGHT).matches ? LIGHT : DARK;
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(
      new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: value,
      }),
    );
  }

  _updateAppearance() {
    // Hide or show the light-related affordances dependent on the appearance,
    // which can be "switch" , "toggle" or "three-way".
    this._lightRadio.hidden =
      this._lightLabel.hidden =
      this._darkRadio.hidden =
      this._darkLabel.hidden =
      this._darkCheckbox.hidden =
      this._checkboxLabel.hidden =
      this._lightThreeWayRadio.hidden =
      this._lightThreeWayLabel.hidden =
      this._systemThreeWayRadio.hidden =
      this._systemThreeWayLabel.hidden =
      this._darkThreeWayRadio.hidden =
      this._darkThreeWayLabel.hidden =
        true;
    switch (this.appearance) {
      case SWITCH:
        this._lightRadio.hidden =
          this._lightLabel.hidden =
          this._darkRadio.hidden =
          this._darkLabel.hidden =
            false;
        break;
      case THREE_WAY:
        this._lightThreeWayRadio.hidden =
          this._lightThreeWayLabel.hidden =
          this._systemThreeWayRadio.hidden =
          this._systemThreeWayLabel.hidden =
          this._darkThreeWayRadio.hidden =
          this._darkThreeWayLabel.hidden =
            false;
        break;
      case TOGGLE:
      default:
        this._darkCheckbox.hidden = this._checkboxLabel.hidden = false;
        break;
    }
  }

  _updateRadios() {
    if (this.mode === LIGHT) {
      this._lightRadio.checked = true;
    } else {
      this._darkRadio.checked = true;
    }
  }

  _updateCheckbox() {
    if (this.mode === LIGHT) {
      this._checkboxLabel.style.setProperty(
        `--${NAME}-checkbox-icon`,
        `var(--${NAME}-light-icon,url("${DEFAULT_URL}moon.png"))`,
      );
      this._checkboxLabel.textContent = this.light;
      if (!this.light) {
        this._checkboxLabel.ariaLabel = DARK;
      }
      this._darkCheckbox.checked = false;
    } else {
      this._checkboxLabel.style.setProperty(
        `--${NAME}-checkbox-icon`,
        `var(--${NAME}-dark-icon,url("${DEFAULT_URL}sun.png"))`,
      );
      this._checkboxLabel.textContent = this.dark;
      if (!this.dark) {
        this._checkboxLabel.ariaLabel = LIGHT;
      }
      this._darkCheckbox.checked = true;
    }
  }

  _updateThreeWayRadios() {
    this._lightThreeWayLabel.ariaLabel = LIGHT;
    this._systemThreeWayLabel.ariaLabel = SYSTEM;
    this._lightThreeWayLabel.ariaLabel = DARK;
    this._lightThreeWayLabel.textContent = this.light;
    this._systemThreeWayLabel.textContent = this.system;
    this._darkThreeWayLabel.textContent = this.dark;
    if (this.permanent) {
      if (this.mode === LIGHT) {
        this._lightThreeWayRadio.checked = true;
      } else {
        this._darkThreeWayRadio.checked = true;
      }
    } else {
      this._systemThreeWayRadio.checked = true;
    }
  }

  _updateMode() {
    if (this.mode === LIGHT) {
      this._lightCSS.forEach((link) => {
        link.media = ALL;
        link.disabled = false;
      });
      this._darkCSS.forEach((link) => {
        link.media = NOT_ALL;
        link.disabled = true;
      });
    } else {
      this._darkCSS.forEach((link) => {
        link.media = ALL;
        link.disabled = false;
      });
      this._lightCSS.forEach((link) => {
        link.media = NOT_ALL;
        link.disabled = true;
      });
    }
  }

  _showPermanentAside() {
    this._permanentAside.style.visibility = 'visible';
    setTimeout(() => {
      this._permanentAside.style.visibility = 'hidden';
    }, 3000);
  }
}

customElements.define(NAME, DarkModeToggle);



================================================
FILE: src/template-contents.tpl
================================================
<style>
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  :host {
    contain: content;
    display: block;
  }

  :host([hidden]) {
    display: none;
  }

  form {
    background-color: var(--${NAME}-background-color, transparent);
    color: var(--${NAME}-color, inherit);
    padding: 0;
  }

  fieldset {
    border: none;
    margin: 0;
    padding-block: 0.25rem;
    padding-inline: 0.25rem;
  }

  legend {
    font: var(--${NAME}-legend-font, inherit);
    padding: 0;
  }

  input,
  label {
    cursor: pointer;
  }

  label {
    white-space: nowrap;
  }

  input {
    opacity: 0;
    position: absolute;
    pointer-events: none;
  }

  input:focus-visible + label {
    outline: #e59700 auto 2px;
    outline: -webkit-focus-ring-color auto 5px;
  }

  label::before {
    content: "";
    display: inline-block;
    background-size: var(--${NAME}-icon-size, 1rem);
    background-repeat: no-repeat;
    height: var(--${NAME}-icon-size, 1rem);
    width: var(--${NAME}-icon-size, 1rem);
    vertical-align: middle;
  }

  label:not(:empty)::before {
    margin-inline-end: 0.5rem;
  }

  [part="lightLabel"]::before, [part="lightThreeWayLabel"]::before {
    background-image: var(--${NAME}-light-icon, url("${DEFAULT_URL}sun.png"));
  }

  [part="darkLabel"]::before, [part="darkThreeWayLabel"]::before {
    filter: var(--${NAME}-icon-filter, none);
    background-image: var(--${NAME}-dark-icon, url("${DEFAULT_URL}moon.png"));
  }

  [part="systemThreeWayLabel"]::before {
    background-image: var(--${NAME}-system-icon, url("${DEFAULT_URL}system.png"));
  }

  [part="toggleLabel"]::before {
    background-image: var(--${NAME}-checkbox-icon, none);
  }

  [part="permanentLabel"]::before {
    background-image: var(--${NAME}-remember-icon-unchecked, url("${DEFAULT_URL}unchecked.svg"));
  }

  [part="lightLabel"],
  [part="darkLabel"],
  [part="toggleLabel"],
  [part$="ThreeWayLabel"] {
    font: var(--${NAME}-label-font, inherit);
  }

  [part="lightLabel"]:empty,
  [part="darkLabel"]:empty,
  [part="toggleLabel"]:empty,
  [part$="ThreeWayLabel"]:empty {
    font-size: 0;
    padding: 0;
  }

  [part="permanentLabel"] {
    font: var(--${NAME}-remember-font, inherit);
  }

  input:checked + [part="permanentLabel"]::before {
    background-image: var(--${NAME}-remember-icon-checked, url("${DEFAULT_URL}checked.svg"));
  }

  input:checked + [part="darkLabel"],
  input:checked + [part="lightLabel"],
  input:checked + [part$="ThreeWayLabel"] {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
  }

  input:checked + [part="darkLabel"]::before,
  input:checked + [part="lightLabel"]::before,
  input:checked + [part$="ThreeWayLabel"]::before {
    background-color: var(--${NAME}-active-mode-background-color, transparent);
  }

  input:checked + [part="toggleLabel"]::before, input[part="toggleCheckbox"]:checked ~ [part="threeWayRadioWrapper"] [part$="ThreeWayLabel"]::before {
    filter: var(--${NAME}-icon-filter, none);
  }

  input:checked + [part="toggleLabel"] ~ aside [part="permanentLabel"]::before {
    filter: var(--${NAME}-remember-filter, invert(100%));
  }

  aside {
    visibility: hidden;
    margin-block-start: 0.15rem;
  }

  [part="lightLabel"]:focus-visible ~ aside,
  [part="darkLabel"]:focus-visible ~ aside,
  [part="toggleLabel"]:focus-visible ~ aside {
    visibility: visible;
    transition: visibility 0s;
  }

  aside [part="permanentLabel"]:empty {
    display: none;
  }

  @media (hover: hover) {
    aside {
      transition: visibility 3s;
    }

    aside:hover {
      visibility: visible;
    }

    [part="lightLabel"]:hover ~ aside,
    [part="darkLabel"]:hover ~ aside,
    [part="toggleLabel"]:hover ~ aside {
      visibility: visible;
      transition: visibility 0s;
    }
  }
</style>
<form part="form">
  <fieldset part="fieldset">
    <legend part="legend"></legend>
    <input part="lightRadio" id="l" name="mode" type="radio">
    <label part="lightLabel" for="l"></label>
    <input part="darkRadio" id="d" name="mode" type="radio">
    <label  part="darkLabel" for="d"></label>
    <input part="toggleCheckbox" id="t" type="checkbox">
    <label part="toggleLabel" for="t"></label>
    <span part="threeWayRadioWrapper">
      <input part="lightThreeWayRadio" id="3l" name="three-way-mode" type="radio">
      <label part="lightThreeWayLabel" for="3l"></label>
      <input part="systemThreeWayRadio" id="3s" name="three-way-mode" type="radio">
      <label part="systemThreeWayLabel" for="3s"></label>
      <input part="darkThreeWayRadio" id="3d" name="three-way-mode" type="radio">
      <label part="darkThreeWayLabel" for="3d"></label>
    </span>
    <aside part="aside">
      <input part="permanentCheckbox" id="p" type="checkbox">
      <label part="permanentLabel" for="p"></label>
    </aside>
  </fieldset>
</form>



================================================
FILE: .github/workflows/main.yml
================================================
name: Compressed Size

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2-beta
        with:
          fetch-depth: 1
      - uses: preactjs/compressed-size-action@v1
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}'


