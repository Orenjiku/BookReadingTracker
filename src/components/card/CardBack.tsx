import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { BookDetailsITF } from '../../interfaces/interface';
import useYOverflow from '../../hooks/useYOverflow';
import FormLabel from './FormLabel';
import AuthorTag from './AuthorTag';
import { CSSTransition } from 'react-transition-group';
import { BsPlusSquare, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdFlip } from 'react-icons/md';


interface CardBackPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  isFlipped: boolean;
  flipTimer: number;
  handleFlip: Function;
  handleUpdateBookDetails: Function;
  handleUpdateAuthorDetails: Function;
}

const CardBackContainer = styled.div<{ $isFlipped: boolean; $flipTimer: number }>`
  ${tw`absolute h-full w-full`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
  backface-visibility: hidden;
  transform: perspective(1200px) rotateY(180deg);
  --flipDuration: ${({ $flipTimer }) => `${$flipTimer}ms`};
  transition: transform var(--flipDuration) linear;
  ${({ $isFlipped }) => $isFlipped
    ? css`transform: perspective(1200px) rotateY(0deg);`
    : css`pointer-events: none;`}
`;

const Form = styled.form`
  ${tw`h-full w-full grid grid-cols-2 grid-rows-21`};
`;

const FormInputsView = styled.div`
  ${tw`row-start-2 row-end-19 col-start-1 col-end-3 mx-2 border border-trueGray-400 rounded-2xl overflow-hidden`};
`;

const MainInputContainer = styled.div<{$blurbSlideTimer: number}>`
  ${tw`relative h-full w-full px-3 py-1`};
  --duration: ${({ $blurbSlideTimer }) => `${$blurbSlideTimer}ms`};
  &.slide-enter {
    transform: translateX(-100%);
  }
  &.slide-enter-active {
    transform: translateX(0);
    transition: transform var(--duration) linear;
  }
  &.slide-exit {
    transform: translateX(0);
  }
  &.slide-exit-active {
    transform: translate(-100%);
    transition: transform var(--duration) linear;
  }
  &.slide-exit-done {
    transform: translate(-100%);
  }
`;

const BlurbContainer = styled.div<{$blurbSlideTimer: number}>`
  ${tw`h-full w-full px-3 py-1`};
  --duration: ${({ $blurbSlideTimer }) => `${$blurbSlideTimer}ms`};
  &.slide-enter {
    transform: translateX(100%) translateY(-100%);
  }
  &.slide-enter-active {
    transform: translateX(0) translateY(-100%);
    transition: transform var(--duration) linear;
  }
  &.slide-enter-done {
    transform: translateX(0) translateY(-100%);
  }
  &.slide-exit {
    transform: translateX(0) translateY(-100%);
  }
  &.slide-exit-active {
    transform: translate(100%) translateY(-100%);
    transition: transform var(--duration) linear;
  }
`;

const StyledBsPlusSquare = styled(BsPlusSquare)`
  ${tw`stroke-current text-trueGray-100 cursor-pointer`};
  transition: all 100ms linear;
  &:hover {
    ${tw`text-teal-500`};
  }
  &:active {
    ${tw`bg-teal-200 bg-opacity-80`}
  }
`;

const StyledButton = styled.button`
  ${tw`h-auto w-auto py-0.5 px-4 mx-1 rounded border border-coolGray-50 flex justify-center items-center overflow-hidden`};
  ${tw`bg-blueGray-300 bg-opacity-40 font-Charm-400`};
  ${tw`backdrop-filter backdrop-blur select-none`};
  &:active {
    ${tw`bg-trueGray-400 bg-opacity-40`};
  }
`;

const SaveButton = styled(StyledButton)<{$isStartSubmit?: boolean; $submitHoldTimer?: number}>`
  &:active{
    ${tw`bg-blueGray-300 bg-opacity-40`};
  }
  &::after {
    content: '';
    ${tw`absolute h-full w-0 left-0 bg-teal-500 bg-opacity-40`};
    z-index: -1;
    transition: all 50ms linear;
    ${({ $isStartSubmit, $submitHoldTimer }) => $isStartSubmit && css`
      ${tw`h-full w-full`};
      transition: all ${$submitHoldTimer}ms linear;
    `}
  }
`;

