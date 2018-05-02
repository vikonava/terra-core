import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import Dropdown from './_Dropdown';
import Option from './_Option';
import OptGroup from './_OptGroup';
import Tag from './_Tag';
import SelectUtils from './_SelectUtils';
import styles from './_Frame.scss';

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
  placeholder: undefined,
  value: undefined,
  variant: Variants.DEFAULT,
};

// TODO:
/* eslint-disable jsx-a11y/no-static-element-interactions */
class Frame extends React.Component {
  /**
   * Converts the value object into a pure value.
   * @param {string} variant - The component variant.
   * @param {Object} value - The object value of the component.
   * @return {array|string|null} - The pure component value.
   */
  static value({ variant, value }) {
    if (!value) {
      return null;
    } else if (variant === Variants.MULTIPLE || variant === Variants.TAG) {
      return value.map(option => option.value);
    }
    return value.value;
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, searchValue: '' };

    this.setInput = this.setInput.bind(this);
    this.getDisplay = this.getDisplay.bind(this);
    this.closeDropdown = this.closeDropdown.bind(this);
    this.openDropdown = this.openDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
  }

  componentDidUpdate() {
    if (this.input && this.input !== document.activeElement) {
      this.input.focus();
    }
  }

  setInput(input) {
    this.input = input;
  }

  getDisplay() {
    const { searchValue } = this.state;
    const { onDeselect, placeholder, variant, value } = this.props;

    const inputAttrs = {
      className: cx('input'),
      onBlur: this.handleInputBlur,
      onChange: this.handleSearch,
      onFocus: this.handleInputFocus,
      placeholder,
      ref: this.setInput,
      tabIndex: '-1',
    };

    if (variant === Variants.MULTIPLE || variant === Variants.TAG) {
      const tags = (value || []).map(tag => (
        <Tag value={tag.value} onDeselect={onDeselect} key={tag.value}>{tag.display}</Tag>
      ));

      return <ul className={cx('tags')} id="test">{tags}<input {...inputAttrs} value={searchValue} /></ul>;
    } else if (variant === Variants.COMBOBOX) {
      return <input {...inputAttrs} value={searchValue} />;
    }

    return value ? value.display : <div className={cx('placeholder')}>{placeholder}</div>;
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
      this.setState({ isFocused: true });
    }
  }

  /**
   * Handles keyboard interactions and accessibility.
   * @param {event} event - The onKeyDown event.
   */
  handleKeyDown(event) {
    const { keyCode, target } = event;
    const { BACKSPACE, SPACE, UP_ARROW, DOWN_ARROW } = KeyCodes;

    if (keyCode === SPACE && target !== this.input) {
      event.preventDefault();
      this.openDropdown();
    } else if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
      event.preventDefault();
      this.openDropdown();
    } else if (keyCode === BACKSPACE && !this.state.searchValue && this.props.value.length > 0) {
      this.props.onDeselect(this.props.value[0].value);
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
    this.setState({ searchValue: '', isOpen });

    if (this.props.onSelect) {
      this.props.onSelect(value, option);
    }
  }

  handleInputBlur() {
    this.setState({ isFocused: false, searchValue: '' });
  }

  handleInputFocus() {
    this.setState({ isFocused: true });
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
      { 'is-focused': this.state.isFocused },
      { 'is-disabled': disabled },
      { 'is-invalid': isInvalid },
      { 'is-open': this.state.isOpen },
      customProps.className,
    ]);

    return (
      <div
        {...customProps}
        role="combobox"
        aria-disabled={!!disabled}
        aria-expanded={!!this.state.isOpen}
        className={selectClasses}
        onClick={this.openDropdown}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        tabIndex={(this.state.isFocused || disabled) ? '-1' : '0'}
        ref={(ref) => { this.select = ref; }}
      >
        <div className={cx('display')}>
          {this.getDisplay()}
        </div>
        <div className={cx('toggle')} onClick={this.toggleDropdown}>
          <span className={cx('arrow-icon')} />
        </div>
        {this.state.isOpen &&
          <Dropdown {...dropdownAttrs} onRequestClose={this.closeDropdown} target={this.select}>
            {dropdown &&
               dropdown({
                 variant,
                 value: Frame.value(this.props),
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

Frame.Option = Option;
Frame.OptGroup = OptGroup;
Frame.propTypes = propTypes;
Frame.defaultProps = defaultProps;

export default Frame;
