import React from 'react';
import PropTypes from 'prop-types';
import Hookshot from 'terra-hookshot';
import classNames from 'classnames/bind';
import styles from './_Dropdown.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The content of the dropdown.
   */
  children: PropTypes.node,
  /**
   * Callback function triggered when the dropdown should close.
   */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * The inline style of the dropdown.
   */
  style: PropTypes.object,
  /**
   * The attachment target.
   */
  target: PropTypes.object.isRequired,
};

const defaultProps = {
  children: undefined,
  style: undefined,
};

class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.positionDropdown = this.positionDropdown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount() {
    this.positionDropdown();
  }

  componentDidUpdate() {
    const { bottom } = this.dropdown.getBoundingClientRect();

    if (bottom > window.innerHeight) {
      this.positionDropdown();
    }
  }

  componentWillUnmount() {
    this.props.target.style.borderRadius = '3px';
  }

  /**
   * Requests the dropdown to close if a click event occurs outside of the dropdown or target.
   * @param {event} event - The click event.
   */
  handleOutsideClick(event) {
    if (this.props.target.contains(event.target)) {
      return;
    }

    this.props.onRequestClose();
  }

  /**
   * Positions the dropdown to utilize available space above or below the target.
   */
  positionDropdown() {
    const { target, style } = this.props;

    const { height } = this.dropdown.getBoundingClientRect();
    const { top, bottom } = target.getBoundingClientRect();

    const spaceBelow = window.innerHeight - bottom;
    const maxHeight = (style || {}).maxHeight || Infinity;
    const canFitBelow = maxHeight < spaceBelow || height < spaceBelow || spaceBelow > top;
    const availableSpace = canFitBelow ? spaceBelow : top;

    this.setState({ maxHeight: Math.min(maxHeight, availableSpace - 10), isAbove: !canFitBelow });

    if (!canFitBelow) {
      this.props.target.style.borderRadius = '0 0 3px 3px';
    } else {
      this.props.target.style.borderRadius = '3px 3px 0 0';
    }
  }

  render() {
    const { children, onRequestClose, style, target, ...customProps } = this.props;

    const { width } = target.getBoundingClientRect();
    const dropdownStyle = Object.assign({}, style, { width, maxHeight: this.state.maxHeight });

    const dropdownClasses = cx(
      'dropdown',
      { 'is-above': this.state.isAbove },
      customProps.className,
    );

    const aboveAttachment = { vertical: 'bottom', horizontal: 'start' };
    const belowAttachment = { vertical: 'top', horizontal: 'start' };
    const contentAttachment = this.state.isAbove ? aboveAttachment : belowAttachment;
    const targetAttachment = this.state.isAbove ? belowAttachment : aboveAttachment;

    return (
      <Hookshot
        isOpen
        isEnabled
        targetRef={() => target}
        attachmentBehavior="none"
        contentAttachment={contentAttachment}
        targetAttachment={targetAttachment}
      >
        <Hookshot.Content
          {...customProps}
          style={dropdownStyle}
          className={dropdownClasses}
          onResize={this.positionDropdown}
          onOutsideClick={this.handleOutsideClick}
          refCallback={(dropdown) => { this.dropdown = dropdown; }}
        >
          {children}
        </Hookshot.Content>
      </Hookshot>
    );
  }
}

Dropdown.propTypes = propTypes;
Dropdown.defaultProps = defaultProps;

export default Dropdown;
