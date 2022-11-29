import React, { useEffect, useReducer } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownFile = (props) => {
    
    return (
        <Menu as="div" className="frelative inline-block text-left">
          <div className="z-[26]">
            <Transition as={Fragment} enter="transition  ease-out duration-100" enterFrom="transform  opacity-0 scale-95" enterTo="transform  opacity-100 scale-100" leave="transition  ease-in duration-75" leaveFrom="transform  opacity-100 scale-100" leaveTo="transform  opacity-0 scale-95">
              <Menu.Items className="absolute z-[550]  border border-black text-xs mt-10 w-[150px] right-0 origin-top-right rounded-md dark:bg-gray-600 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className={props.selected ? "py-1  h-[105px] overflow-scroll" : "py-1  h-[70px] overflow-scroll"}>
                  {
                      props.selected ?
                      <Menu.Item>
                      {({ active }) => (
                        <button
                          className={classNames(
                            active ? ' bg-gray-200 dark:bg-slate-700 text-gray-500' : 'text-gray-500',
                            'block px-4 py-2 text-xs w-full '
                          )}
                          onClick={()=>{
                            props.setShortcuts(false)
                            props.setTagsPopup(true)
                          }}
                        >
                          Tag selection
                        </button>
                      )}
                    </Menu.Item>
                    :
                    <></>
                  }
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-white  w-full' : 'text-gray-500  dark:text-white',
                          'block px-4 py-2 text-xs w-full '
                        )}
                        onClick={()=>{
                          props.setShortcuts(false)
                          props.setPopup(true)
                        }}
                      >
                        Tags
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={classNames(
                          active ? ' bg-gray-200 dark:bg-slate-700 text-red-700  w-full' : 'text-red-500  ',
                          'block px-4 py-2 text-xs w-full '
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
          </div>
          <div className="flex">
            <Menu.Button className="w-max mt-1">
              <div className="z-[25] flex justify-between text-sm">                
                <div className=" border rounded-full border-gray-800 inline-flex items-center p-2 text-sm font-body text-center text-gray-900 bg-white/30 hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800/30 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <svg className="w-3 h-3 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path></svg>
                </div>
              </div>
            </Menu.Button>
          </div>
        </Menu>
      )
}

export default DropdownFile