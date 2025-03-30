import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface NavDropdownItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavDropdownProps {
  label: string;
  items: NavDropdownItem[];
}

export const NavDropdown: React.FC<NavDropdownProps> = ({ label, items }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center  z-[9999] gap-1 text-gray-600 hover:text-gray-900 focus:outline-none">
          {label}
          <ChevronDown className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 bg-white border-none shadow-4xl z-[9999]  rounded-md py-2">
        <div className="flex flex-col">
          {items.map((item, index) => (
            item.isExternal ? (
              <a
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={index}
                to={item.href}
                className="text-sm px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
