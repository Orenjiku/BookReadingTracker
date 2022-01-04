import React, { useState, useEffect, useRef } from 'react';
import tw, { styled, css } from 'twin.macro';
import { CSSTransition } from 'react-transition-group';
import { BookDetailsITF } from '../../interfaces/interface';
import useYOverflow from '../../hooks/useYOverflow';
import useHoldSubmit from '../../hooks/useHoldSubmit';
import { StyledButton, HoldDownButton } from './styled';
import { sortByLastName, isValidDate, getTitleSort } from './utils';
import FormLabel from './FormLabel';
import AuthorTag from './AuthorTag';
import { BsPlusSquare, BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { MdFlip } from 'react-icons/md';
import { CgPushChevronDownR } from 'react-icons/cg';


interface CardBackPropsITF {
  bookDetails: BookDetailsITF;
  author: string[];
  readerBookId: number;
  isFlipped: boolean;
  flipTimer: number;
  indicatorTransitionTimer: number;
  handleFlip: Function;
  handleUpdateBookDetails: Function;
  handleUpdateAuthorDetails: Function;
  handleUpdateReaderBook: Function;
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
  &:hover {
    ${tw`text-teal-500`};
  }
  &:active {
    ${tw`text-teal-600`};
  }
`;

const CardBack = ({ bookDetails, author, readerBookId, isFlipped, flipTimer, indicatorTransitionTimer, handleFlip, handleUpdateBookDetails, handleUpdateAuthorDetails, handleUpdateReaderBook }: CardBackPropsITF) => {
  const [ title, setTitle ] = useState(bookDetails.title);
  const [ authorList, setAuthorList ] = useState(author);
  const [ newAuthor, setNewAuthor ] = useState('');
  const [ newAuthorList, setNewAuthorList ] = useState<string[]>([]);
  const [ deleteAuthorList, setDeleteAuthorList ] = useState<string[]>([]);
  const [ format, setFormat] = useState(bookDetails.book_format);
  const [ totalPages, setTotalPages ] = useState(bookDetails.total_pages);
  const [ publishedDate, setPublishedDate ] = useState(bookDetails.published_date);
  const [ editionDate, setEditionDate ] = useState(bookDetails.edition_date);
  const [ bookCoverUrl, setBookCoverUrl ] = useState(bookDetails.book_cover_url);
  const [ blurb, setBlurb ] = useState(bookDetails.blurb);

  //separate success and fail states required for success and fail indication for each individual input when submitted.
  const [ isSubmitTitleSuccess, setIsSubmitTitleSuccess ] = useState(false);
  const [ isSubmitAuthorSuccess, setIsSubmitAuthorSuccess ] = useState(false);
  const [ isSubmitFormatSuccess, setIsSubmitFormatSuccess ] = useState(false);
  const [ isSubmitTotalPagesSuccess, setIsSubmitTotalPagesSuccess ]= useState(false);
  const [ isSubmitPublishedDateSuccess, setIsSubmitPublishedDateSuccess ] = useState(false);
  const [ isSubmitEditionDateSuccess, setIsSubmitEditionDateSuccess ] = useState(false);
  const [ isSubmitBookCoverUrlSuccess, setIsSubmitBookCoverUrlSuccess ] = useState(false);
  const [ isSubmitBlurbSuccess, setIsSubmitBlurbSuccess ] = useState(false);

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
  //only feedbackText for title and author. Other feedbackText states created for consistency in providing props to FormLabel.
  const [ formatFeedbackText, setFormatFeedbackText ] = useState('');
  const [ totalPagesFeedbackText, setTotalPagesFeedbackText ] = useState('');
  const [ publishedDateFeedbackText, setPublishedDateFeedbackText ] = useState('');
  const [ editionDateFeedbackText, setEditionDateFeedbackText ] = useState('');
  const [ bookCoverUrlFeedbackText, setBookCoverUrlFeedbackText ] = useState('');
  const [ blurbFeedbackText, setBlurbFeedbackText ] = useState('');

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

  //Handle updating and resetting states.
  const inputFunctionsList: {[key: string]: Function[]} = {
    title: [ setTitle, setIsSubmitTitleSuccess, setIsSubmitTitleFail, setTitleFeedbackText ],
    author: [ setNewAuthor, setIsSubmitAuthorSuccess, setIsSubmitAuthorFail, setAuthorFeedbackText ],
    format: [ setFormat, setIsSubmitFormatSuccess, setIsSubmitFormatFail, setFormatFeedbackText ],
    totalPages: [ setTotalPages, setIsSubmitTotalPagesSuccess, setIsSubmitTotalPagesFail, setTotalPagesFeedbackText ],
    publishedDate: [ setPublishedDate, setIsSubmitPublishedDateSuccess, setIsSubmitPublishedDateFail, setPublishedDateFeedbackText ],
    editionDate: [ setEditionDate, setIsSubmitEditionDateSuccess, setIsSubmitEditionDateFail, setEditionDateFeedbackText ],
    bookCoverUrl: [ setBookCoverUrl, setIsSubmitBookCoverUrlSuccess, setIsSubmitBookCoverUrlFail, setBookCoverUrlFeedbackText ],
    blurb: [ setBlurb, setIsSubmitBlurbSuccess, setIsSubmitBlurbFail, setBlurbFeedbackText ]
  };

  //passed as props to FormLabel component for resetting inputSubmitStates onMouseDown in the input field.
  const resetInputSubmitStates = (input: string) => {
    inputFunctionsList[input][1](false);
    inputFunctionsList[input][2](false);
    //delay reset of feedbackText to show fade out transition.
    let delayReset: ReturnType<typeof setTimeout>;
    delayReset = setTimeout(() => {
      inputFunctionsList[input][3]('');
      () => clearTimeout(delayReset);
    }, indicatorTransitionTimer);
  };

  //used in handleResetAll and Save Button onMouseDown.
  const resetAllInputSubmitStates = () => {
    for (let input in inputFunctionsList) {
      resetInputSubmitStates(input);
    }
  };

  const toggleInputSubmitSuccessState = (input: string) => {
    inputFunctionsList[input][1](true);
    inputFunctionsList[input][2](false);
  };

  const toggleInputSubmitFailState = (input: string) => {
    inputFunctionsList[input][1](false);
    inputFunctionsList[input][2](true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    inputFunctionsList[e.target.name][0](e.target.value);
  };
  //---

  //handle adding and deleting authors from local state arrays, i.e. updating authorList, newAuthorList, deleteAuthorList.
  const handleAddAuthor = () => {
    const normalizedNewAuthor = newAuthor.replace(/\s+/g, ' ').trim(); //removes odd spacing. '    John     Smith   ' => 'John Smith'.

    //checks exact matches
    const isExistInInitialAuthorList = author.reduce((acc, cur) => cur === normalizedNewAuthor ? true : acc, false);
    const isExistInDeleteAuthorList = deleteAuthorList.reduce((acc, cur) => cur === normalizedNewAuthor ? true : acc, false);

    //checks authorList and newAuthorList for newAuthor after removing case sensitivity.
    const isExistInAuthorList = authorList.reduce((acc, cur) => cur.toLowerCase() === normalizedNewAuthor.toLowerCase() ? true : acc, false);
    const isExistInNewAuthorList = newAuthorList.reduce((acc, cur) => cur.toLowerCase() === normalizedNewAuthor.toLowerCase() ? true : acc, false);

    if (isExistInInitialAuthorList && isExistInDeleteAuthorList) {
      //edge case: User deletes author provided by initial API call and then adds the same author back. Author must be removed from deleteAuthorList and returned to authorList instead of added to newAuthorList. This is to prevent sending an unnecessary author POST API call for an author that is already connected with the book in the database.
      const deleteAuthorListCopy = [...deleteAuthorList];
      const idx = deleteAuthorListCopy.indexOf(normalizedNewAuthor);
      deleteAuthorListCopy.splice(idx, 1);
      setDeleteAuthorList(deleteAuthorListCopy);
      //add author back to authorList and sort. Don't add to newAuthorList. (authorList isn't part of update API call)
      setAuthorList(prevAuthorList => sortByLastName([...prevAuthorList, normalizedNewAuthor]));
    } else if (normalizedNewAuthor !== '' && !isExistInAuthorList && !isExistInNewAuthorList) {
      setNewAuthorList(prevNewAuthorList => [...prevNewAuthorList, normalizedNewAuthor]);
      setNewAuthor('');
    } else if (normalizedNewAuthor !== '') {
      toggleInputSubmitFailState('author');
      setAuthorFeedbackText(authorFeedbackTextOptions.errorDuplicateAuthor);
    } else if (normalizedNewAuthor === '') {
      toggleInputSubmitFailState('author');
      setAuthorFeedbackText(authorFeedbackTextOptions.errorEmptyAuthor);
    }
  };

  const handleAddAuthorWithEnter = (e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleAddAuthor();

  const handleDeleteAuthor = (authorName: string, fromList: 'author' | 'newAuthor') => {
    //authorName isn't entered by author, therefore doesn't require normalization used in handleAddAuthor.
    const authorListCopy = fromList === 'author' ? [...authorList] : [...newAuthorList]; //determine which list the author to be deleted is from.
    const idx = authorListCopy.indexOf(authorName); //find index of author to be deleted in list
    authorListCopy.splice(idx, 1); //remove author from list
    fromList === 'author' ? setAuthorList(authorListCopy) : setNewAuthorList(authorListCopy); //update state with new list
    if (fromList === 'author') setDeleteAuthorList(prevDeleteAuthorList => [...prevDeleteAuthorList, authorName]); //only add author to deleteAuthorList if it was part of initial author API call.
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

  //When card flipped to front, reset all input values and set scroll position to top (if scrollable)
  let resetTimeout: ReturnType<typeof setTimeout>;
  useEffect(() => {
    resetTimeout = setTimeout(() => {
      handleResetAll();
      setIsShowBlurb(false);
      scrollContainerRef?.current?.scrollTo(0, 0);
    }, flipTimer / 2);
    return () => clearTimeout(resetTimeout);
  }, [isFlipped]);

  const handleResetAll = () => {
    setTitle(bookDetails.title);
    setAuthorList(author);
    setNewAuthor('')
    setNewAuthorList([]);
    setDeleteAuthorList([]);
    setFormat(bookDetails.book_format);
    setTotalPages(bookDetails.total_pages);
    setPublishedDate(bookDetails.published_date);
    setEditionDate(bookDetails.edition_date);
    setBookCoverUrl(bookDetails.book_cover_url);
    setBlurb(bookDetails.blurb);
    resetAllInputSubmitStates();
  };
  //---

  //handle updating local state once all API requests are completed.
  useEffect(() => {
    //update bookDetails state in parent Card component.
    if (isSubmitComplete) {
      const newBookDetails: {[key: string]: string | number | {[key: string]: string[]}} = {};
      if (isSubmitTitleSuccess) newBookDetails['title'] = title;
      if (isSubmitFormatSuccess) newBookDetails['book_format'] = format;
      if (isSubmitTotalPagesSuccess) newBookDetails['total_pages'] = totalPages;
      if (isSubmitPublishedDateSuccess) newBookDetails['published_date'] = publishedDate;
      if (isSubmitEditionDateSuccess) newBookDetails['edition_date'] = editionDate;
      if (isSubmitBookCoverUrlSuccess) newBookDetails['book_cover_url'] = bookCoverUrl;
      if (isSubmitBlurbSuccess) newBookDetails['blurb'] = blurb;
      handleUpdateBookDetails(newBookDetails);

      if (isSubmitAuthorSuccess) { //fail operations handled in submitAuthor function.
        handleUpdateAuthorDetails([...authorList, ...newAuthorList]);
        setAuthorList([...authorList, ...newAuthorList]);
        setNewAuthorList([]);
        setDeleteAuthorList([]);
      }

      setIsSubmitComplete(false);
    }
  }, [isSubmitComplete]);

  const handleSubmitAll = async () => {
    //checks if current input value changed from original value before submitInput.
    if (title.trim() !== bookDetails.title && title.trim() !== '') {
      await submitInput('title', 'title', title.trim());
    } else if (title.trim() === '') {
      setTitleFeedbackText(titleFeedbackTextOptions.errorEmptyTitle);
      toggleInputSubmitFailState('title');
    }
    if (format.trim() !== bookDetails.book_format) await submitInput('format', 'book_format', format.trim());
    if (totalPages !== bookDetails.total_pages) await submitInput('totalPages', 'total_pages', totalPages);
    if (newAuthorList.length > 0 || deleteAuthorList.length > 0) await submitAuthor({newAuthorList, deleteAuthorList});
    if (publishedDate !== bookDetails.published_date)
      isValidDate(publishedDate) ? await submitInput('publishedDate', 'published_date', publishedDate) : toggleInputSubmitFailState('publishedDate');
    if (editionDate !== bookDetails.edition_date)
      isValidDate(editionDate) ? await submitInput('editionDate', 'edition_date', editionDate) : toggleInputSubmitFailState('editionDate');
    if (bookCoverUrl.trim() !== bookDetails.book_cover_url) await submitInput('bookCoverUrl', 'book_cover_url', bookCoverUrl.trim());
    if (blurb.trim() !== bookDetails.blurb) await submitInput('blurb', 'blurb', blurb.trim());
    setIsSubmitComplete(true); //wait for all API calls, then trigger useEffect to update Card state.
  };

  //handles API request for all inputs except for author.
  const submitInput = async (inputName: string, resourceName: string, inputValue: string | number) => {
    const titleSort = getTitleSort(title.trim());
    try {
      const response = await fetch(`http://localhost:3000/1/book/${resourceName}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          bookId: bookDetails.b_id,
          [inputName]: inputValue,
          ...(inputName === 'title' && {titleSort}),
          ...(inputName === 'totalPages' && {readerBookId})
        })
      });
      if (response.ok) {
        if (inputName === 'totalPages') {
          const result = await response.json();
          handleUpdateReaderBook(result);
        }
        toggleInputSubmitSuccessState(inputName);
      } else {
        const err = await response.json();
        err === `Key (title_sort)=(${titleSort}) already exists.` && setTitleFeedbackText(titleFeedbackTextOptions.errorDuplicateTitle);
        toggleInputSubmitFailState(inputName);
      }
    } catch(err) {
      console.error(err);
      toggleInputSubmitFailState(inputName);
    }
  };
  //---

  const submitAuthor = async (authorObj: {[key: string]: string[]}) => {
    const postAuthorRequest = new Request(`http://localhost:3000/1/book/author`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({bookId: bookDetails.b_id, authorList: authorObj.newAuthorList})
    });

    const deleteAuthorRequest = new Request(`http://localhost:3000/1/book/author`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({bookId: bookDetails.b_id, authorList: authorObj.deleteAuthorList})
    });

    if (authorObj.newAuthorList.length > 0 && authorObj.deleteAuthorList.length > 0) {
      try {
        const deleteAuthorResponse = await fetch(deleteAuthorRequest);
        const postAuthorResponse = await fetch(postAuthorRequest);

        if (postAuthorResponse.ok && deleteAuthorResponse.ok) {
          toggleInputSubmitSuccessState('author');
        } else {
          toggleInputSubmitFailState('author');
          if (!postAuthorResponse.ok && !deleteAuthorResponse.ok) {
            //if both requests fail, no additional changes necessary. Provide feedback to user to retry save.
            setAuthorFeedbackText(authorFeedbackTextOptions.errorPostAndDeleteAuthor);
          } else if (deleteAuthorResponse.ok) {
            //if post request fails, update parent Card component with current authorList i.e. with selected authors deleted. Local useEffect will update local state.
            setAuthorFeedbackText(authorFeedbackTextOptions.errorPostAuthor);
            handleUpdateAuthorDetails(authorList);
            setDeleteAuthorList([]);
          } else if (postAuthorResponse.ok) {
            //if delete request fails, update parent Card component with original author list and newAuthorList. Notify user to reselect authors for deletion.
            setAuthorFeedbackText(authorFeedbackTextOptions.errorDeleteAuthor);
            handleUpdateAuthorDetails([...author, ...newAuthorList]);
          }
        }
      } catch(err) {
          console.error(err);
          toggleInputSubmitFailState('author');
      }
    } else if (authorObj.newAuthorList.length > 0) {
      try {
        const postAuthorResponse = await fetch(postAuthorRequest);

        if (postAuthorResponse.ok) {
          toggleInputSubmitSuccessState('author');
        } else {
          //if post request fails, provide feedback to retry save. Maintain newAuthorList.
          toggleInputSubmitFailState('author');
          setAuthorFeedbackText(authorFeedbackTextOptions.errorPostAuthor);
        }
      } catch(err) {
        console.error(err);
        toggleInputSubmitFailState('author');
      }
    } else if (authorObj.deleteAuthorList.length > 0) {
      try {
        const deleteAuthorResponse = await fetch(deleteAuthorRequest);

        if (deleteAuthorResponse.ok) {
          toggleInputSubmitSuccessState('author');
        } else {
          toggleInputSubmitFailState('author');
          //if request delete fails, reset local authorList state to initial author list. Notify user to reselect authors for deletion.
          setAuthorFeedbackText(authorFeedbackTextOptions.errorDeleteAuthor);
          setAuthorList(author);
          setDeleteAuthorList([]);
        }
      } catch(err) {
        console.error(err);
        toggleInputSubmitFailState('author');
      }
    }
  };

  //handle Save Button onMouseDown hold effect before submit. handleSubmitAll needs to be declared before useHoldSubmit.
  const submitHoldTimer = 500;
  const [ isStartSubmit, handleStartSubmit, handleStopSubmit ] = useHoldSubmit(submitHoldTimer, handleSubmitAll)
  //--

  return (
    <CardBackContainer $isFlipped={isFlipped} $flipTimer={flipTimer}>
      <Form>
        <FormInputsView>

          <CSSTransition in={!isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={mainRef}>
            <MainInputContainer ref={mainRef} $blurbSlideTimer={blurbSlideTimer}>
              <div ref={scrollContainerRef} className='h-full w-full overflow-y-scroll scrollbar-hide'>
                <div className='relative my-1'>
                  <FormLabel type='text' label={'Title'} name={'title'} value={title} placeholder={''} submitStatus={[isSubmitTitleSuccess, isSubmitTitleFail]} feedbackText={titleFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                </div>

                <div className='flex gap-x-2 my-1'>
                  <FormLabel type='text' label={'Format'} name={'format'} value={format} placeholder={''} submitStatus={[isSubmitFormatSuccess, isSubmitFormatFail]} feedbackText={formatFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                  <FormLabel type='number' label={'Total Pages'} name={'totalPages'} value={totalPages} placeholder={''} submitStatus={[isSubmitTotalPagesSuccess, isSubmitTotalPagesFail]} feedbackText={totalPagesFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                </div>

                <div className='relative flex my-1'>
                  <FormLabel type='text' label={'Author'} name={'author'} value={newAuthor} placeholder={''} submitStatus={[isSubmitAuthorSuccess, isSubmitAuthorFail]} feedbackText={authorFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleEnter={handleAddAuthorWithEnter} handleReset={resetInputSubmitStates} />
                  <div className='ml-2 mb-0.5 flex items-end'>
                    <StyledBsPlusSquare size={25} onClick={handleAddAuthor}/>
                  </div>
                </div>
                <div className='flex flex-wrap mt-1'>
                  {newAuthorList.length > 0 && newAuthorList.map(author =>
                    <AuthorTag key={author} author={author} fromList={'newAuthor'} handleDeleteAuthor={handleDeleteAuthor} handleResetFormLabel={resetInputSubmitStates} />
                  )}
                </div>
                <div className='flex flex-wrap mt-0.5'>
                  {authorList.length > 0 && authorList.map(author =>
                    <AuthorTag key={author} author={author} fromList={'author'} handleDeleteAuthor={handleDeleteAuthor} handleResetFormLabel={resetInputSubmitStates} />
                  )}
                </div>

                <div className='flex gap-x-2 my-1'>
                  <FormLabel type='text' label={'Date Published'} name={'publishedDate'} value={publishedDate} placeholder={'yyyy-mm-dd'} submitStatus={[isSubmitPublishedDateSuccess, isSubmitPublishedDateFail]} feedbackText={publishedDateFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                  <FormLabel type='text' label={'Edition Pubished'} name={'editionDate'} value={editionDate} placeholder={'yyyy-mm-dd'} submitStatus={[isSubmitEditionDateSuccess, isSubmitEditionDateFail]} feedbackText={editionDateFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                </div>

                <div className='mt-1 mb-2'>
                  <FormLabel type='text' label={'Book Cover URL'} name={'bookCoverUrl'} value={bookCoverUrl} placeholder={''} submitStatus={[isSubmitBookCoverUrlSuccess, isSubmitBookCoverUrlFail]} feedbackText={bookCoverUrlFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
                </div>
              </div>

              {!refYScrollBegin && <BsChevronUp className='absolute w-full top-0 left-0' />}
              {!refYScrollEnd && refYOverflowing && <BsChevronDown className='absolute w-full bottom-0 left-0' />}
            </MainInputContainer>
          </CSSTransition>

          <CSSTransition in={isShowBlurb} timeout={blurbSlideTimer} classNames='slide' nodeRef={blurbRef} unmountOnExit>
            <BlurbContainer ref={blurbRef} $blurbSlideTimer={blurbSlideTimer}>
              <FormLabel type='textarea' label={'Blurb'} name={'blurb'} value={blurb} placeholder={''} submitStatus={[isSubmitBlurbSuccess, isSubmitBlurbFail]} feedbackText={blurbFeedbackText} indicatorTransitionTimer={indicatorTransitionTimer} handleInputChange={handleInputChange} handleReset={resetInputSubmitStates} />
            </BlurbContainer>
          </CSSTransition>

        </FormInputsView>

        <div className='relative row-start-19 row-end-22 col-start-1 col-end-3 pr-5 flex items-center justify-end'>
          <MdFlip size={22} className='absolute left-4 cursor-pointer' onClick={() => handleFlip()}/>
          <StyledButton type='button' onClick={handleShowBlurb}>{isShowBlurb ? 'Main' : 'Blurb'}</StyledButton>
          <StyledButton type='button' onClick={handleResetAll}>Reset</StyledButton>
          <HoldDownButton type='button' $blue $isStartSubmit={isStartSubmit} $submitHoldTimer={submitHoldTimer} onMouseDown={() => {resetAllInputSubmitStates(); handleStartSubmit();}} onMouseUp={() => handleStopSubmit()} onMouseLeave={() => handleStopSubmit()}>
            <p>Save</p>
            <CgPushChevronDownR className='ml-1 current-stroke text-blueGray-600' />
          </HoldDownButton>
        </div>

      </Form>
    </CardBackContainer>
  )
}

export default CardBack;