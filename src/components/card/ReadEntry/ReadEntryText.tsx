import React from 'react';
import tw, {styled, css } from 'twin.macro';

const TextContainer = styled.div<{ $isEdit: boolean; $before: string; $after: number }>`
  ${tw`relative px-0.5 flex justify-center`};
  ${tw`text-trueGray-900 text-xs font-SortsMillGoudy-400`};
  &::before {
    content: '${({ $before }) => $before}';
    ${tw`absolute left-0`};
  }
  &::after {
    ${({ $isEdit, $after }) => $isEdit
      ? css`
        content: 'pg. ${$after}';
        ${tw`absolute right-0 text-trueGray-900`};
      `
      : css`
        content: '+${$after} pgs';
        ${tw`absolute right-0 text-green-600`};
      `
    }
  }
`;

const ReadEntryText = ({ dateRead, currentPage, pagesRead, currentPercent, isEdit }: { dateRead: Date; currentPage: number; pagesRead: number; currentPercent: number; isEdit: boolean }) => {

  const formatDate = (date: Date) => new Date(date).toLocaleDateString();

  return (
    <TextContainer $isEdit={isEdit} $before={formatDate(dateRead)} $after={isEdit ? currentPage : pagesRead}>{`${currentPercent}%`}</TextContainer>
  )
};

export default ReadEntryText;