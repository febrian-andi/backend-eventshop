// Access Control List Middleware
import { Response, NextFunction } from "express";
import { IReqUser } from '../utils/interfaces';
import response from "../utils/response";

export default (roles: string[]) => {
  return (req: IReqUser, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      response.unauthorized(res, "Forbidden");
    }
    next();
  };
};