import React from "react";

type User = {
  name: string;
};
type Props =
  | {
      authenticated: false;
      profile: null;
    }
  | {
      authenticated: true;
      profile: User;
    };
function Header(props: Props) {
  return (
    <header>
      <a href="/">Home</a>
      <a href="/about">About</a>
      {props.authenticated ? props.profile.name : <a href="/signin">Sign in</a>}
    </header>
  );
}

export default Header;