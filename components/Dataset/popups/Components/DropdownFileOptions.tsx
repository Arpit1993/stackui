import React, { useEffect, useReducer } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownFileOptions = (props) => {
    
    return (
        <Menu as="div" className="relative inline-block text-left mb-2">
          <div>
            <Menu.Button className="flex text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
              Options <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
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
            <Menu.Items className="text-sm absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md border border-black backdrop-blur-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[113px] overflow-scroll">
              <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100/50 text-gray-900 dark:text-white w-full' : 'text-gray-700 dark:text-white',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.setHistory(1)}
                    >
                      See History
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100/50 text-gray-900 dark:text-white w-full' : 'text-gray-700 dark:text-white',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.handleDelete()}
                    >
                      Delete file
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100/50 text-red-400  w-full' : 'text-red-400',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.handleFullDelete()}
                    >
                      Delete all history
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}

export default DropdownFileOptions