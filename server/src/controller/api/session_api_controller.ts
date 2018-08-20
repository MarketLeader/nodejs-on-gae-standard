import * as Express from "express";
import {AuthenticationService} from "../../service/authentication_service";
import {SessionApiResponse} from "../../../../shared/src/response";

export class SessionApiController {
  static get(req: Express.Request): Promise<SessionApiResponse> {
    let user = AuthenticationService.authenticate({id: req.params.sessionId});
    return new Promise((res, _rej) => {
      if (user !== null && user !== "error") {
        res({status: 200, user});
      } else {
        res({status: 404});
      }
    });
  }
}
