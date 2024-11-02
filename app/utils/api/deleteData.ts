import axios from 'axios'
import { NextResponse } from 'next/server'

const deleteData = async (url: string, token: string | null) => {
    const apikey = process.env.API_KEY
    try {
        const response = await axios.delete(url, {
            headers: {
                token: token ?? '',
                'x-api-key': apikey,
            },
        })

        return NextResponse.json(response.data, { status: 200 })
    } catch (error: any) {
        console.error('Error in delete:', url)
        console.error(error.response.data)
        console.error(error.response.status)
        return NextResponse.json(error.response?.data, {
            status: error.response?.status,
        })
    }
}

export default deleteData
