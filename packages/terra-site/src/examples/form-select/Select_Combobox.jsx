import React from 'react';
import RawSelect from '../../../../terra-form-select/src/SelectRaw';
import DropdownMenu from '../../../../terra-form-select/src/_Menu';

const colors = ['Amaranth', 'Amber', 'Amethyst', 'Apricot', 'Aquamarine', 'Azure', 'Baby blue', 'Beige', 'Black', 'Blue', 'Blue-green', 'Blue-violet', 'Blush', 'Bronze', 'Brown', 'Burgundy', 'Byzantium', 'Carmine', 'Cerise', 'Cerulean', 'Champagne', 'Chartreuse green', 'Chocolate', 'Cobalt blue', 'Coffee', 'Copper', 'Coral', 'Crimson', 'Cyan', 'Desert sand', 'Electric blue', 'Emerald', 'Erin', 'Gold', 'Gray', 'Green', 'Harlequin', 'Indigo', 'Ivory', 'Jade', 'Jungle green', 'Lavender', 'Lemon', 'Lilac', 'Lime', 'Magenta', 'Magenta rose', 'Maroon', 'Mauve', 'Navy blue', 'Ocher', 'Olive', 'Orange', 'Orange-red', 'Orchid', 'Peach', 'Pear', 'Periwinkle', 'Persian blue', 'Pink', 'Plum', 'Prussian blue', 'Puce', 'Purple', 'Raspberry', 'Red', 'Red-violet', 'Rose', 'Ruby', 'Salmon', 'Sangria', 'Sapphire', 'Scarlet', 'Silver', 'Slate gray', 'Spring bud', 'Spring green', 'Tan', 'Taupe', 'Teal', 'Turquoise', 'Violet', 'Viridian', 'White', 'Yellow'];

class Default extends React.Component {
  constructor() {
    super();

    this.state = { value: 'Blue' };
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(value) {
    this.setState({ value });
  }

  render() {
    const options = [];

    for (let index = 0; index < colors.length; index += 1) {
      options.push(<RawSelect.Option key={`${colors[index]}`} value={`${colors[index]}`} display={`${colors[index]}`} />);
    }

    return (
      <RawSelect
        value={{ value: this.state.value, display: this.state.value }}
        onSelect={this.handleSelect}
        variant="combobox"
        dropdownAttrs={{ style: { maxHeight: 300 } }}
        dropdown={props => (
          <DropdownMenu {...props}>
            {options}
          </DropdownMenu>
        )}
      />
    );
  }
}

export default Default;
