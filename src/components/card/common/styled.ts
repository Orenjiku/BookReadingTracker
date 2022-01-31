import tw, { styled, css } from 'twin.macro';

const StyledButton = styled.button`
  ${tw`h-auto w-auto py-0.5 px-4 mx-1 rounded border border-coolGray-50 flex justify-center items-center overflow-hidden`};
  ${tw`bg-blueGray-300 bg-opacity-40 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur select-none`};
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-30`};
  }
  &:active {
    ${tw`bg-blueGray-400 bg-opacity-50`};
  }
`;

//SaveButton active bg color should match StyledButton hover bg color to prevent bg color change on active. On hold slide bar will indicate active.
const HoldDownButton = styled(StyledButton)<{$isStartSubmit?: boolean; $submitHoldTimer?: number; $blue?: true; $red?: true}>`
  &:active {
    ${tw`bg-blueGray-400 bg-opacity-30`};
  }
  &::after {
    content: '';
    ${tw`absolute h-full w-0 left-0 bg-teal-500 bg-opacity-40`};
    ${({ $blue }) => $blue && css`${tw`bg-teal-500`};`};
    ${({ $red }) => $red && css`${tw`bg-red-500`};`};
    z-index: -1;
    transition: all 100ms linear;
    ${({ $isStartSubmit, $submitHoldTimer }) => $isStartSubmit && css`
      ${tw`h-full w-full`};
      transition: all ${$submitHoldTimer}ms linear;
    `};
  }
`;

export { StyledButton, HoldDownButton };