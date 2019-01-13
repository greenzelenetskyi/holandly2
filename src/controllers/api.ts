
import jwt, { JsonWebTokenError, VerifyErrors } from 'jsonwebtoken';
import { Request, Response } from 'express';

export const checkToken = (req: Request, res: Response, next: Function) => {
  let token = req.header('Authorization');
  if (token) {
    (<any>req).token = token.split(' ')[1];
    next();
  } else {
    res.status(403).json();
  }
}

export const checkApiKey = (req: Request, res: Response, next: Function) => {
  jwt.verify((<any>req).token, process.env.API_SECRET, { algorithms: [process.env.API_ALGORITHM] }, (err: VerifyErrors, decoded: any) => {
    if (err) {
      console.log(err)
    } else {
      req.user = decoded.user;
      next();
    }
  })
}