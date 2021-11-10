import { Response } from "express";

export function responseFunction<T>(meta: object, data: object, res_code: number, res: Response) {
    let response: object = { meta, data };
    return res.status(res_code).json(response);
}

export const dataArray: object = {};