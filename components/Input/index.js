import React from 'react';

const Input = ({ type, value, placeholder, onChange, styles= '' }) => {
  return (
    <div className='w-full'>
      <input
        type={type}
        placeholder={placeholder}
        className={`p-2 border-[#595168] focus:border-[#595168] focus-within:outline-none bg-[#3B3A4A] text-white mb-2 ${styles}`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
