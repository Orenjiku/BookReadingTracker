import React, { useState, useEffect } from 'react';
import tw, { styled, css } from 'twin.macro';
import { BookDetailsITF } from '../../interfaces/interface';
import LabelInput from './LabelInput';
import AuthorTag from './AuthorTag';
import { BsPlusSquare } from 'react-icons/bs';


interface CardBackPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  isFlipped: boolean;
  handleFlip: Function;
}

const CardBackContainer = styled.div<{ $isFlipped: boolean}>`
  ${tw`absolute h-full w-full`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(180deg);
  transition: transform 600ms linear;
  ${({ $isFlipped }) => $isFlipped
    ? css`transform: perspective(1200px) rotateY(0deg);`
    : css`pointer-events: none;`}
`;

const Form = styled.form`
  ${tw`h-full w-full grid grid-cols-2 grid-rows-21`}
`;

const FormInput = styled.div`
  ${tw`row-start-2 row-end-19 col-start-1 col-end-3 mx-2 px-3 py-1 border border-trueGray-400 rounded-2xl overflow-y-scroll scrollbar-hide`}
`;

const StyledBsPlusSquareContainer = styled.div`
  ${tw`flex items-end mb-1 ml-2`}
`;

const StyledBsPlusSquare = styled(BsPlusSquare)`
  ${tw`stroke-current text-trueGray-100 cursor-pointer`};
  transition: all 300ms linear;
  &:hover {
    ${tw`text-red-500 opacity-60`}
  }
`;

const StyledButton = styled.button`
  ${tw`h-auto w-auto py-0.5 px-4 mx-2 rounded border border-coolGray-50 flex justify-center items-center`};
  ${tw`bg-blueGray-300 bg-opacity-40 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur`};
  transition: opacity 500ms linear;
  &:hover {
    ${tw`bg-blueGray-400 bg-opacity-40`};
    ${tw`transition-colors duration-300 ease-linear`};
  }
`;

