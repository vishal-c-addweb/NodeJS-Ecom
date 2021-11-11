import config from "config";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Payload from "../types/Payload";
import Request from "../types/Request";
import { dataArray, responseFunction } from "../response_builder/responsefunction";
import responsecode from "../response_builder/responsecode";

export function ValidateToken(req: Request, res: Response, next: NextFunction) {
  const header: string = localStorage.getItem("jwt");
  if (!header) {
    let meta: object = { message: "token is not added", status: "Failed" };
    responseFunction(meta, dataArray, responsecode.Not_Found, res);
  } else {
    try {
      let token: string = localStorage.getItem("jwt");
      const payload: Payload | any = jwt.verify(token, config.get("jwtSecret"));
      req.userId = payload.user_id;
      req.isAdmin = payload.user_isAdmin;
      next();
    } catch (err) {
      let meta: object = { message: "token is not valid", status: "Failed" };
      responseFunction(meta, dataArray, responsecode.Unauthorized, res);
    }
  }
}

export function ValidateTokenAndAuthorization(req: Request, res: Response, next: NextFunction) {
  ValidateToken(req, res, () => {
    if (req.userId === req.params.id || req.isAdmin) {
      next();
    } else {
      let meta: object = { message: "you are not allowed to do that", status: "Failed" };
      responseFunction(meta, dataArray, responsecode.Forbidden, res);
    }
  })
}

export function ValidateTokenAndAdmin(req: Request, res: Response, next: NextFunction) {
  ValidateToken(req, res, () => {
    if (req.isAdmin) {
      next();
    } else {
      let meta: object = { message: "you are not allowed to do that", status: "Failed" };
      responseFunction(meta, dataArray, responsecode.Forbidden, res);
    }
  })
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  if (req.cookies.auth) {
    res.redirect('/');
  } else {
    next();
  }
}

export function unauthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    let decoded: Payload | any = jwt.verify(req.cookies.auth, config.get("jwtSecret"));
    req.userId = decoded.user_id;
    req.isAdmin = decoded.user_isAdmin;
    if (req.cookies.auth) {
      next();
    } else {
      res.redirect('/login');
    }
  } catch (e) {
    res.clearCookie("auth");
    res.redirect('/login');
  }
}