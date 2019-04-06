import React from "react";
import { connect } from "react-redux";
import { getUser } from "../state/user";
import Header from "./layout/header";

function Layout(props) {
  const { children, user } = props;

  return (
    <React.Fragment>
      <Header user={user} />
      {children}
    </React.Fragment>
  );
}

function mapStateToProps(state) {
  return {
    user: getUser(state),
  };
}

export default connect(mapStateToProps)(Layout);
