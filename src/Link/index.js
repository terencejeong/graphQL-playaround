import React from 'react';

// this gets the props from the parent component, and then also the children from the parent component.
const Link = ({ children, ...props }) => {
  return (
    <a{...props} target="_blank">
      {children}
    </a>
  )
};

export default Link;