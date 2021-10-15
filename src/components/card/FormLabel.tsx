import React, { useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { CgCheckO, CgCloseO } from 'react-icons/cg';


interface FormLabelPropsITF {
  type: 'input' | 'textarea';
  label: string;
  name: string;
  value: string | number;
  placeholder: string;
  submitStatus: boolean[];
  handleInputChange: Function;
  optionalFunction?: Function;
}

const Label = styled.label`
  ${tw`relative text-sm select-none`}
`;

const SubmitIndicatorContainer = styled.div<{$indicator: 'check' | 'close'; $indicatorTimer: number}>`
  ${tw`absolute top-0 -right-4 h-full flex items-center`};
  ${({ $indicator }) => $indicator === 'check' ? css`${tw`text-green-600`}` : css`${tw`text-red-600`}`}
  --flipDuration: ${({ $indicatorTimer }) => `${$indicatorTimer / 2}ms`};
  &.flip-enter {
    transform: rotateX(90deg);
  }
  &.flip-enter-active {
    transform: rotateX(0);
    transition: all var(--flipDuration) linear var(--flipDuration);
  }
  &.flip-exit {
    transform: rotateX(0);
  }
  &.flip-exit-active {
    transform: rotateX(90deg);
    transition: all var(--flipDuration) linear;
  }
`;

const FocusIndicator = styled.div`
  ${tw`h-auto w-1 rounded-tl rounded-bl bg-trueGray-50`};
  transition: all 100ms linear;
`;

const Input = styled.input`
  ${tw`text-base rounded-tr rounded-br w-full pl-1 bg-trueGray-50 bg-opacity-20 border-b border-trueGray-50 outline-none`};
  transition: all 100ms linear;
  &:focus {
    ${tw`border-teal-500`};
  }
  &:focus + ${FocusIndicator} {
    ${tw`bg-teal-500`};
  }
`;

const TextArea = styled.textarea`
  ${tw`rounded-tr rounded-br w-full p-1 bg-trueGray-50 bg-opacity-20 border-b border-trueGray-50 outline-none overflow-auto resize-none cursor-auto`};
  transition: all 100ms linear;
  &:focus {
    ${tw`border-teal-500`};
  }
  &:focus + ${FocusIndicator} {
    ${tw`bg-teal-500`};
  }
  ::-webkit-scrollbar {
    ${tw`bg-trueGray-50 bg-opacity-60 w-2 rounded-r`}
  }
  ::-webkit-scrollbar-thumb {
    ${tw`bg-trueGray-400 bg-opacity-70 rounded-r`}
    &:hover {
      ${tw`bg-teal-500`}
    }
  }
`;

const FormLabel = ({type, label, name, value, placeholder, submitStatus, handleInputChange, optionalFunction}: FormLabelPropsITF) => {
  const [ isSubmitSuccess, isSubmitFail ] = submitStatus;
  const indicatorSuccessRef = useRef<HTMLDivElement>(null);
  const indicatorFailRef = useRef<HTMLDivElement>(null);
  const indicatorTimer = 600;

  return (
    <div className='mb-0.5' {...(type === 'textarea' && {className: 'h-full w-full'})}>
      <Label onClick={e => e.preventDefault()}>
        {label}:
        <CSSTransition in={isSubmitSuccess} timeout={indicatorTimer} classNames='flip' nodeRef={indicatorSuccessRef} unmountOnExit>
          <SubmitIndicatorContainer ref={indicatorSuccessRef} $indicator='check' $indicatorTimer={indicatorTimer}>
            <CgCheckO size={15} />
          </SubmitIndicatorContainer>
        </CSSTransition>
        <CSSTransition in={isSubmitFail} timeout={indicatorTimer} classNames='flip' nodeRef={indicatorFailRef} unmountOnExit>
          <SubmitIndicatorContainer ref={indicatorFailRef} $indicator='close' $indicatorTimer={indicatorTimer}>
            <CgCloseO size={15} />
          </SubmitIndicatorContainer>
        </CSSTransition>
        <div className='flex flex-row-reverse' {...(type === 'textarea' && {style: {height: '90%'}})}>
          {type === 'input'
            ? <Input type='text' name={name} placeholder={placeholder} value={value} onChange={e => handleInputChange(e)} {...(optionalFunction && {onKeyDown: e => optionalFunction(e)})} spellCheck={false} autoComplete='off' />
            : <TextArea name={name} placeholder={placeholder} value={value} onChange={e => handleInputChange(e)} spellCheck={false} autoComplete='off' />
          }
          <FocusIndicator />
        </div>
      </Label>
    </div>
  )
}

export default FormLabel;