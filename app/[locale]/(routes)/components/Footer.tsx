import Link from 'next/link';
import React from 'react';

const Footer = async () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex h-8 w-full flex-row items-center justify-end p-5 text-xs text-gray-500">
      <div className="hidden pr-5 md:flex">
        <Link href="/">
          <h1 className="text-gray-600">
            {' '}
            {process.env.NEXT_PUBLIC_APP_NAME} - {process.env.NEXT_PUBLIC_APP_V}
          </h1>
        </Link>
      </div>
      <div className="hidden space-x-2 pr-2 md:flex">
        <span className="mx-1 rounded-md bg-black px-1 text-white">
          powered by ImiraSoft
        </span>
        <span>© {currentYear}</span>
      </div>
    </footer>
  );
};

export default Footer;
