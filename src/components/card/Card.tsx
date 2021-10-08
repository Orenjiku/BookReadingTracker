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

  const { reader_book: readerBook, ...bookInfo } = book;
  // const [ bookDetails, setBookDetails ] = useState(bookInfo)
  // const [ authorDetails, setAuthorDetails ] = useState(book.author);

  const bookDetails = bookInfo;
  const author = book.author;

  // const handleUpdateAuthorList = (arr: string[]) => {
  //   //for each author in array insert into sql
  //     //get back ba_id and create new authorDetails object with ba_id and full_name
  // };

  // const handleDeleteAuthorList = (authorIdList: string[]) => {
  //   authorList.forEach(id => {
  //     //send DELETE statement to API
  //   })
  // }

  return (
    <CardContainer>
      <CardFront bookDetails={bookDetails} author={author} readerBook={readerBook} isFlipped={isFlipped} handleFlip={handleFlip} />
      <CardBack bookDetails={bookDetails} author={author} isFlipped={isFlipped} handleFlip={handleFlip} />
    </CardContainer>
  )
}

export default Card;