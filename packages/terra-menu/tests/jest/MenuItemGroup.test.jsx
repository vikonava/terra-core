import React from 'react';
import MenuItem from '../../src/MenuItem';
import MenuItemGroup from '../../src/MenuItemGroup';

it('should mount with children', () => {
  const itemGroup = mount(<MenuItemGroup><MenuItem /></MenuItemGroup>);
  expect(itemGroup).toMatchSnapshot();
});

it('should mount with a selected child', () => {
  const itemGroup = mount(<MenuItemGroup><MenuItem isSelected /></MenuItemGroup>);
  expect(itemGroup).toMatchSnapshot();
});
