import React, { useState } from 'react'
import reactCSS from 'reactcss'
import { ChromePicker } from 'react-color'

const ColorPick = (props) => {
    const [color, setColor] = useState((props.map[props.idx]) ? props.map[props.idx].color : '#000000')
    const [display, setDisplay] = useState(false)

    const handleClick = () => {
        setDisplay(!display)
    };

    const handleClose = () => {
        setDisplay(false)
    };

    const handleChange = (color) => {
        setColor(color.hex)
        props.setMap(() => {
            var arr = props.map
            arr[props.idx].color = color.hex 
            return arr
        })
        props.setStr((Math.random() + 1).toString(36).substring(7))
    };

    const handleSubmit = () => {

        var arr = props.map
        arr[props.idx].color = color
        var data = JSON.stringify(arr)

        fetch('http://localhost:8000/set_class_map/', {
            method: 'POST',
            headers: { 
                "Content-Type": "application/json" 
            }, 
            body: data}
        ).then(
            () => {
                setDisplay(false)
            }
        )
    }

    const styles = reactCSS({
      'default': {
        color: {
          width: '14px',
          height: '14px',
          background: (props.map[props.idx]) ? props.map[props.idx].color : '#000000',
        },
        swatch: {
          padding: '2px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          top: '-50px',
          left: '100px',
          zIndex: '300',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });

    return (
      <div className='flex flex-col justify-center items-center'>
        <div className='bg-white dark:bg-gray-700 rounded-full' style={ styles.swatch } onClick={ handleClick }>
          <div className='rounded-full' style={ styles.color } />
        </div>
        { 
            display 
            ? 
            <div className='bg-white dark:bg-gray-700 border rounded-md border-gray-300 w-[228px] h-[300px] flex flex-col items-center' style={ styles.popover }>
                <div style={ styles.cover } onClick={ handleClose }/>
                <ChromePicker color={ color } onChange={ handleChange } />
                <button type="button" onClick={ handleSubmit } className="mt-2 z-[350] text-gray-900 bg-white  border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Submit</button>
            </div> 
            : 
            null 
        }
      </div>
    )
}

export default ColorPick