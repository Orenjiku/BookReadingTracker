import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { BookITF, ReaderBookITF } from '../../interfaces/interface';
import { sortByLastName } from './common/utils';
import CardFront from './CardFront';
import CardBack from './cardBack/CardBack';


interface CardPropsITF {
  book: BookITF;
  handleUpdateBookList: Function;
}
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

const Card = ({ book, handleUpdateBookList }: CardPropsITF) => {
  const [ isFlipped, setIsFlipped ] = useState<boolean>(false);
  const handleFlip = () => setIsFlipped(isFlipped => !isFlipped);
  const flipTimer = 600;
  const indicatorTransitionTimer = 300; //set transition time for success/fail indication on FormLabels used on both CardFront and CardBack components.

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

  const handleUpdateReaderBook = (readerBookAPI: ReaderBookITF) => {
    setReaderBook(readerBookAPI);
  };

  return (
    <CardContainer>
      <CardFront bookDetails={bookDetails} author={authorDetails} readerBook={readerBook} isFlipped={isFlipped} flipTimer={flipTimer} indicatorTransitionTimer={indicatorTransitionTimer} handleFlip={handleFlip} handleUpdateReaderBook={handleUpdateReaderBook} handleUpdateBookList={handleUpdateBookList} />
      <CardBack bookDetails={bookDetails} author={authorDetails} readerBookId={readerBook.rb_id} isFlipped={isFlipped} flipTimer={flipTimer} handleFlip={handleFlip} indicatorTransitionTimer={indicatorTransitionTimer} handleUpdateBookDetails={handleUpdateBookDetails} handleUpdateAuthorDetails={handleUpdateAuthorDetails} handleUpdateReaderBook={handleUpdateReaderBook} />
    </CardContainer>
  )
}

export default Card;