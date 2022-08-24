import Head from 'next/head'
import Main from './Home'

export default function Home() {    
    Head({
        title: 'Stack the map of your datasets',
        meta: [
            { name: 'description', content: 'Gitlab for datasets' },
            { property: 'og:title', content: 'Home' },
        ],
    })
    
    return (
        <Main/>
    )
}