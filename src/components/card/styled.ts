import tw, { styled, css } from 'twin.macro';

const StyledText = styled.p<{ $isTitle?: true; $isAuthor?: true }>`
  ${({ $isTitle }) => $isTitle && css`
    ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap pr-1 hover:opacity-80`};
    font-size: 1.625rem;
    letter-spacing: -1.5px;
    text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  `};
  ${({ $isAuthor }) => $isAuthor && css`${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`}`};
`

const StyledOverflowText = styled(StyledText)<{ $isTranslatingLeft: boolean; $isEllipsis: boolean; $offsetRight: number; $isFlipped: boolean }>`
  ${tw`cursor-pointer`};
  ${({ $isEllipsis }) => $isEllipsis && css`${tw`truncate`}`};
  --distance: ${({ $offsetRight }) => $offsetRight};
  --rate: 50;
  --duration: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  ${({ $isFlipped }) => $isFlipped
    ? css`transition: none;`
    : css`transition: transform var(--duration) linear;`
  };
  ${({ $isTranslatingLeft }) => $isTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--duration) linear;
  `};
`

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
const SaveButton = styled(StyledButton)<{$isStartSubmit?: boolean; $submitHoldTimer?: number}>`
  &:active {
    ${tw`bg-blueGray-400 bg-opacity-30`};
  }
  &::after {
    content: '';
    ${tw`absolute h-full w-0 left-0 bg-teal-500 bg-opacity-40`};
    z-index: -1;
    transition: all 100ms linear;
    ${({ $isStartSubmit, $submitHoldTimer }) => $isStartSubmit && css`
      ${tw`h-full w-full`};
      transition: all ${$submitHoldTimer}ms linear;
    `}
  }
`;

export { StyledText, StyledOverflowText, StyledButton, SaveButton }