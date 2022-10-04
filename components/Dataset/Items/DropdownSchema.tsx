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
          <div className="flex">
            <Menu.Button className="inline-flex w-[200px] h-[40px] justify-center rounded-sm border border-gray-500 bg-gray-100 px-4 text-lg font-thin text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-black">
              <div className="flex justify-between text-sm">
                <div className="py-2">
                  Dataset Format
                </div> 
                <div className="ml-2 flex gap-1 py-2">
                  <Image className="ml-5" src={'/Icons/dropdown_icon.webp'} width={20} height={10} alt={''}/>
                </div>
              </div>
            </Menu.Button>
            <div className="py-2 px-5 w-[100px] text-center h-[40px] border border-gray-500">
              {props.schema}
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
                      yolo
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