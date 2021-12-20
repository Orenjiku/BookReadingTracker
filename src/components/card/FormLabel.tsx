import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import SuccessIndicator from './SuccessIndicator'


interface FormLabelPropsITF {
  type: 'text' | 'number' | 'textarea';
  label: string;
  name: string;
  value: string | number;
  placeholder: string;
  submitStatus: boolean[];
  feedbackText: string;
  handleInputChange: Function;
  handleReset: Function;
  handleEnter?: Function;
}

const Label = styled.label`
  ${tw`relative text-sm select-none`};
`;

const FocusIndicator = styled.div`
  ${tw`h-auto w-1 rounded-tl rounded-bl bg-trueGray-50`};
  transition: all 100ms linear;
`;

const textInputMixin = css`
  ${tw`text-base rounded-tr rounded-br w-full pl-1 bg-trueGray-50 bg-opacity-20 border-b border-trueGray-50 outline-none`};
  transition: all 100ms linear;
  &:focus {
    ${tw`border-teal-500`};
  }
  &:focus + ${FocusIndicator} {
    ${tw`bg-teal-500`};
  }
`;

const Input = styled.input<{type: 'text' | 'number'}>`
  ${textInputMixin}
  ${({ type }) => type === 'number' && css`
    ::-webkit-inner-spin-button {
      display: none;
    }
  `}
`;

const TextArea = styled.textarea`
  ${textInputMixin}
  ${tw`text-sm`}
  ::-webkit-scrollbar {
    ${tw`bg-trueGray-50 bg-opacity-60 w-2 rounded-r`};
  }
  ::-webkit-scrollbar-thumb {
    ${tw`bg-trueGray-400 bg-opacity-70 rounded-r`};
    &:hover {
      ${tw`bg-teal-500`};
    }
  }
`;

const FeedbackTextContainer = styled.div<{$isFeedbackText: boolean; $indicatorTransitionTimer: number}>`
  ${tw`absolute whitespace-nowrap -top-2 ml-4 text-xs text-red-500 select-none opacity-0`};
  --duration: ${({ $indicatorTransitionTimer }) => `${$indicatorTransitionTimer}ms`};
  transition: opacity var(--duration) linear var(--duration);
  ${({ $isFeedbackText }) => $isFeedbackText && css`
    ${tw`opacity-100`}
  `}
`;

const FormLabel = ({type, label, name, value, placeholder, submitStatus, feedbackText, handleInputChange, handleReset, handleEnter}: FormLabelPropsITF) => {
  const [ isSuccess, isFail ] = submitStatus;
  const [ isFeedbackText, setIsFeedbackText ] = useState(false);
  const indicatorTransitionTimer = 300;

  useEffect(() => {
    isSuccess || isFail ? setIsFeedbackText(true) : setIsFeedbackText(false);
  }, [isSuccess, isFail]);

  return (
    <div className='mb-0.5' {...(type === 'textarea' && {className: 'h-full w-full'})}>
      <Label onClick={e => e.preventDefault()}>
        <div className='flex items-center'>
          <p className='mr-0.5'>{label}:</p>
          <div className='relative'>
            <SuccessIndicator size={13} isSuccess={isSuccess} isFail={isFail} indicatorTransitionTimer={indicatorTransitionTimer} />
            <FeedbackTextContainer $isFeedbackText={isFeedbackText} $indicatorTransitionTimer={indicatorTransitionTimer}>{feedbackText}</FeedbackTextContainer>
          </div>
        </div>
        <div className='flex flex-row-reverse' {...(type === 'textarea' && {style: {height: '90%'}})}>
          {type === 'text' || type === 'number'
            ? <Input type={type} name={name} placeholder={placeholder} value={value} onClick={() => handleReset(name)} onChange={e => handleInputChange(e)} {...(handleEnter && {onKeyDown: e => handleEnter(e)})} spellCheck={false} autoComplete='off' />
            : <TextArea name={name} placeholder={placeholder} value={value} onClick={() => handleReset(name)} onChange={e => handleInputChange(e)} spellCheck={false} autoComplete='off' />
          }
          <FocusIndicator />
        </div>
      </Label>
    </div>
  )
}

export default FormLabel;