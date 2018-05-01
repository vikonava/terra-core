import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import SelectUtils from './_SelectUtils';
import Tag from './_Tag';
import Option from './_Option';
import OptGroup from './_OptGroup';
import Dropdown from './_Dropdown';
import styles from './_SelectFrame.scss';

const cx = classNames.bind(styles);
const Variants = SelectUtils.VARIANTS;
const KeyCodes = SelectUtils.KEYCODES;

const propTypes = {
  /**
   * Whether the select is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * A render callback for dropdown content.
   */
  dropdown: PropTypes.func,
  /**
   * Additional attributes to append to the dropdown. ( Style, ClassNames, etc.. )
   */
  dropdownAttrs: PropTypes.object,
  /**
   * Whether the select is in an invalid state.
   */
  isInvalid: PropTypes.bool,
  /**
   * Whether the select is searchable.
   */
  isSearchable: PropTypes.bool,
  /**
   * Content to display when no search results are found.
   */
  noResultContent: PropTypes.node,
  /**
   * Callback function triggered when the select is clicked.
   */
  onClick: PropTypes.func,
  /**
   * Callback function triggered when an option is deselected.
   */
  onDeselect: PropTypes.func,
  /**
   * Callback function triggered when the search criteria changes.
   */
  onSearch: PropTypes.func,
  /**
   * Callback function triggered when an option is selected.
   */
  onSelect: PropTypes.func,
  /**
   * Callback function for option filtering. function(searchValue, option)
   */
  optionFilter: PropTypes.func,
  /**
   * Placholder text.
   */
  placeholder: PropTypes.string,
  /**
   * The selected value.
   */
  value: PropTypes.oneOfType([
    PropTypes.shape({
      display: PropTypes.node.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      display: PropTypes.node.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })),
  ]),
  /**
   * The behavior of the select.
   */
  variant: PropTypes.oneOf([Variants.DEFAULT, Variants.MULTIPLE, Variants.TAG, Variants.COMBOBOX]),
};

const defaultProps = {
  disabled: false,
  dropdown: undefined,
  dropdownAttrs: undefined,
  isInvalid: false,
  noResultContent: undefined,
  onClick: undefined,
  onDeselect: undefined,
  onSearch: undefined,
  onSelect: undefined,
  optionFilter: undefined,
  placeholder: 'Select',
  value: undefined,
  variant: Variants.DEFAULT,
};

// TODO:
/* eslint-disable jsx-a11y/no-static-element-interactions */
class SelectRaw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      searchValue: '',
    };

    this.openDropdown = this.openDropdown.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  // TODO
  componentDidUpdate() {
    if (this.input) {
      this.input.focus();
    }
  }

  /**
   * Closes the dropdown.
   */
  closeDropdown() {
    this.setState({ isOpen: false });
  }

  /**
   * Opens the dropdown.
   */
  openDropdown() {
    if (this.state.isOpen) {
      return;
    }

    this.setState({ isOpen: true });
  }

  handleFocus() {
    if (this.input) {
      // this.input.focus();
    }
  }

  /**
   * Handles keyboard interactions and accessibility.
   * @param {event} event - The onKeyDown event.
   */
  handleKeyDown(event) {
    const { keyCode } = event;
    const { BACKSPACE, SPACE, UP_ARROW, DOWN_ARROW } = KeyCodes;

    if (document.activeElement !== this.input && (keyCode === SPACE || keyCode === UP_ARROW || keyCode === DOWN_ARROW)) {
      event.preventDefault();
      this.openDropdown();
    } else if (keyCode === BACKSPACE && !this.state.searchValue && this.props.value.length > 0) {
      this.props.onDeselect(this.props.value.slice(-1)[0].value);
    }
  }

  /**
   * Handles search value changes.
   * @param {event} event - The search input change event.
   */
  handleSearch(event) {
    this.setState({ searchValue: event.target.value, isOpen: true, searchChanged: true });

    if (this.props.onSearch) {
      this.props.onSearch(event.target.value);
    }
  }

  /**
   * Handles the request to select an option.
   * @param {string|number} value - The value of the selected option.
   * @param {ReactNode} option - The option that was selected.
   */
  handleSelect(value, option) {
    const isOpen = this.props.variant === Variants.MULTIPLE || this.props.variant === Variants.TAG;
    this.setState({ searchValue: '', isOpen, searchChanged: false });

    if (this.props.onSelect) {
      this.props.onSelect(value, option);
    }
  }

  /**
   * Toggles the dropdown open or closed.
   */
  toggleDropdown() {
    if (this.state.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  render() {
    const {
      disabled,
      dropdown,
      dropdownAttrs,
      isInvalid,
      isSearchable,
      noResultContent,
      onDeselect,
      onSearch,
      onSelect,
      optionFilter,
      placeholder,
      variant,
      value,
      ...customProps
    } = this.props;

    const selectClasses = cx([
      'select',
      variant,
      { invalid: isInvalid },
      { 'is-disabled': disabled },
      { open: this.state.isOpen },
      customProps.className,
    ]);

    let selectedValue;
    let displayValue;
    if (value) {
      selectedValue = Array.isArray(value) ? value.map(option => option.value) : value.value;
      displayValue = !Array.isArray(value) ? value.display : value.map(item => (
        <Tag value={item.value} onDeselect={onDeselect} key={item.value}>{item.display}</Tag>
      ));
    }

    const display = () => {
      switch (variant) {
        case Variants.MULTIPLE:
        case Variants.TAG:
          return (
            <ul className={cx('display')}>
              {displayValue}
              {(this.state.isOpen || displayValue.length === 0) &&
                <input
                  className={cx('search')}
                  onChange={this.handleSearch}
                  value={this.state.searchValue}
                  ref={(input) => { this.input = input; }}
                  placeholder={placeholder}
                  tabIndex="-1"
                />
            }
            </ul>
          );
        case Variants.COMBOBOX:
          return (
            <div className={cx('display')}>
              <input
                className={cx('search')}
                onChange={this.handleSearch}
                value={this.state.searchChanged ? this.state.searchValue : selectedValue}
                ref={(input) => { this.input = input; }}
                placeholder={placeholder}
                tabIndex="-1"
              />
            </div>
          );
        default:
          return <div className={cx('display')}>{displayValue}</div>;
      }
    };

    return (
      <div
        {...customProps}
        role="combobox"
        aria-disabled={!!disabled}
        aria-expanded={!!this.state.isOpen}
        className={selectClasses}
        onClick={this.openDropdown}
        onKeyDown={this.handleKeyDown}
        onFocus={this.handleFocus}
        tabIndex={disabled ? '-1' : '0'}
        ref={(ref) => { this.select = ref; }}
      >
        {display()}
        <div className={cx('toggle')} onClick={this.toggleDropdown}>
          <span className={cx('select-arrow')} />
        </div>
        {this.state.isOpen &&
          <Dropdown {...dropdownAttrs} onRequestClose={this.closeDropdown} target={this.select}>
            {dropdown &&
               dropdown({
                 variant,
                 value: selectedValue,
                 noResultContent,
                 optionFilter,
                 onDeselect,
                 onSelect: this.handleSelect,
                 onRequestClose: this.closeDropdown,
                 searchValue: this.state.searchValue,
               })}
          </Dropdown>
        }
      </div>
    );
  }
}

SelectRaw.Option = Option;
SelectRaw.OptGroup = OptGroup;
SelectRaw.propTypes = propTypes;
SelectRaw.defaultProps = defaultProps;

export default SelectRaw;
