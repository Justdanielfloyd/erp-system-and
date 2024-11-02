import axios from 'axios'
import { NextResponse } from 'next/server'

const postData = async (
    url: string,
    token: string | null,
    payload: any,
    contentType: string = 'application/json'
) => {
    const apikey = process.env.API_KEY
    try {
        const response = await axios.post(url, payload, {
            headers: {
                token: token ?? '',
                'Content-Type': contentType,
                'x-api-key': apikey,
            },
        })

        return NextResponse.json(response.data, { status: 200 })
    } catch (error: any) {
        console.error('Error in post:', url)
        console.error(error.message)
        return NextResponse.json(error.response?.data, {
            status: error.response?.status,
        })
    }
}

export default postData
