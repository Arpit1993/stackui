import React, { useEffect } from "react"
import Dataset from "../../components/Dataset/Dataset"
import { posthog } from "posthog-js";

export default function dataset() { 
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const POSTHOG_KEY: string = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;
        posthog.init(POSTHOG_KEY, { api_host: 'https://app.posthog.com' })
    }, [])

    return (
        <Dataset/>
    )
}