import React from 'react';

type Props = {
  value: "Submit" | "Continue" | "Update";
  processing: boolean;
}

const Button = ({ value, processing}: Props) => {
  return <button>{processing ? "Processing" : value}</button>;
}

export default Button;