const CardBack = ({ bookDetails, author, isFlipped, flipTimer, handleFlip, handleUpdateBookDetails, handleUpdateAuthorDetails }: CardBackPropsITF) => {
  const [ title, setTitle ] = useState(bookDetails.title);
  const [ authorList, setAuthorList ] = useState<string[]>(author);
  const [ newAuthor, setNewAuthor ] = useState('');
  const [ newAuthorList, setNewAuthorList ] = useState<string[]>([]);
  const [ deleteAuthorList, setDeleteAuthorList ] = useState<string[]>([]);
  const [ format, setFormat] = useState(bookDetails.book_format);
  const [ totalPages, setTotalPages ] = useState(bookDetails.total_pages);
  const [ publishedDate, setPublishedDate ] = useState(bookDetails.published_date);
  const [ editionDate, setEditionDate ] = useState(bookDetails.edition_date);
  const [ pictureUrl, setPictureUrl ] = useState(bookDetails.picture_url);
  const [ blurb, setBlurb ] = useState(bookDetails.blurb);

  const [ isSubmitTitleSuccess, setIsSubmitTitleSuccess ] = useState(false);
  const [ isSubmitAuthorSuccess, setIsSubmitAuthorSuccess ] = useState(false);
  const [ isSubmitFormatSuccess, setIsSubmitFormatSuccess ] = useState(false);
  const [ isSubmitTotalPagesSuccess, setIsSubmitTotalPagesSuccess ]= useState(false);
  const [ isSubmitPublishedDateSuccess, setIsSubmitPublishedDateSuccess ] = useState(false);
  const [ isSubmitEditionDateSuccess, setIsSubmitEditionDateSuccess ] = useState(false);
  const [ isSubmitPictureUrlSuccess, setIsSubmitPictureUrlSuccess ] = useState(false);
  const [ isSubmitBlurbSuccess, setIsSubmitBlurbSuccess ] = useState(false);

  const [ isSubmitTitleFail, setIsSubmitTitleFail ] = useState(false);
  const [ isSubmitAuthorFail, setIsSubmitAuthorFail ] = useState(false);
  const [ isSubmitFormatFail, setIsSubmitFormatFail ] = useState(false);
  const [ isSubmitTotalPagesFail, setIsSubmitTotalPagesFail ]= useState(false);
  const [ isSubmitPublishedDateFail, setIsSubmitPublishedDateFail ] = useState(false);
  const [ isSubmitEditionDateFail, setIsSubmitEditionDateFail ] = useState(false);
  const [ isSubmitPictureUrlFail, setIsSubmitPictureUrlFail ] = useState(false);
  const [ isSubmitBlurbFail, setIsSubmitBlurbFail ] = useState(false);

  const [ isSubmitComplete, setIsSubmitComplete ] = useState(false);

  //Handle editing inputs
  const inputFunctionsList: {[key: string]: Function[]} = {
    title: [setTitle, setIsSubmitTitleSuccess, setIsSubmitTitleFail],
    author: [setNewAuthor, setIsSubmitAuthorSuccess, setIsSubmitAuthorFail],
    format: [setFormat, setIsSubmitFormatSuccess, setIsSubmitFormatFail],
    totalPages: [setTotalPages, setIsSubmitTotalPagesSuccess, setIsSubmitTotalPagesFail],
    publishedDate: [setPublishedDate, setIsSubmitPublishedDateSuccess, setIsSubmitPublishedDateFail],
    editionDate: [setEditionDate, setIsSubmitEditionDateSuccess, setIsSubmitEditionDateFail],
    pictureUrl: [setPictureUrl, setIsSubmitPictureUrlSuccess, setIsSubmitPictureUrlFail],
    blurb: [setBlurb, setIsSubmitBlurbSuccess, setIsSubmitBlurbFail]
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputFunctionsList[e.target.name][0](e.target.value);
    inputFunctionsList[e.target.name][1](false);
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
  //---

  //Related to sliding transition of the Main and Blurb Inputs Containers
  const [ isShowBlurb, setIsShowBlurb ] = useState(false);
  const mainRef = useRef(null);
  const blurbRef = useRef(null);
  const blurbSlideTimer = 300;
  const handleShowBlurb = () => {
    setIsShowBlurb(isShowBlurb => !isShowBlurb);
  };
  //---

  //Determine overflow up and down arrow indicators
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overflowTriggers = {
    // isShowBlurb,
    // blurbSlideTimer,
    newAuthorList,
    deleteAuthorList
  };
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow({scrollContainerRef, overflowTriggers});
  //---

  //When card flipped to front, reset all input values, return to Main Input Container and set scroll position to top
  let resetTimeout: ReturnType<typeof setTimeout>;
  useEffect(() => {
    resetTimeout = setTimeout(() => {
      handleReset();
      setIsShowBlurb(false);
      scrollContainerRef?.current?.scrollTo(0, 0);
    }, flipTimer / 2);
    return () => clearTimeout(resetTimeout);
  }, [isFlipped]);

  const handleReset = () => {
    setTitle(bookDetails.title);
    setNewAuthor('')
    setAuthorList(author);
    setNewAuthorList([]);
    setDeleteAuthorList([]);
    setFormat(bookDetails.book_format);
    setTotalPages(bookDetails.total_pages);
    setPublishedDate(bookDetails.published_date);
    setEditionDate(bookDetails.edition_date);
    setPictureUrl(bookDetails.picture_url);
    setBlurb(bookDetails.blurb);
    for (let input in inputFunctionsList) {
      inputFunctionsList[input][1](false);
      inputFunctionsList[input][2](false);
    }
  };
  //---

  //Handle submit
  const [ isStartSubmit, setIsStartSubmit ] = useState(false);
  const submitHoldTimer = 500;
  let submitTimeout: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (isStartSubmit) {
      submitTimeout = setTimeout(() => {
        handleSubmitAll();
        setIsStartSubmit(false);
      }, submitHoldTimer);
    }
    return () => clearTimeout(submitTimeout);
  }, [isStartSubmit]);

  useEffect(() => {
    if (isSubmitComplete) {
      handleUpdateBookDetails({
        title,
        book_format: format,
        total_pages: totalPages,
        published_date: publishedDate,
        edition_date: editionDate,
        picture_url: pictureUrl,
        blurb
      });
      handleUpdateAuthorDetails([...authorList, ...newAuthorList]);
      setIsSubmitComplete(false);
    }
  }, [isSubmitComplete]);

  const handleStartSubmit = () => setIsStartSubmit(true);

  const handleStopSubmit = () => {
    clearTimeout(submitTimeout);
    setIsStartSubmit(false);
  };

  const handleSubmitAll = async () => {
    if (title !== bookDetails.title) await submitInput({title});
    if (newAuthorList.length > 0 || deleteAuthorList.length > 0) await submitInput({author: {newAuthorList, deleteAuthorList}});
    if (format !== bookDetails.book_format) await submitInput({format});
    if (totalPages !== bookDetails.total_pages && !isNaN(totalPages)) await submitInput({totalPages});
    if (publishedDate !== bookDetails.published_date) await submitInput({publishedDate});
    if (editionDate !== bookDetails.edition_date) await submitInput({editionDate});
    if (pictureUrl !== bookDetails.picture_url) await submitInput({pictureUrl});
    if (blurb !== bookDetails.blurb) await submitInput({blurb});
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
      pictureUrl: 'picture_url',
      blurb: 'blurb'
    };
    try {
      const response = await fetch(`http://localhost:3000/1/book/${resource[key]}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({b_id: bookDetails.b_id, [resource[key]]: data[key]})
      });
      if (response.ok) {
        inputFunctionsList[key][1](true);
        inputFunctionsList[key][2](false);
      } else {
        inputFunctionsList[key][1](false);
        inputFunctionsList[key][2](true);
      }
    } catch(err) {
      console.log(err);
    }
  };
  //---

  return (
    <CardBackContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>
      <Form>
        <FormInputsView>

          <CSSTransition in={!isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={mainRef}>
            <MainInputContainer ref={mainRef} $blurbSlideTimer={blurbSlideTimer}>
              <div ref={scrollContainerRef} className='h-full w-full overflow-y-scroll scrollbar-hide'>
                <FormLabel type='input' label={'Title'} name={'title'} value={title} placeholder={'title'} submitStatus={[isSubmitTitleSuccess, isSubmitTitleFail]} handleInputChange={handleInputChange} />

                <div className='flex gap-x-2'>
                  <FormLabel type='input' label={'Format'} name={'format'} value={format} placeholder={'format'} submitStatus={[isSubmitFormatSuccess, isSubmitFormatFail]} handleInputChange={handleInputChange} />
                  <FormLabel type='input' label={'Total Pages'} name={'totalPages'} value={totalPages} placeholder={'total pages'} submitStatus={[isSubmitTotalPagesSuccess, isSubmitTotalPagesFail]} handleInputChange={handleInputChange} />
                </div>

                <div className='relative flex'>
                  <FormLabel type='input' label={'Author'} name={'author'} value={newAuthor} placeholder={''} submitStatus={[isSubmitAuthorSuccess, isSubmitAuthorFail]} handleInputChange={handleInputChange} optionalFunction={handleEnterAuthor} />
                  <div className='flex items-end ml-2'>
                    <StyledBsPlusSquare size={25} onClick={handleAddAuthor}/>
                  </div>
                </div>
                <div className='flex flex-wrap mt-1'>
                  {newAuthorList.length > 0 && newAuthorList.map(author =>
                    <AuthorTag key={author} author={author} fromList={'newAuthor'} handleDeleteAuthor={handleDeleteAuthor} />
                  )}
                </div>
                <div className='flex flex-wrap mt-0.5'>
                  {authorList.length > 0 && authorList.map(author =>
                    <AuthorTag key={author} author={author} fromList={'author'} handleDeleteAuthor={handleDeleteAuthor} />
                  )}
                </div>

                <div className='flex gap-x-2'>
                  <FormLabel type='input' label={'Date Published'} name={'publishedDate'} value={publishedDate} placeholder={'2000-01-01'} submitStatus={[isSubmitPublishedDateSuccess, isSubmitPublishedDateFail]} handleInputChange={handleInputChange} />
                  <FormLabel type='input' label={'Edition Published'} name={'editionDate'} value={editionDate} placeholder={'2000-01-01'} submitStatus={[isSubmitEditionDateSuccess, isSubmitEditionDateFail]} handleInputChange={handleInputChange} />
                </div>

                <FormLabel type='input' label={'Picture URL'} name={'pictureUrl'} value={pictureUrl} placeholder={'url'} submitStatus={[isSubmitPictureUrlSuccess, isSubmitPictureUrlFail]} handleInputChange={handleInputChange} />
              </div>

              {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0 left-0' />}
              {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0 left-0' />}
            </MainInputContainer>
          </CSSTransition>

          <CSSTransition in={isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={blurbRef} unmountOnExit>
            <BlurbContainer ref={blurbRef} $blurbSlideTimer={blurbSlideTimer}>
              <FormLabel type='textarea' label={'Blurb'} name={'blurb'} value={blurb} placeholder={''} submitStatus={[isSubmitBlurbSuccess, isSubmitBlurbFail]} handleInputChange={handleInputChange} />
            </BlurbContainer>
          </CSSTransition>

        </FormInputsView>

        <div className='relative row-start-19 row-end-22 col-start-1 col-end-3 pr-5 flex items-center justify-end'>
          <MdFlip size={22} className='absolute left-4 cursor-pointer' onClick={() => handleFlip()}/>
          <StyledButton type='button' onClick={handleShowBlurb}>{isShowBlurb ? 'Main' : 'Blurb'}</StyledButton>
          <StyledButton type='button' onClick={handleReset}>Reset</StyledButton>
          <SaveButton type='button' $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={handleStartSubmit} onMouseUp={handleStopSubmit} onMouseLeave={handleStopSubmit}>Save</SaveButton>
        </div>

      </Form>
    </CardBackContainer>
  )
}

export default CardBack;