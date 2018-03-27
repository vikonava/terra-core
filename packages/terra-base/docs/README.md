# Terra Base

The base component receives customized translation messages from the application and passes translations into I18nProvider wrapper and sets minimal global styles for an application.
Global styles include CSS to help normalize box-sizing, reset margins/paddings, and define global font styles.

## Getting Started

- Install with [npmjs](https://www.npmjs.com):
  - `npm install terra-base`
  - `yarn add terra-base`

## Usage

```jsx
import React from 'react';
import Base from 'terra-base';

<Base>
  ...
</Base>
```

## I18n

The `locale` prop provided to `Base` will be used to loaded the appropriate translation messages. `Base` additionally wraps its children with an `I18nProvider` component (as provided by `terra-i18n`) that exposes the loaded messages to its children through its context.

Children of `Base` should use the provided `injectIntl` higher-order component generator to interface with the `I18nProvider` context. The `intlShape` prop type is also available for use in those components' prop type specifications.

```jsx
// ChildComponent.jsx

import React from 'react';
import { injectIntl, intlShape } from 'terra-base';

const ChildComponent = ({ intl }) => (
  <p>{intl.formatMessage({ id: 'my.string.id' })}</p>
);

ChildComponent.propTypes = {
  intl: intlShape,
};

export default injectIntl(ChildComponent);

// App.jsx

import React from 'react';
import Base from 'terra-base';
import ChildComponent from './ChildComponent';

const App = () => (
  <Base locale="en">
    <ChildComponent />
  </Base>
);
```

## Fill

Some applications require that their content fit to the window size. With `Base` components at the root of those applications, additional styles on `Base` are generally needed to provide appropriate container sizing. Rather than require custom classes, `Base` has a `fill` prop that will cause its size to fit that of its parent container. An overflow value will also be set on `Base` to ensure content can be rendered appropriately.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Base from 'terra-base';

const App = () => (
  <Base locale="en" fill>
    <Content />
  </Base>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

However, there could still a problem with the above example. The `#root` element onto which the `App` component is being mounted needs to have a height defined for it; otherwise, the `fill`-enabled `Base` component inside `App` will have nothing to be sized relative to.

To ease in the styling of this mount element, `Base` can receive a `mountSelector` prop. This prop should be a selector uniquely identifying the element to which `Base` is being mounted. When `fill` is enabled, `Base` will update the styles on the element retrieved by the `mountSelector` value to ensure the appropriate sizes are set.

The default `mountSelector` value is `#root`, though a different selector can be provided as needed to match differing implementations.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Base from 'terra-base';

const App = () => (
  <Base locale="en" fill mountSelector="#root">
    <Content />
  </Base>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

Any elements between the mounting element and `body`, if present, should be manually styled to ensure that the appropriate sizes are set.

## Component Features
* [Cross-Browser Support](https://github.com/cerner/terra-core/wiki/Component-Features#cross-browser-support)
* [Responsive Support](https://github.com/cerner/terra-core/wiki/Component-Features#responsive-support)
* [Mobile Support](https://github.com/cerner/terra-core/wiki/Component-Features#mobile-support)
* [Internationalization Support](https://github.com/cerner/terra-core/wiki/Component-Features#internationalization-i18n-support)
* [Localization Support](https://github.com/cerner/terra-core/wiki/Component-Features#localization-support)

