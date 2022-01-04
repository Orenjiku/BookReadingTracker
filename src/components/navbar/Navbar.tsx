import React from 'react';
import tw, { styled } from 'twin.macro';
import { Link } from 'react-router-dom';


const StyledLink = styled(Link)`
  ${tw`text-2xl px-4 py-2`};
  ${tw`bg-blueGray-200 bg-opacity-10 backdrop-filter backdrop-blur-sm`};
  ${tw`border-t border-l border-r border-blueGray-50 shadow-xl`};
  ${tw`opacity-50 font-AllertaStencil-400 text-blueGray-200 whitespace-nowrap pr-1 hover:opacity-80`};
    font-size: 1.625rem;
    letter-spacing: -1.5px;
    text-shadow: 0px -2px 0 white, 0px -1px 1px white, 0px 1px 0 black, 0px 1px 2px black;
`;

const Navbar = ({ userId }: { userId: number }) => {
  return (
    <div>
      <nav className='flex justify-center bg-blueGray-500 bg-opacity-40'>
        <StyledLink to={`/${userId}/currentlyReading`}>Currently Reading</StyledLink>
        <StyledLink to={`/${userId}/finishedReading`}>Finished Reading</StyledLink>
      </nav>
    </div>
  )
}

export default Navbar;