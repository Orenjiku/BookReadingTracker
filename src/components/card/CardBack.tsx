import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { BsPlusSquare } from 'react-icons/bs';
// import { RiDeleteBack2Line } from 'react-icons/ri';
import { BookDetailsITF } from '../../interfaces/interface';
import AuthorTag from './AuthorTag';

interface CardBackPropsITF {
  bookDetails: BookDetailsITF;
  authorDetails: {ba_id: number, full_name: string}[];
  isFlipped: boolean;
  handleFlip: Function;
}

const CardBackContainer = styled.div<{ $isFlipped: boolean}>`
  ${tw`absolute h-full w-full grid grid-cols-2 grid-rows-21`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(180deg);
  transition: transform 600ms linear;
  ${({ $isFlipped }) => $isFlipped
    ? css`transform: perspective(1200px) rotateY(0deg);`
    : css`pointer-events: none;`}
`;

const FormContainer = styled.div`
  ${tw`row-start-3 row-end-20 col-start-1 col-end-3 mx-2 px-3 pt-2 pb-6 border border-trueGray-400 rounded-2xl overflow-y-scroll scrollbar-hide`}
`;

const Label = styled.label`
  ${tw`text-sm`}
`;

const InputContainer = styled.div`
  ${tw`flex flex-row-reverse mb-1`}
`

const InputTab = styled.div`
  ${tw`h-auto w-1 rounded-tl rounded-bl bg-trueGray-50`};
  transition: all 300ms linear;
`;

const Input = styled.input`
  ${tw`text-base rounded-tr rounded-br w-full pl-1 bg-trueGray-50 bg-opacity-20 border-b border-trueGray-50 outline-none`};
  transition: all 300ms linear;
  &:focus {
    ${tw`border-red-500 border-opacity-60`};
  }
  &:focus + ${InputTab} {
    ${tw`bg-red-500 bg-opacity-60`};
  }
`;

const StyledBsPlusSquare = styled(BsPlusSquare)`
  ${tw`ml-1 stroke-current text-trueGray-100 cursor-pointer`};
`;

const CardBack = ({ bookDetails, authorDetails, isFlipped, handleFlip }: CardBackPropsITF) => {
  const [ title, setTitle ] = useState(bookDetails.title);
  const [ authorList, setAuthorList ] = useState(authorDetails);
  const [ newAuthor, setNewAuthor ] = useState('');
  const [ newAuthorList, setNewAuthorList ] = useState<string[]>([]);
  const [ totalPages, setTotalPages ] = useState(bookDetails.total_pages);
  const [ publishedDate, setPublishedDate ] = useState(bookDetails.published_date);
  const [ publishedDateEdition, setPublishedDateEdition ] = useState(bookDetails.published_date_edition);
  const [ format, setFormat] = useState(bookDetails.book_format);
  const [ pictureLink, setPictureLink ] = useState(bookDetails.picture_link);

  useEffect(() => {
    handleReset();
  }, [isFlipped]);

  const handleReset = () => {
    setTitle(bookDetails.title);
    setFormat(bookDetails.book_format);
    setTotalPages(bookDetails.total_pages);
    setAuthorList(authorDetails);
    setPublishedDate(bookDetails.published_date);
    setPublishedDateEdition(bookDetails.published_date_edition);
    setPictureLink(bookDetails.picture_link);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'title') setTitle(e.target.value);
    else if (e.target.name === 'newAuthor') setNewAuthor(e.target.value);
    else if (e.target.name === 'totalPages') setTotalPages(Number(e.target.value));
    else if (e.target.name === 'publishedDate') setPublishedDate(e.target.value);
    else if (e.target.name === 'publishedDateEdition') setPublishedDateEdition(e.target.value);
    else if (e.target.name === 'format') setFormat(e.target.value);
    else if (e.target.name === 'pictureLink') setPictureLink(e.target.value);
  };

  const handleAddAuthor = () => {
    if (newAuthor !== '' && !authorList.find(author => author.full_name === newAuthor) && !newAuthorList.find(author => author === newAuthor)) {
      setNewAuthorList([...newAuthorList, newAuthor]);
      setNewAuthor('');
    }
  };

  const handleDeleteAuthor = (ba_id: number) => {
    const authorListClone = [...authorList];
    const idx = authorListClone.findIndex(author => author.ba_id === ba_id);
    authorListClone.splice(idx, 1);
    setAuthorList(authorListClone);
  };

  return (
    <CardBackContainer $isFlipped={isFlipped}>
      <FormContainer>
        <form>

          <Label onClick={e => e.preventDefault()}>Title:
            <InputContainer>
              <Input type='text' name='title' placeholder='Title' value={title} onChange={handleInputChange} spellCheck={false}></Input>
              <InputTab />
            </InputContainer>
          </Label>

          <div className='flex'>
            <Label className='mr-1' onClick={e => e.preventDefault()}>Format:
              <InputContainer>
                <Input type='text' name='format' placeholder='Format' value={format} onChange={handleInputChange}></Input>
                <InputTab />
              </InputContainer>
            </Label>
            <Label className='ml-1' onClick={e => e.preventDefault()}>Total Pages:
              <InputContainer>
                <Input type='text' name='totalPages' placeholder='Total Pages' value={totalPages} onChange={handleInputChange}></Input>
                <InputTab />
              </InputContainer>
            </Label>
          </div>

          <Label onClick={e => e.preventDefault()}>Author:
            <div className='flex'>
              <InputContainer>
                <Input type='text' name='newAuthor' value={newAuthor} onChange={handleInputChange} spellCheck={false}></Input>
                <InputTab />
              </InputContainer>
              <StyledBsPlusSquare size={25} onClick={handleAddAuthor}/>
            </div>
          </Label>

          <div className='flex flex-wrap'>
            {/* {newAuthorList.length > 0 && newAuthorList.map(author =>
              <AuthorTag key={author.ba_id} author={author} handleDeleteAuthor={handleDeleteAuthor} />
            )} */}
            {authorList.length > 0 && authorList.map(author =>
              <AuthorTag key={author.ba_id} author={author} handleDeleteAuthor={handleDeleteAuthor} />
            )}
          </div>

          <div className='flex'>
            <Label className='mr-1' onClick={e => e.preventDefault()}>Date Published:
              <InputContainer>
                <Input type='text' name='publishedDate' placeholder='Published Date' value={publishedDate} onChange={handleInputChange}></Input>
                <InputTab />
              </InputContainer>
            </Label>
            <Label className='ml-1' onClick={e => e.preventDefault()}>Edition Published:
              <InputContainer>
                <Input type='text' name='publishedDateEdition' placeholder='Published Date Edition' value={publishedDateEdition} onChange={handleInputChange}></Input>
                <InputTab />
              </InputContainer>
            </Label>
          </div>

          <Label onClick={e => e.preventDefault()}>Picture Link:
            <InputContainer>
              <Input type='text' name='pictureLink' placeholder='Picture Link' value={pictureLink} onChange={handleInputChange} spellCheck={false}></Input>
              <InputTab />
            </InputContainer>
          </Label>

        </form>
      </FormContainer>

      <div className='row-start-20 row-end-22 col-start-1 col-end-3 flex items-center justify-end'>
        <button className='h-7 w-28 bg-blueGray-800' onClick={() => handleFlip()} ></button>
      </div>

    </CardBackContainer>
  )
}

export default CardBack;