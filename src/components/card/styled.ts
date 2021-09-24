import tw, { styled, css } from 'twin.macro';

const StyledText = styled.p<{ bookTitle?: true; author?: true }>`
  ${({ bookTitle }) => bookTitle && css`
    ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap pr-1 hover:opacity-80`};
    font-size: 1.625rem;
    letter-spacing: -1.5px;
    text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  `};
  ${({ author }) => author && css`${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`}`};
`

const StyledOverflowText = styled(StyledText)<{ $offsetRight: number; $isTranslatingLeft: boolean; $isEllipsis: boolean }>`
  ${tw`cursor-pointer`};
  ${({ $isEllipsis }) => $isEllipsis && css`${tw`truncate`}`};
  --distance: ${({ $offsetRight }) => $offsetRight};
  --rate: 50;
  --duration: calc(var(--distance) / var(--rate) * 1s);
  transform: translateX(0%);
  transition: transform var(--duration) linear;
  ${({ $isTranslatingLeft }) => $isTranslatingLeft && css`
    transform: translateX(calc(var(--distance) * -1px));
    transition: transform var(--duration) linear;
  `};
`

export { StyledText, StyledOverflowText }