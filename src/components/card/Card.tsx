import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import { BookITF } from '../../interfaces/interface';
import CardFront from './CardFront';
import CardBack from './CardBack';


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

  const { reader_book: readerBook, author: authorInfo, ...bookInfo } = book;

  const [ bookDetails, setBookDetails ] = useState(bookInfo);
  const [ authorDetails, setAuthorDetails ] = useState(authorInfo);

  const handleUpdateBookDetails = (updatedBookDetails: {[key: string]: string | number}) => {
    setBookDetails(prevBookDetails => ({...prevBookDetails, ...updatedBookDetails}));
  };

  const handleUpdateAuthorDetails = (updatedAuthorDetails: string[]) => {
    const sortedUpdatedAuthorDetails = [...updatedAuthorDetails].sort((a, b) => {
      const lastNameA = a.split(' ').slice(-1)[0];
      const lastNameB = b.split(' ').slice(-1)[0];
      return lastNameA.localeCompare(lastNameB);
    })
    setAuthorDetails(sortedUpdatedAuthorDetails);
  };

  return (
    <CardContainer>
      <CardFront bookDetails={bookDetails} author={authorDetails} readerBook={readerBook} isFlipped={isFlipped} flipTimer={flipTimer} handleFlip={handleFlip} />
      <CardBack bookDetails={bookDetails} author={authorDetails} isFlipped={isFlipped} flipTimer={flipTimer} handleFlip={handleFlip} handleUpdateBookDetails={handleUpdateBookDetails} handleUpdateAuthorDetails={handleUpdateAuthorDetails}/>
    </CardContainer>
  )
}

export default Card;