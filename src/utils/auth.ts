import { JwtService } from '@nestjs/jwt';
import { RequestContext } from 'nestjs-request-context';

export async function auth(
  jwtService: JwtService,
  cb: (id: number) => void | Promise<any>,
) {
  const req: Request = RequestContext.currentContext.req;
  const token = req.headers[process.env.TOKEN] as string;
  if (token) {
    const decoded = jwtService.verify(token);
    if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
      await cb(decoded.id);
    }
  }
}
