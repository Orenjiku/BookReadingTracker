import React from 'react';
import Navbar from '../navbar/Navbar';

const Header = ({ userId }: { userId: number }) => {
  return (
    <div>
      <Navbar userId={userId} />
    </div>
  )
}

export default Header;