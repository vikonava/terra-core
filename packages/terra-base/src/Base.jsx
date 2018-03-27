import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { I18nProvider, i18nLoader, injectIntl, intlShape } from 'terra-i18n';
import './baseStyles';
import styles from './Base.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The component(s) that will be wrapped by `<Base />`.
   */
  children: PropTypes.node.isRequired,
  /**
   * The locale name.
   */
  locale: PropTypes.string,
  /**
   * Customized translations provided by consuming application only for current locale.
   */
   /* eslint-disable consistent-return */
  customMessages: (props, propName, componentName) => {
    if (Object.keys(props[propName]).length !== 0 && props.locale === undefined) {
      return new Error(
        `Missing locale prop for ${propName} in ${componentName} props`,
      );
    }
  },
  /**
   * The component(s) that will be wrapped by `<Base />` ONLY
   * in the event that translations have not been loaded yet.
   * NOTE: Absolutely no locale-dependent logic should be
   * utilized in this placeholder.
   */
  translationsLoadingPlaceholder: PropTypes.node,
  /**
   * The indication as to whether or not the Base component should be sized to match
   * its parent element's size.
   */
  fill: PropTypes.bool,
  /**
   * The string selector identifying the element to which Base and its React tree are mounted.
   */
  mountSelector: PropTypes.string,
};

const defaultProps = {
  customMessages: {},
  mountSelector: '#root',
};

class Base extends React.Component {
  static updateMountContainerStyles(mountSelector, fill) {
    /**
     * While undefined values pass through querySelector as expected, empty-string values
     * will throw an exception.
     */
    if (!mountSelector || !mountSelector.length) {
      return;
    }

    const containerElement = document.querySelector(mountSelector);

    if (!containerElement) {
      return;
    }

    if (fill) {
      containerElement.classList.add(cx('mount-fill'));
    } else {
      containerElement.classList.remove(cx('mount-fill'));
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      areTranslationsLoaded: false,
      locale: props.locale,
      messages: {},
    };
  }

  componentDidMount() {
    if (this.props.locale !== undefined) {
      try {
        i18nLoader(this.props.locale, this.setState, this);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }

    Base.updateMountContainerStyles(this.props.mountSelector, this.props.fill);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.locale !== undefined && nextProps.locale !== this.props.locale) {
      try {
        i18nLoader(nextProps.locale, this.setState, this);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  }

  componentDidUpdate() {
    Base.updateMountContainerStyles(this.props.mountSelector, this.props.fill);
  }

  render() {
    const {
      children,
      locale,
      customMessages,
      translationsLoadingPlaceholder,
      fill,
      mountSelector,
      ...customProps
    } = this.props;

    const baseClassNames = cx([{
      'base-fill': fill,
    },
      customProps.className,
    ]);

    const messages = Object.assign({}, this.state.messages, customMessages);

    if (locale === undefined) {
      return (<div {...customProps} className={baseClassNames}>{children}</div>);
    }

    if (!this.state.areTranslationsLoaded) return <div className={baseClassNames}>{this.props.translationsLoadingPlaceholder}</div>;
    return (
      <I18nProvider {...customProps} className={baseClassNames} locale={this.state.locale} messages={messages}>
        {children}
      </I18nProvider>
    );
  }
}

Base.propTypes = propTypes;
Base.defaultProps = defaultProps;

export default Base;
export { injectIntl, intlShape };
