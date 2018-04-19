import React from 'react';
import MenuItem from '../../src/MenuItem';

// Snapshot Tests
it('should render with className', () => {
  const item = shallow(<MenuItem className="textClass" />);
  expect(item).toMatchSnapshot();
});

it('should render with text', () => {
  const item = shallow(<MenuItem text="Text" />);
  expect(item).toMatchSnapshot();
});

it('should render with selected', () => {
  const item = shallow(<MenuItem isSelected />);
  expect(item).toMatchSnapshot();
});

it('should render with isSelectable', () => {
  const item = shallow(<MenuItem isSelectable />);
  expect(item).toMatchSnapshot();
});

it('should render as disabled', () => {
  const item = shallow(<MenuItem isDisabled />);
  expect(item).toMatchSnapshot();
});
