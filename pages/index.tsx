import Head from 'next/head'
import React from 'react'
import Main from './Home'

export default function Home() {    
    Head({
        title: 'Stack: superchard your datasets',
        meta: [
            { name: 'description', content: 'Gitlab for datasets' },
            { property: 'og:title', content: 'Home' },
        ],
    })
    
    return (
        <Main/>
    )
}