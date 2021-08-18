import React from "react";

type Props = {
  onChange: (str: string) => void;
  placeholder: string;
  name: string;
  value?: string;
}

const Input = ({ onChange, name, placeholder, value = '' }: Props) => {
  return (
    <input
      onChange={e => onChange(e.target.value)}
      name={name}
      placeholder={placeholder}
      value={value}
    />
  );
}

export default Input;
