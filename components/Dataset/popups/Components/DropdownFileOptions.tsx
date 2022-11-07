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
            <Menu.Button className="inline-flex w-[200px] justify-center rounded-sm border border-gray-500 bg-gray-100 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-black">
              Options
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-[200px] origin-top-right rounded-md border border-black backdrop-blur-md bg-white/50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[113px] overflow-scroll">
              <Menu.Item>
                  {({ active }) => (
                    <button
                      className={classNames(
                        active ? 'bg-gray-100/50 text-gray-900  w-full' : 'text-gray-700',
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
                        active ? 'bg-gray-100/50 text-gray-900  w-full' : 'text-gray-700',
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