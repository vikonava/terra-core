/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
// import PropsTable from 'terra-props-table';
// import Markdown from 'terra-markdown';
// import ReadMe from 'terra-form-select/docs/README.md';
// import { version } from 'terra-form-select/package.json';

// Component Source
/* eslint-disable import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions */
// import SelectSrc from '!raw-loader!terra-form-select/src/Select';
// import SelectOptionSrc from '!raw-loader!terra-form-select/src/SelectOption';
/* eslint-enable import/no-webpack-loader-syntax, import/first, import/no-unresolved, import/extensions */

// Example Files
// import RawSelect from '../../../../terra-form-select/src/SelectRaw';
// import DropdownMenu from '../../../../terra-form-select/src/_Menu';
import SelectDefault from './Select_Default';
import SelectMultiple from './Select_Multiple';
import SelectTag from './Select_Tag';
import SelectCombobox from './Select_Combobox';

const SelectExamples = () => (
  <div style={{ margin: '50px', width: '400px' }}>
    <h2>Default Select</h2>
    <SelectDefault />

    <h2>Multiple</h2>
    <SelectMultiple />

    <h2>Tag</h2>
    <SelectTag />

    <h2>Combobox</h2>
    <SelectCombobox />
  </div>
);

export default SelectExamples;
