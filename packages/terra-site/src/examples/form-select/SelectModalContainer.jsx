import React from 'react';
import Select from 'terra-form-select';
import Button from 'terra-button';
import AppDelegate from 'terra-app-delegate';
// Example Files
import RawSelect from '../../../../terra-form-select/src/SelectRaw';
import DropdownMenu from '../../../../terra-form-select/src/_Menu';

class RawExample extends React.Component {
  constructor() {
    super();

    this.state = { value: ['1'] };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleDeselect = this.handleDeselect.bind(this);
  }

  handleChange(value) {
    this.setState({ value });
  }

  handleDeselect(value) {
    this.setState({ value: this.state.value.filter(val => val !== value) });
  }

  handleSelect(value) {
    this.setState({ value: [...this.state.value, value] });
  }

  render() {
    const options = [];

    for (let index = 0; index < 200; index += 1) {
      options.push(<RawSelect.Option key={`${index}`} value={`${index}`} display={`${index}`} />);
    }

    const rawValue = this.state.value.map(value => (
      { value, display: value }
    ));

    return (
      <RawSelect
        placeholder="Select"
        value={rawValue}
        isSearchable
        onSelect={this.handleSelect}
        onDeselect={this.handleDeselect}
        noResultContent="Oh Snap, nothing found here jim"
        variant="tag"
        dropdown={props => (
          <DropdownMenu {...props}>
            {options}
          </DropdownMenu>
        )}
      />
    );
  }
}

class ModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.disclose = this.disclose.bind(this);
    this.closeDisclosure = this.closeDisclosure.bind(this);
  }

  disclose(size) {
    return () => {
      const identifier = Date.now();

      this.props.app.disclose({
        preferredType: 'modal',
        size,
        content: {
          key: `SelectInModalExample-${identifier}`,
          name: 'SelectInModalExample',
          props: {
            identifier: `SelectInModalExample-${identifier}`,
          },
        },
      });
    };
  }

  closeDisclosure() {
    this.props.app.closeDisclosure();
  }

  modalContent(props) {
    return (
      <div className="content-container" style={{ height: '100%', padding: '10px' }}>
        {props.app && props.app.releaseFocus ? <h4>Modal focus is released!</h4> : null }
        {props.app && props.app.requestFocus ? <h4>Modal focus is trapped!</h4> : null }
        <br />
        <form>
          <Select
            name="zibby"
            defaultValue="snappers"
            required
            onChange={this.handleChange}
          >
            <Select.Option value="puppies" display="Puppies" key="puppies" />
            <Select.Option value="kittens" display="Kittens" key="kittens" />
            <Select.Option value="snappers" display="Snappers" key="snappers" />
            <Select.Option value="bumblers" display="Bumblers" disabled key="bumblers" />
            <Select.Option value="joeys" display="Joeys" key="joeys" />
            <Select.Option value="micros" display="Microprocessors" disabled key="micros" />
          </Select>

          <RawExample />
        </form>
        <br />
        <br />
        <Button className="close-disclosure" text="Close Disclosure" onClick={this.closeDisclosure} />
      </div>
    );
  }

  render() {
    const { app } = this.props;
    const content = this.modalContent(this.props);
    const triggerButton = <Button className="disclose" text="Disclose Modal" onClick={this.disclose()} />;

    return (
      app && app.closeDisclosure ? content : triggerButton
    );
  }
}

ModalContainer.propTypes = {
  app: AppDelegate.propType,
};

AppDelegate.registerComponentForDisclosure('SelectInModalExample', ModalContainer);

export default ModalContainer;
