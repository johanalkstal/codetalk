import React from "react";

function ActionButton(props) {
  return (
    <button className="button bg-theme-primary color-theme-on-primary">
      {props.children}
    </button>
  );
}

export default ActionButton;
