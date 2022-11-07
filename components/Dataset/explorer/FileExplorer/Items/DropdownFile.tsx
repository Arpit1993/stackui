import React, { useEffect, useReducer } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Image from "next/image"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownFile = (props) => {
    
    return (
        <Menu as="div" className="frelative inline-block text-left">
          <div className="flex">
            <Menu.Button className="inline-flex mt-1 w-[40px] h-[20px] rounded-lg justify-center border border-gray-500 bg-white text-black shadow-sm hover:bg-gray-200/50 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-black">
              <div className="flex justify-between text-sm">                
                <div className="flex">
                  <Image className="" src={'/Icons/options_icon.webp'} width={20} height={20} alt={''}/>
                </div>
              </div>
            </Menu.Button>
          </div>
    
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute border border-black text-xs z-10 mt-2 w-[150px] right-0 origin-top-right rounded-md dark:bg-gray-600/80 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[90px] overflow-scroll">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-200 dark:bg-slate-700 text-gray-500  w-full' : 'text-gray-500',
                        'block px-4 py-2 text-xs w-full'
                      )}
                      onClick={()=>{}}
                    >
                      View file
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-200 dark:bg-slate-700 text-gray-500  w-full' : 'text-gray-500',
                        'block px-4 py-2 text-xs w-full'
                      )}
                      onClick={()=>{props.setPopup(true)}}
                    >
                      Tags
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? ' bg-gray-200 dark:bg-slate-700 text-red-700  w-full' : 'text-red-500',
                        'block px-4 py-2 text-xs w-full'
                      )}
                      onClick={()=>{}}
                    >
                      Delete File
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}

export default DropdownFile