const CardBack = ({ bookDetails, author, isFlipped, handleFlip }: CardBackPropsITF) => {
  const [ title, setTitle ] = useState(bookDetails.title);
  const [ authorList, setAuthorList ] = useState<string[]>(author);
  const [ newAuthor, setNewAuthor ] = useState('');
  const [ newAuthorList, setNewAuthorList ] = useState<string[]>([]);
  const [ deleteAuthorList, setDeleteAuthorList ] = useState<string[]>([]);
  const [ format, setFormat] = useState(bookDetails.book_format);
  const [ totalPages, setTotalPages ] = useState(bookDetails.total_pages);
  const [ publishedDate, setPublishedDate ] = useState(bookDetails.published_date);
  const [ editionDate, setEditionDate ] = useState(bookDetails.edition_date);
  const [ pictureLink, setPictureLink ] = useState(bookDetails.picture_link);
  // const [ blurb, setBlurb ] = useState(bookDetails.blurb);

  const [ isSubmitTitle, setIsSubmitTitle ]= useState(false);
  const [ isSubmitFormat, setIsSubmitFormat ]= useState(false);
  const [ isSubmitTotalPages, setIsSubmitTotalPages ]= useState(false);
  const [ isSubmitAuthor, setIsSubmitAuthor ]= useState(false);
  const [ isSubmitPublishedDate, setIsSubmitPublishedDate ]= useState(false);
  const [ isSubmitEditionDate, setIsSubmitEditionDate ]= useState(false);
  const [ isSubmitPictureLink, setIsSubmitPictureLink ]= useState(false);
  // const [ isSubmitBlurb, setIsSubmitBlurb ]= useState(false);
  const [ isSubmitComplete, setIsSubmitComplete ] = useState(false);

  const inputFunctionsList: {[key: string]: Function[]} = {
    title: [setTitle, setIsSubmitTitle],
    newAuthor: [setNewAuthor, setIsSubmitAuthor],
    format: [setFormat, setIsSubmitFormat],
    totalPages: [setTotalPages, setIsSubmitTotalPages],
    publishedDate: [setPublishedDate, setIsSubmitPublishedDate],
    editionDate: [setEditionDate, setIsSubmitEditionDate],
    pictureLink: [setPictureLink, setIsSubmitPictureLink],
    // blurb: [setBlurb, setIsSubmitBlurb]
  };

  useEffect(() => {
    handleReset();
  }, [isFlipped]);

  const handleReset = () => {
    setTitle(bookDetails.title);
    setFormat(bookDetails.book_format);
    setTotalPages(bookDetails.total_pages);
    setAuthorList(author);
    setPublishedDate(bookDetails.published_date);
    setEditionDate(bookDetails.edition_date);
    setPictureLink(bookDetails.picture_link);
    // setBlurb(bookDetails.blurb);
    setNewAuthorList([]);
    setDeleteAuthorList([]);
    for (let input in inputFunctionsList) {
      inputFunctionsList[input][1](false);
    }
  };

  const handleAddAuthor = () => {
    if (newAuthor !== '' && !authorList.includes(newAuthor) && !newAuthorList.includes(newAuthor)) {
      setNewAuthorList([...newAuthorList, newAuthor]);
      setNewAuthor('');
    }
  };

  const handleEnterAuthor = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddAuthor();
    }
  };

  const handleDeleteAuthor = (authorName: string, fromList: 'author' | 'newAuthor') => {
    const authorListClone = fromList === 'author' ? [...authorList] : [...newAuthorList];
    const idx = authorListClone.indexOf(authorName);
    authorListClone.splice(idx, 1);
    if (fromList === 'author') {
      setAuthorList(authorListClone);
      setDeleteAuthorList([...deleteAuthorList, authorName]);
    } else {
      setNewAuthorList(authorListClone);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputFunctionsList[e.target.name][0](e.target.value);
    inputFunctionsList[e.target.name][1](false);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (title !== bookDetails.title) await submitInput({title});
    if (newAuthorList.length > 1 || deleteAuthorList.length > 1) await submitInput({author: {newAuthorList, deleteAuthorList}});
    if (format !== bookDetails.book_format) await submitInput({format});
    if (totalPages !== bookDetails.total_pages) await submitInput({totalPages});
    if (publishedDate !== bookDetails.published_date) await submitInput({publishedDate});
    if (editionDate !== bookDetails.edition_date) await submitInput({editionDate});
    if (pictureLink !== bookDetails.picture_link) await submitInput({pictureLink});
    // if (blurb !== bookDetails.blurb) await submitInput({blurb});
    setIsSubmitComplete(true);
  };

  const submitInput = async (data: {[key: string]: string | number | {[key: string]: string[]}}) => {
    const key: string = Object.keys(data)[0];
    const resource: {[key: string]: string} = {
      title: 'title',
      author: 'author',
      format: 'book_format',
      totalPages: 'total_pages',
      publishedDate: 'published_date',
      editionDate: 'edition_date',
      pictureLink: 'picture_link',
      blurb: 'blurb'
    };
    try {
      const response = await fetch(`http://localhost:3000/1/${resource[key]}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({b_id: bookDetails.b_id, [resource[key]]: data[key]})
      });
      if (response.ok) {
        inputFunctionsList[key][1](true);
      }
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <CardBackContainer $isFlipped={isFlipped}>
      <Form onSubmit={handleSubmit}>
        <FormInput>

          <LabelInput label={'Title'} name={'title'} value={title} placeholder={'title'} submitStatus={[isSubmitTitle, isSubmitComplete]} handleInputChange={handleInputChange} />

          <div className='flex gap-x-2'>
            <LabelInput label={'Format'} name={'format'} value={format} placeholder={'format'} submitStatus={[isSubmitFormat, isSubmitComplete]} handleInputChange={handleInputChange} />
            <LabelInput label={'Total Pages'} name={'totalPages'} value={totalPages} placeholder={'total pages'} submitStatus={[isSubmitTotalPages, isSubmitComplete]} handleInputChange={handleInputChange} />
          </div>

          <div className='relative flex'>
            <LabelInput label={'Author'} name={'newAuthor'} value={newAuthor} placeholder={''} submitStatus={[isSubmitAuthor, isSubmitComplete]} handleInputChange={handleInputChange} additionalFunction={handleEnterAuthor} />
            <StyledBsPlusSquareContainer>
              <StyledBsPlusSquare size={25} onClick={handleAddAuthor}/>
            </StyledBsPlusSquareContainer>
          </div>

          <div className='flex flex-wrap'>
            {newAuthorList.length > 0 && newAuthorList.map(author =>
              <AuthorTag key={author} author={author} fromList={'newAuthor'} handleDeleteAuthor={handleDeleteAuthor} />
            )}
          </div>
          <div className='flex flex-wrap'>
            {authorList.length > 0 && authorList.map(author =>
              <AuthorTag key={author} author={author} fromList={'author'} handleDeleteAuthor={handleDeleteAuthor} />
            )}
          </div>

          <div className='flex gap-x-2'>
            <LabelInput label={'Date Published'} name={'publishedDate'} value={publishedDate} placeholder={'2000-01-01'} submitStatus={[isSubmitPublishedDate, isSubmitComplete]} handleInputChange={handleInputChange} />
            <LabelInput label={'Edition Published'} name={'editionDate'} value={editionDate} placeholder={'2000-01-01'} submitStatus={[isSubmitEditionDate, isSubmitComplete]} handleInputChange={handleInputChange} />
          </div>

          <LabelInput label={'Picture Link'} name={'pictureLink'} value={pictureLink} placeholder={'picture link'} submitStatus={[isSubmitPictureLink, isSubmitComplete]} handleInputChange={handleInputChange} />

        </FormInput>

        <div className='row-start-19 row-end-22 col-start-1 col-end-3 pr-5 flex items-center justify-end'>
          <StyledButton type='button' onClick={() => handleFlip()}>Cancel</StyledButton>
          <StyledButton type='submit'>Save</StyledButton>
        </div>

      </Form>
    </CardBackContainer>
  )
}

export default CardBack;