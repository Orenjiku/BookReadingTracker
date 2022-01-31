import tw, { styled, css } from 'twin.macro';

const TextContainer = styled.div<{ $fadeIn: boolean }>`
  ${tw`absolute font-Charm-400 text-lg opacity-0`};
  ${({ $fadeIn }) => $fadeIn && css`
    opacity: 100;
    transition: opacity 100ms linear 250ms;
  `};
`;

export default TextContainer;