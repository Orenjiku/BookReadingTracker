import React, { useState, useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookITF } from '../interfaces/interface';
import Card from '../components/card/Card';
import NewBook from '../components/card/NewBook';
import { BsPlusSquareFill } from 'react-icons/bs';


const StyledBsPlusSquareFill = styled(BsPlusSquareFill)`
  ${tw`stroke-current text-blueGray-200 text-opacity-40 cursor-pointer`}
  &:hover {
    ${tw`stroke-current text-blueGray-500 text-opacity-40`}
  }
`;

const CreateBookContainer = styled.div`
  ${tw`flex justify-center`}
  &.slide-enter {
    transform: translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateY(0%);
    transition: all 300ms linear;
  }
  &.slide-exit {
    transform: translateY(0%);
  }
  &.slide-exit-active {
    transform: translateY(-100%);
    transition: all 300ms linear;
  }
`;

const CurrentlyReading = () => {
  const [ currentlyReadingList, setCurrentlyReadingList ] = useState<BookITF[]>([]);
  const [ isCreate, setIsCreate ] = useState(false);

  useEffect(() => {
    getCurrentlyReadingList();
  }, []);

  const getCurrentlyReadingList = async () => {
    try {
      const response = await fetch('http://localhost:3000/1/currently_reading');
      const result = await response.json();
      setCurrentlyReadingList(result);
    } catch(err) {
      console.error(err);
    }
  };

  const handleCreate = (input: boolean) => {
    setIsCreate(input);
  };

  const handleUpdateBookList = (readingList: BookITF[]) => {
    setCurrentlyReadingList(readingList);
  };

  return (
    <div className='h-full w-full'>
      <div className='flex justify-start items-center' onClick={() => handleCreate(true)}>
        <StyledBsPlusSquareFill size={30} />
        <p>Add New Book</p>
      </div>
      <div className='flex justify-center overflow-hidden z-10'>
        <CSSTransition in={isCreate} timeout={500} classNames='slide' unmountOnExit>
          <CreateBookContainer>
            <NewBook category={'isReading'} handleCreate={handleCreate} handleUpdateBookList={handleUpdateBookList} />
          </CreateBookContainer>
        </CSSTransition>
      </div>
      <div className='flex flex-wrap justify-center' >
        {currentlyReadingList.map((book) => {
          return <Card key={`${book.b_id}`} book={{...book, category: 'isReading'}} handleUpdateBookList={handleUpdateBookList} />
        })}
      </div>
    </div>
  )
}

export default CurrentlyReading;