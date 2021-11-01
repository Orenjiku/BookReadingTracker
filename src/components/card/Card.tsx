import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { BookITF, /* ReaderBookITF */ } from '../../interfaces/interface';
import { sortByLastName } from './utils';
import CardFront from './CardFront';
import CardBack from './CardBack';
import { cloneDeep } from 'lodash';


const CardContainer = styled.div`
  ${tw`relative m-5`};
  --card-width: 360px;
  --card-height: 378px;
  min-width: var(--card-width);
  max-width: var(--card-width);
  min-height: var(--card-height);
  max-height: var(--card-height);
  transform-style: preserve-3d;
`;

const Card = ({ book }: { book: BookITF }) => {
  const [ isFlipped, setIsFlipped ] = useState<boolean>(false);
  const handleFlip = () => setIsFlipped(isFlipped => !isFlipped);
  const flipTimer = 600;

  const { reader_book: readerBookInfo, author: authorInfo, ...bookInfo } = book;

  const [ bookDetails, setBookDetails ] = useState(bookInfo);
  const [ authorDetails, setAuthorDetails ] = useState(authorInfo);
  const [ readerBook, setReaderBook ] = useState(readerBookInfo);

  const handleUpdateBookDetails = (updatedBookDetails: {[key: string]: string | number}) => {
    setBookDetails(prevBookDetails => ({...prevBookDetails, ...updatedBookDetails}));
  };

  const handleUpdateAuthorDetails = (updatedAuthorDetails: string[]) => {
    const sortedUpdatedAuthorDetails = sortByLastName([...updatedAuthorDetails])
    setAuthorDetails(sortedUpdatedAuthorDetails);
  };

  const handleUpdateReadEntryCurrentPercent = (totalPages: number) => {
    const readerBookCopy = cloneDeep(readerBook);
    for (let readInstance of readerBookCopy.read_instance) {
      for (let readEntry of readInstance.read_entry) {
        readEntry.current_percent = Number((readEntry.current_page / totalPages * 100).toFixed(2));
      }
    }
    setReaderBook(readerBookCopy);
  };

  return (
    <CardContainer>
      <CardFront bookDetails={bookDetails} author={authorDetails} readerBook={readerBook} isFlipped={isFlipped} flipTimer={flipTimer} handleFlip={handleFlip} />
      <CardBack bookDetails={bookDetails} author={authorDetails} isFlipped={isFlipped} flipTimer={flipTimer} handleFlip={handleFlip} handleUpdateBookDetails={handleUpdateBookDetails} handleUpdateAuthorDetails={handleUpdateAuthorDetails} handleUpdateReadEntryCurrentPercent={handleUpdateReadEntryCurrentPercent} />
    </CardContainer>
  )
}

export default Card;