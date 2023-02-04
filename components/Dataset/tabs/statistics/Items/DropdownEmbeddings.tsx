import React, { useEffect, useReducer, useRef, useState } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownEmbeddings = (props) => {

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
      <div ref={ref} className={true ? "relative" : 'invisible'}>
        <div className="absolute right-0 top-1 z-[30] flex justify-between text-sm">                
          <button onClick={()=>{setOpen(!open)}} className="z-[200] py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              {'Options'}
          </button>
        </div>
        <div className={open ? "float absolute z-[200] border border-black text-xs mt-10 w-[150px] top-3 right-0 origin-top-right rounded-md dark:bg-gray-600 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" : "invisible float absolute z-[200] border border-black text-xs mt-10 w-[150px] top-0 right-0 origin-top-right rounded-md dark:bg-gray-600 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"}>
          <div className={"py-1 z-[200] h-full overflow-scroll" }>
            <button
              className='hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-white text-gray-500  block px-4 py-2 text-xs w-full'
              onClick={()=>{}}>
              T-SNE
            </button>
            <button
              className='hover:bg-gray-200 dark:text-white text-gray-500 dark:hover:bg-gray-700  block px-4 py-2 text-xs w-full'
              onClick={()=>{}}>
              UMAP
            </button>
            <button
              className='hover:bg-gray-200 dark:text-white text-gray-500 dark:hover:bg-gray-700  block px-4 py-2 text-xs w-full'
              onClick={()=>{}}>
              {'Custom (...)'}
            </button>
          </div>
        </div>
      </div>
    )    
}

export default DropdownEmbeddings