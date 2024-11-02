import postData from '@/app/utils/api/postData'

export const POST = async function handler(req: any, res: any) {
    const url = `${process.env.API_SERVER_LOCAL}${process.env.API_PATH}${process.env.LOGIN}`
    const body = await req.json()

    return await postData(url, null, body)
}
