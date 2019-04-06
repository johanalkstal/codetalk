import React, { useEffect } from "react";
import { connect } from "react-redux";
import { initUI } from "../core/firebase-auth";
import { setUser } from "../state/user";

function SignIn(props) {
  const { setUser } = props;

  useEffect(() => initUI({ onSignIn: setUser }), []);

  return (
    <div className="p-2">
      <div id="firebaseui" />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
});

export default connect(
  null,
  mapDispatchToProps
)(SignIn);
