import React, { useContext } from 'react';
import TransactionContext from '../context/TransactionContext';
const Navbar = () => {
  
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Roxiler Dashboard</h1>
      </div>
    </nav>
  );
};
export default Navbar;