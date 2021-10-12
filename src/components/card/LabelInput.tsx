import React, { useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { CgCheckO } from 'react-icons/cg';

const Label = styled.label`
  ${tw`relative text-sm`}
`;

const CheckContainer = styled.div`
  ${tw`absolute top-0 -right-4 h-full flex items-end text-green-600`};
  &.flip-enter {
    transform: rotateX(90deg);
  }
  &.flip-enter-active {
    transform: rotateX(0);
    transition: all 300ms linear;
  }
  &.flip-exit {
    transform: rotateX(0);
  }
  &.flip-exit-active {
    transform: rotateX(90deg);
    transition: all 300ms linear;
  }
`;

const InputContainer = styled.div`
  ${tw`flex flex-row-reverse mb-1`}
`

const InputTab = styled.div`
  ${tw`h-auto w-1 rounded-tl rounded-bl bg-trueGray-50`};
  transition: all 300ms linear;
`;

const Input = styled.input`
  ${tw`text-base rounded-tr rounded-br w-full pl-1 bg-trueGray-50 bg-opacity-20 border-b border-trueGray-50 outline-none`};
  transition: all 300ms linear;
  &:focus {
    ${tw`border-red-500 border-opacity-60`};
  }
  &:focus + ${InputTab} {
    ${tw`bg-red-500 bg-opacity-60`};
  }
`;

interface LabelInputPropsITF {
  label: string;
  name: string;
  value: string | number;
  placeholder: string;
  submitStatus: boolean[];
  handleInputChange: Function;
  additionalFunction?: Function;
}

const LabelInput = ({label, name, value, placeholder, submitStatus, handleInputChange, additionalFunction}: LabelInputPropsITF) => {
  const [ isSubmitInputComplete, isSubmitComplete ] = submitStatus;
  const submitCheckRef = useRef<HTMLDivElement>(null);


  return (
    <div>
      <Label onClick={e => e.preventDefault()}>
        {label}:
        <CSSTransition in={isSubmitInputComplete && isSubmitComplete} timeout={300} classNames='flip' nodeRef={submitCheckRef} unmountOnExit>
          <CheckContainer ref={submitCheckRef}>
            <CgCheckO />
          </CheckContainer>
        </CSSTransition>
        <InputContainer>
          <Input type='text' name={name} placeholder={placeholder} value={value} onChange={e => handleInputChange(e)} {...(additionalFunction && {onKeyDown: e => additionalFunction(e)})} spellCheck={false} autoComplete='off' />
          <InputTab />
        </InputContainer>
      </Label>
    </div>
  )
}

export default LabelInput;