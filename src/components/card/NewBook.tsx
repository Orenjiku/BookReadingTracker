import React, { useState, useEffect, useRef } from 'react';
import tw, { styled } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookListCategory } from '../../interfaces/interface';
import useYOverflow from '../../hooks/useYOverflow';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import { StyledButton, HoldDownButton } from './common/styled';
import { isValidDate, getTitleSort } from './common/utils';
import FormLabel from './common/FormLabel';
import AuthorTag from './cardBack/AuthorTag';
import { BsPlusSquare, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { CgPushChevronDownR } from 'react-icons/cg';


const NewBookContainer = styled.div`
  --card-width: 360px;
  --card-height: 378px;
  min-width: var(--card-width);
  max-width: var(--card-width);
  min-height: var(--card-height);
  max-height: var(--card-height);
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 rounded-2xl shadow-xl`};
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
  &:hover {
    ${tw`text-teal-500`};
  }
  &:active {
    ${tw`text-teal-600`};
  }
`;

const NewBook = ({category, handleCreate, handleUpdateBookList}: {category: BookListCategory; handleCreate: Function; handleUpdateBookList: Function}) => {
  const [ title, setTitle ] = useState('');
  const [ newAuthor, setNewAuthor ] = useState('');
  const [ newAuthorList, setNewAuthorList ] = useState<string[]>([]);
  const [ deleteAuthorList, setDeleteAuthorList ] = useState<string[]>([]);
  const [ format, setFormat] = useState('');
  const [ totalPages, setTotalPages ] = useState(0);
  const [ publishedDate, setPublishedDate ] = useState('');
  const [ editionDate, setEditionDate ] = useState('');
  const [ bookCoverUrl, setBookCoverUrl ] = useState('');
  const [ blurb, setBlurb ] = useState('');

  const [ isSubmitTitleFail, setIsSubmitTitleFail ] = useState(false);
  const [ isSubmitAuthorFail, setIsSubmitAuthorFail ] = useState(false);
  const [ isSubmitFormatFail, setIsSubmitFormatFail ] = useState(false);
  const [ isSubmitTotalPagesFail, setIsSubmitTotalPagesFail ]= useState(false);
  const [ isSubmitPublishedDateFail, setIsSubmitPublishedDateFail ] = useState(false);
  const [ isSubmitEditionDateFail, setIsSubmitEditionDateFail ] = useState(false);
  const [ isSubmitBookCoverUrlFail, setIsSubmitBookCoverUrlFail ] = useState(false);
  const [ isSubmitBlurbFail, setIsSubmitBlurbFail ] = useState(false);

  //isSubmitComplete needed for useEffect trigger for updating local inputs after API calls.
  const [ isSubmitComplete, setIsSubmitComplete ] = useState(false);

  //Triggers for feedback text indication on FormLabels.
  const [ titleFeedbackText, setTitleFeedbackText ] = useState('');
  const [ authorFeedbackText, setAuthorFeedbackText ] = useState('');
  const titleFeedbackTextOptions = {
    errorDuplicateTitle: 'Title already exists in collection.',
    errorEmptyTitle: 'Input cannot be empty.'
  };
  const authorFeedbackTextOptions = {
    errorDuplicateAuthor: 'Author name is duplicated.',
    errorEmptyAuthor: 'Input cannot be empty.',
    errorPostAndDeleteAuthor: 'Connection. Retry Save.',
    errorPostAuthor: 'Connection. Retry Save.',
    errorDeleteAuthor: 'Connection. Reselect authors and retry save.'
  };
  //---

  //Handle editing inputs
  const inputFunctionsList: {[key: string]: Function[]} = {
    title: [ setTitle, setIsSubmitTitleFail ],
    author: [ setNewAuthor, setIsSubmitAuthorFail],
    format: [ setFormat, setIsSubmitFormatFail ],
    totalPages: [ setTotalPages, setIsSubmitTotalPagesFail ],
    publishedDate: [ setPublishedDate, setIsSubmitPublishedDateFail ],
    editionDate: [ setEditionDate, setIsSubmitEditionDateFail ],
    bookCoverUrl: [ setBookCoverUrl, setIsSubmitBookCoverUrlFail ],
    blurb: [ setBlurb, setIsSubmitBlurbFail ]
  };

  const resetInputSubmitStates = (input: string) => {
    inputFunctionsList[input][1](false);
  };

  const toggleInputSubmitFailState = (input: string) => {
    inputFunctionsList[input][1](true);
  };

  const handleResetFormLabel = (input: string) => {
    resetInputSubmitStates(input);
    input === 'title' && setTitleFeedbackText('');
    input === 'author' && setAuthorFeedbackText('');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputFunctionsList[e.target.name][0](e.target.value);
    handleResetFormLabel(e.target.name);
  };
  //---

  //handle adding and deleting authors from local state arrays, i.e. updating authorList, newAuthorList, deleteAuthorList.
  const handleAddAuthor = () => {
    const normalizedNewAuthor = newAuthor.replace(/\s+/g, ' ').trim(); //removes odd spacing. '    John     Smith   ' => 'John Smith'.
    if (normalizedNewAuthor !== '') {
      setNewAuthorList(prevNewAuthorList => [...prevNewAuthorList, normalizedNewAuthor]);
      setNewAuthor('');
    } else if (normalizedNewAuthor === '') {
      setIsSubmitAuthorFail(true);
      setAuthorFeedbackText(authorFeedbackTextOptions.errorEmptyAuthor);
    }
  };

  const handleAddAuthorWithEnter = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddAuthor();

  const handleDeleteAuthor = (authorName: string) => {
    const authorListCopy =[...newAuthorList];
    const idx = authorListCopy.indexOf(authorName); //find index of author to be deleted in list
    authorListCopy.splice(idx, 1); //remove author from list
    setNewAuthorList(authorListCopy); //update state with new list
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
    newAuthorList,
    deleteAuthorList
  };
  const { refYOverflowing, refYScrollBegin, refYScrollEnd } = useYOverflow({scrollContainerRef, overflowTriggers});
  //---

  const handleCancel = () => {
    setTitle('');
    setNewAuthor('')
    setNewAuthorList([]);
    setDeleteAuthorList([]);
    setFormat('');
    setTotalPages(0);
    setPublishedDate('');
    setEditionDate('');
    setBookCoverUrl('');
    setBlurb('');
    handleCreate(false);
    for (let input in inputFunctionsList) {
      handleResetFormLabel(input);
    }
  };
  //---

  //handle updating local state once all API requests are completed.
  useEffect(() => {
    //update bookDetails state in parent Card component.
    if (isSubmitComplete) {

      setIsSubmitComplete(false);
    }
  }, [isSubmitComplete]);

  const handleSubmitBook = async () => {
    //checks if current input value changed from original value before submitInput
    if (title.trim() === '') {
      toggleInputSubmitFailState('title');
      setTitleFeedbackText(titleFeedbackTextOptions.errorEmptyTitle);
    } else if (!isValidDate(publishedDate) && publishedDate !== '') {
      toggleInputSubmitFailState('publishedDate');
    } else if (!isValidDate(editionDate) && editionDate !== '') {
      toggleInputSubmitFailState('editionDate');
    } else {
      const titleSort = getTitleSort(title);
      submitBook({title, titleSort, format, totalPages, author: newAuthorList, publishedDate, editionDate, bookCoverUrl, blurb});
    }
  };

  //handles API request for all inputs except for totalPages and author.
  const submitBook = async (book: {title: string, titleSort: string, format: string, totalPages: number, author: string[], publishedDate: string, editionDate: string, bookCoverUrl: string, blurb: string}) => {
    try {
      const response = await fetch(`http://localhost:3000/1/book`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...book, category})
      });
      if (response.ok) {
        const result = await response.json();
        handleUpdateBookList(result);
        setIsSubmitComplete(true); //wait for all API calls, then trigger useEffect to update Card state.
      } else {
        const err = await response.json();
        if (err === `Key (title)=(${book.title}) already exists.`) setTitleFeedbackText(titleFeedbackTextOptions.errorDuplicateTitle);
      }
    } catch(err) {
      console.error(err);
    }
  };
  //---

  //handle Save Button onMouseDown hold effect before submit. handleSubmitAll needs to be declared before useHoldSubmit.
  const submitHoldTimer = 500;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleSubmitBook)
  //--

  return (
    <NewBookContainer>
      <Form>
        <FormInputsView>

          <CSSTransition in={!isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={mainRef}>
            <MainInputContainer ref={mainRef} $blurbSlideTimer={blurbSlideTimer}>
              <div ref={scrollContainerRef} className='h-full w-full overflow-y-scroll scrollbar-hide'>
                <div className='relative my-1'>
                  <FormLabel type='text' label={'Title'} name={'title'} value={title} placeholder={''} submitStatus={[false, isSubmitTitleFail]} feedbackText={titleFeedbackText} indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                </div>

                <div className='flex gap-x-2 my-1'>
                  <FormLabel type='text' label={'Format'} name={'format'} value={format} placeholder={''} submitStatus={[false, isSubmitFormatFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                  <FormLabel type='number' label={'Total Pages'} name={'totalPages'} value={totalPages} placeholder={''} submitStatus={[false, isSubmitTotalPagesFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                </div>

                <div className='relative flex my-1'>
                  <FormLabel type='text' label={'Author'} name={'author'} value={newAuthor} placeholder={''} submitStatus={[false, isSubmitAuthorFail]} feedbackText={authorFeedbackText} indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleEnter={handleAddAuthorWithEnter} handleReset={handleResetFormLabel} />
                  <div className='ml-2 mb-0.5 flex items-end'>
                    <StyledBsPlusSquare size={25} onClick={handleAddAuthor}/>
                  </div>
                </div>
                <div className='flex flex-wrap mt-1'>
                  {newAuthorList.length > 0 && newAuthorList.map(author =>
                    <AuthorTag key={author} author={author} fromList={'newAuthor'} handleDeleteAuthor={handleDeleteAuthor} handleResetFormLabel={handleResetFormLabel} />
                  )}
                </div>

                <div className='flex gap-x-2 my-1'>
                  <FormLabel type='text' label={'Date Published'} name={'publishedDate'} value={publishedDate} placeholder={'yyyy-mm-dd'} submitStatus={[false, isSubmitPublishedDateFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                  <FormLabel type='text' label={'Edition Published'} name={'editionDate'} value={editionDate} placeholder={'yyyy-mm-dd'} submitStatus={[false, isSubmitEditionDateFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                </div>

                <div className='mt-1 mb-2'>
                  <FormLabel type='text' label={'Book Cover URL'} name={'bookCoverUrl'} value={bookCoverUrl} placeholder={''} submitStatus={[false, isSubmitBookCoverUrlFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
                </div>
              </div>

              {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0 left-0' />}
              {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0 left-0' />}
            </MainInputContainer>
          </CSSTransition>

          <CSSTransition in={isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={blurbRef} unmountOnExit>
            <BlurbContainer ref={blurbRef} $blurbSlideTimer={blurbSlideTimer}>
              <FormLabel type='textarea' label={'Blurb'} name={'blurb'} value={blurb} placeholder={''} submitStatus={[false, isSubmitBlurbFail]} feedbackText='' indicatorTransitionTimer={300} handleInputChange={handleInputChange} handleReset={handleResetFormLabel} />
            </BlurbContainer>
          </CSSTransition>

        </FormInputsView>

        <div className='relative row-start-19 row-end-22 col-start-1 col-end-3 pr-5 flex items-center justify-end'>
          <StyledButton type='button' onClick={handleShowBlurb}>{isShowBlurb ? 'Main' : 'Blurb'}</StyledButton>
          <StyledButton type='button' onClick={handleCancel}>Cancel</StyledButton>
          <HoldDownButton type='button' $blue $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={() => handleStartSubmit()} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>
            <p>Save</p>
            <CgPushChevronDownR className='ml-0.5 current-stroke text-blueGray-600' />
          </HoldDownButton>
        </div>

      </Form>
    </NewBookContainer>
  )
}

export default NewBook;