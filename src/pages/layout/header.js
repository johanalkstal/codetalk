import React from "react";
import { Link } from "react-router-dom";
import ActionButton from "../../components/action-button";

function Header(props) {
  const { user } = props;

  const linkUrl = user ? "/sign-out" : "/sign-in";
  const label = user ? "Sign out" : "Sign in";

  return (
    <header className="bg-surface border-b flex justify-space-between px-2 py-1">
      <div>
        <Link to="/">
          <h1 className="logo">codetalk.dev</h1>
        </Link>

        <span className="ml-2">{process.env.REACT_APP_VERSION}</span>
      </div>

      <Link to={linkUrl}>
        <ActionButton label={label} />
      </Link>
    </header>
  );
}

export default Header;
