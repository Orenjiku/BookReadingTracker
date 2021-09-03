import React, {useState} from 'react';
import Input from './Input';
// import Button from './Button';

const Form = () => {
  const [nameInput, setNameInput] = useState('');
  const onChange = (str: string) => {
    setNameInput(str);
  }

  return (
    <form>
      <Input
        onChange={onChange}
        name='name'
        placeholder='Enter you name'
        value={nameInput}
      />
    {/* <Button value='Submit' processing={false} />
    <Button value='Submit' processing={true} /> */}
    </form>
  )
}

export default Form;