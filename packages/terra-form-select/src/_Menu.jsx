import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { polyfill } from 'react-lifecycles-compat';
import 'terra-base/lib/baseStyles';
import Option from './_Option';
import Util from './_MenuUtil';
import SelectUtils from './_SelectUtils';
import styles from './_Menu.scss';

const cx = classNames.bind(styles);
const KeyCodes = SelectUtils.KEYCODES;
const Variants = SelectUtils.VARIANTS;

/* Disabling this rule because props used in getDerivedStateFromProps return false positives. */
/* eslint-disable react/no-unused-prop-types */
const propTypes = {
  /**
   * The content of the menu.
   */
  children: PropTypes.node,
  /**
   * Callback function triggered when an option is deselected.
   */
  onDeselect: PropTypes.func,
  /**
   * Callback function triggered when an option is selected.
   */
  onSelect: PropTypes.func.isRequired,
  /**
   * Callback function for option filtering. function(searchValue, option)
   */
  optionFilter: PropTypes.func,
  /**
   * The search value to filter the available options.
   */
  searchValue: PropTypes.string,
  /**
   * The value of the selected options.
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  /**
   * The behavior of the select.
   */
  variant: PropTypes.oneOf([Variants.DEFAULT, Variants.MULTIPLE, Variants.TAG, Variants.COMBOBOX]).isRequired,
};

const defaultProps = {
  children: undefined,
  optionFilter: undefined,
  searchValue: undefined,
  value: undefined,
};

class Menu extends React.Component {
  /**
   * Updates the component state when new props are received.
   * @param {Object} props - The received props.
   * @param {Object} state - The current state of the component.
   * @return {Object|null} - The new state object. Returning null indiciates no changes to state.
   */
  static getDerivedStateFromProps(props, state) {
    const children = Util.filter(props.children, props.searchValue, props.optionFilter);

    if (Util.shouldAllowFreeText(props, children)) {
      children.push(<Option value={props.searchValue} display={`Add "${props.searchValue}"`} isTag />);
    } else if (children.length === 0) {
      const content = props.noResultContent || `No matching results for "${props.searchValue}"`;
      children.push(<div className={cx('no-results')}>{content}</div>);
    }

    return {
      children,
      searchValue: props.searchValue,
      active: Util.getActiveOptionFromProps(props, children, state),
    };
  }

  constructor(props) {
    super(props);

    this.state = {};

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    if (!this.state.active) {
      return;
    }

    const activeOption = this.menu.querySelector('[data-select-active]');
    const dropdownRect = this.menu.parentNode.getBoundingClientRect();
    const optionRect = activeOption.getBoundingClientRect();

    if (optionRect.top < dropdownRect.top) {
      activeOption.scrollIntoView();
    } else if (optionRect.bottom > dropdownRect.bottom) {
      activeOption.scrollIntoView(false);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Clones the menu content with the necessary events.
   * @param {ReactNode} object - The node being cloned.
   * @return {array} - An array of cloned content.
   */
  clone(object) {
    return React.Children.map(object, (option) => {
      if (option.type.isOption) {
        return React.cloneElement(option, {
          isActive: option.props.value === this.state.active,
          isCheckable: Util.isMultiple(this.props.variant),
          isSelected: Util.isSelected(this.props.value, option.props.value),
          onMouseDown: event => this.handleOptionClick(event, option),
          onMouseEnter: event => this.handleMouseEnter(event, option),
          ...(option.props.value === this.state.active) && { 'data-select-active': true },
        });
      } else if (option.type.isOptGroup) {
        return React.cloneElement(option, {}, this.clone(option.props.children));
      }
      return option;
    });
  }

  /**
   * Handles keyboard interactions within the dropdown.
   * @param {event} event - The key down event.
   */
  handleKeyDown(event) {
    const { keyCode } = event;
    const { active, children } = this.state;
    const { onSelect, value, variant } = this.props;

    if (keyCode === KeyCodes.ENTER && this.state.active && (!Util.isMultiple(variant) || !Util.includes(value, active))) {
      const option = Util.findByValue(children, active);
      onSelect(option.props.value, option);
    } else if (keyCode === KeyCodes.UP_ARROW) {
      event.preventDefault();
      this.setState({ active: Util.findPrevious(children, active) });
    } else if (keyCode === KeyCodes.DOWN_ARROW) {
      event.preventDefault();
      this.setState({ active: Util.findNext(children, active) });
    }
  }

  /**
   * Communicates the selection or deselection of an option.
   * @param {event} event - The click event triggering the callback.
   * @param {ReactNode} option - The option that was clicked.
   */
  handleOptionClick(event, option) {
    const { onDeselect, onSelect, value, variant } = this.props;

    if (Util.isMultiple(variant) && Util.includes(value, option.props.value)) {
      onDeselect(option.props.value, option);
    } else {
      onSelect(option.props.value, option);
    }
  }

  /**
   * Sets the hovered option as the active value.
   * @param {event} event - The mouse enter event.
   * @param {ReactNode} option - The option that recieved the mouse enter event.
   */
  handleMouseEnter(event, option) {
    this.setState({ active: option.props.value });

    if (option.props.onMouseEnter) {
      option.props.onMouseEnter(event);
    }
  }

  render() {
    return (
      <ul className={cx('menu')} ref={(menu) => { this.menu = menu; }}>
        {this.clone(this.state.children)}
      </ul>
    );
  }
}

Menu.propTypes = propTypes;
Menu.defaultProps = defaultProps;

/**
 * This polyfill enables backwards compatability of features added in React 16.3.0.
 * More information is available at: https://github.com/reactjs/react-lifecycles-compat
 */
polyfill(Menu);

export default Menu;
