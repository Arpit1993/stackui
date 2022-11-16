import React, { useEffect, useReducer } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import Image from "next/image"

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownSchema = (props) => {
    
    return (
        <Menu as="div" className="frelative inline-block text-left mb-2">
          <div className="flex gap-2">
            <Menu.Button className="justify-center w-[200px] h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-body rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <div className="flex justify-between text-sm">
                <div className="py-2">
                  Dataset Format
                </div>
                <div className="flex flex-col justify-center">
                  <svg className="ml-2 w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                
              </div>
            </Menu.Button>
            <div className="py-2 px-5 text-sm w-[100px] rounded-md text-center h-[40px] border border-gray-500">
              {props.schema.charAt(0).toUpperCase() + props.schema.slice(1)}
            </div>
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
            <Menu.Items className="absolute z-10 mt-2 w-[150px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[100px] overflow-scroll">
              <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900  w-full' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.setSchema('files')}
                    >
                      files
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900  w-full' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.setSchema('yolo')}
                    >
                      yolo bbox
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900  w-full' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.setSchema('labelbox')}
                    >
                      labelbox bbox
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900  w-full' : 'text-gray-700',
                        'block px-4 py-2 text-sm w-full'
                      )}
                      onClick={()=>props.setSchema('files')
                      }
                    >
                      csv
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}

export default DropdownSchema