/// <reference path="../typings/jwt-simple/jwt-simple.d.ts" />
/// <reference path="../typings/express/express.d.ts" />
import jwt = require('jwt-simple');

export class BaseCtrl {
        protected secret = 'b33r15g00d';
        
        public getUserId = (req: Express.Request, res: Express.Response) => {
                if (!req.headers.authorization)
                        return res.status(401).send({ message: 'User not logged in' });
                
                var token = req.headers.authorization.split(' ');
                var payload = jwt.decode(token[1], this.secret);
                var user_id = payload.sub;
                return user_id;
        }
        
}