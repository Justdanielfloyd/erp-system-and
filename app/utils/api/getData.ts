import axios from 'axios'
import { NextResponse } from 'next/server'

const getData = async (
    url: string,
    token: string | null,
    signal?: AbortSignal
) => {
    const apikey = process.env.API_KEY
    try {
        const response = await axios.get(url, {
            headers: {
                token: token ?? '',
                'x-api-key': apikey,
            },
            signal,
        })

        return NextResponse.json(response.data, { status: 200 })
    } catch (error: any) {
        console.error(error.response.data)
        console.error('Error in get:', url)
        console.error(error.message)
        return NextResponse.json(error.response?.data, {
            status: error.response?.status,
        })
    }
}

export default getData
