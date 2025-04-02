import { Response } from "express"

type TMeta = {
    page: number,
    limit: number,
    totalGames: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean
}

type TResponse<T> = {
    statusCode: number,
    success: boolean,
    message?: string,
    meta?: TMeta,
    data: T,
    error?: string
}

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        meta: data.meta,
        data: data.data
        
    
    })
}

export default sendResponse