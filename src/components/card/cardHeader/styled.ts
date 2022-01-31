import tw, { styled, css } from 'twin.macro';

const StyledText = styled.p<{ $isTitle?: true; $isAuthor?: true }>`
  ${({ $isTitle }) => $isTitle && css`
    ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap pr-1 hover:opacity-80`};
    font-size: 1.625rem;
    letter-spacing: -1.5px;
    text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
  `};
  ${({ $isAuthor }) => $isAuthor && css`${tw`text-trueGray-900 font-Charm-400 whitespace-nowrap`}`};
`;

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
`;

export { StyledText, StyledOverflowText };