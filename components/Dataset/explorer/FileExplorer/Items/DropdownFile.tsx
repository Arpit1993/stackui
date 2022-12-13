import React, { useEffect, useReducer, useRef, useState } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownFile = (props) => {

    const [open, setOpen] = useState(false)
    const ref = useRef(null);

    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);

    return (
      <div ref={ref} className={props.hover ? "relative" : 'invisible'}>
        <div className="absolute right-0 top-1 z-[25] flex justify-between text-sm">                
          <button onClick={()=>{setOpen(!open)}} className="z-[25] border rounded-full border-gray-800 inline-flex items-center text-sm font-body text-center text-gray-900 bg-white/30 hover:bg-gray-100 focus:ring-2 focus:outline-none dark:text-white dark:bg-gray-800/30 dark:hover:bg-gray-700">
              <MoreHorizIcon className="w-[20px] h-[20px]"/>
          </button>
        </div>
        <div className={open ? "float absolute z-[55] border border-black text-xs mt-10 w-[150px] top-0 right-0 origin-top-right rounded-md dark:bg-gray-600 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" : "invisible"}>
          <div className={props.selected ? "py-1 z-[100] h-[105px] overflow-scroll" : "py-1 z-[100] h-[75px] overflow-scroll"}>
            {
              props.selected ?
              <button
                className='hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white text-gray-500  block px-4 py-2 text-xs w-full'
                onClick={()=>{props.shortcuts.current = false;props.setTagsPopup(true);setOpen(false)}}>
                Comment All
              </button>:
              <></>
            }
            <button
              className='hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white text-gray-500  block px-4 py-2 text-xs w-full'
              onClick={()=>{props.shortcuts.current = false; props.setPopup(true);setOpen(false)}}>
              Comments
            </button>
            <button
              className='hover:bg-gray-200 text-red-500 dark:hover:bg-gray-700  block px-4 py-2 text-xs w-full'
              onClick={()=>{setOpen(false)}}>
              Delete File
            </button>
          </div>
        </div>
      </div>
    )    
}

export default DropdownFile