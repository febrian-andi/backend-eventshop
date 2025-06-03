import { NextFunction, Request, Response } from "express";
import { getUserData } from "../utils/jwt";
import { IReqUser } from "../utils/interfaces";
import response from "../utils/response";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers?.authorization;

  if (!authorization) {
    response.unauthorized(res, "Unauthorized");
    return;
  }

  const [prefix, accessToken] = authorization.split(" ");

  if (!(prefix === "Bearer" && accessToken)) {
    response.unauthorized(res, "Unauthorized");

    return;
  }

  const user = getUserData(accessToken);

  if (!user) {
    response.unauthorized(res, "Unauthorized");
    return;
  }

  (req as IReqUser).user = user;
  next();
};
