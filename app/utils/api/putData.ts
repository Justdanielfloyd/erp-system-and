import axios from 'axios'
import { NextResponse } from 'next/server'

const putData = async (
    url: string,
    token: string | null,
    payload: any,
    contentType: string = 'application/json'
) => {
    const apikey = process.env.API_KEY
    try {
        const response = await axios.put(url, payload, {
            headers: {
                token: token ?? '',
                'Content-Type': contentType,
                'x-api-key': apikey,
            },
        })
        return NextResponse.json(response.data, { status: 200 })
    } catch (error: any) {
        console.error('Error in put:', url)
        console.error(error?.response?.data)
        return NextResponse.json(null, { status: error.response?.status })
    }
}

export default putData
