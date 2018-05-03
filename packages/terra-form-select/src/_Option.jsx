import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './_Option.scss';

const cx = classNames.bind(styles);

/* Disabling validation for controlled props. These props will always be overwritten. */
/* eslint react/prop-types: [2, { ignore: [isActive, isSelected, isCheckable, isTag] }] */
/* {boolean} isActive - True if the component is active. */
/* {boolean} isSelected - True if the component is selected. */
/* {boolean} isCheckable - True if the component is checkable. */
const propTypes = {
  /**
   * Whether the option is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * The display text of the option.
   */
  display: PropTypes.string,
  /**
   * The value of the option.
   */
  value: PropTypes.string.isRequired,
};

const defaultProps = {
  children: undefined,
  disabled: false,
  display: undefined,
};

const Option = ({
  disabled,
  display,
  value,
  isActive,
  isSelected,
  isCheckable,
  isTag,
  ...customProps
}) => {
  const optionClassNames = cx([
    'option',
    { 'is-active': isActive },
    { 'is-checkable': isCheckable },
    { 'is-disabled': disabled },
    { 'is-selected': isSelected },
    { 'is-tag': isTag },
    customProps.className,
  ]);

  return (
    <li {...customProps} role="option" className={optionClassNames} disabled={disabled}>
      {(isCheckable || isTag) && <span className={cx('indicator')} />}
      <span className={cx('display')}>{display}</span>
    </li>
  );
};

Option.propTypes = propTypes;
Option.defaultProps = defaultProps;
Option.isOption = true;

export default Option;
