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

import DefaultSelect from './DefaultSelect';
import InvalidSelect from './InvalidSelect';
import HiddenPlaceholderSelect from './HiddenPlaceholderSelect';
import BlankSelect from './BlankSelect';
import SelectWithoutDefault from './SelectWithoutDefault';
import DisabledSelect from './DisabledSelect';
import SelectInsideModal from './SelectInsideModal';
import BoundedSelect from './BoundedSelect';
import LongTextSelect from './LongTextSelect';

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

    <h2 style={{ marginTop: '700px' }}>Select component with default initial value</h2>
    <DefaultSelect />
    <h2>Invalid select component</h2>
    <InvalidSelect />
    <h2>Select component with placeholder hidden</h2>
    <HiddenPlaceholderSelect />
    <h2>Select component with no default value and placeholder hidden</h2>
    <BlankSelect />
    <h2>Select component with no initial value set</h2>
    <SelectWithoutDefault />
    <h2>Disabled select component</h2>
    <DisabledSelect />
    <h2>Bounded Select</h2>
    <BoundedSelect />
    <h2>Long Text Select</h2>
    <LongTextSelect />
    <h2>Select inside a modal</h2>
    <SelectInsideModal />
  </div>
);

export default SelectExamples;
