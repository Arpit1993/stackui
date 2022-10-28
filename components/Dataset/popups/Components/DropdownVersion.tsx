import React, { useEffect, useReducer } from "react"
import { useRef } from "react"
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownVersion = (props) => {
    var options: Array<any> = []

    const renderButton = () => {
      if (props.v == props.len){
        return (
          <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-black">
            {props.label} {props.v}
          </Menu.Button>
        )
      } else {
        return (
          <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black-500 focus:ring-offset-2 focus:ring-offset-black">
            {props.label} {props.v}
          </Menu.Button>
        )
      }
    }

    const handleClick = async (v_new, setV) => {
        setV(v_new)
    }

    for(var i = (props.len as number); i >= 1; i--){
        const x = i
        options.push(
            <Menu.Item>
            {({ active }) => (
              <button
                className={classNames(
                  active ? 'bg-gray-100 text-gray-900  w-full' : 'text-gray-700',
                  'block px-4 py-2 text-sm w-full'
                )}
                onClick={()=>handleClick(x,props.setV)}
              >
                Version {x}
              </button>
            )}
          </Menu.Item>
        )
    }

    return (
        <Menu as="div" className="relative inline-block text-left mb-2">
          <div>
            {renderButton()}
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1 h-[150px] overflow-scroll">
                    {options}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}

export default DropdownVersion