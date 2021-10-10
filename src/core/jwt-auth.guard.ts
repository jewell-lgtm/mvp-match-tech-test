import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayloadDto } from './jwt-payload';
import { UserRole } from './dto/user-role.enum';

export interface JwtAuthRequest {
  user: JwtPayloadDto;
}
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  private requiredRoles: UserRole[];

  constructor(requiredRoles: UserRole | UserRole[] | null = null) {
    super();
    this.requiredRoles =
      requiredRoles == null ? [] : [].concat(requiredRoles as any);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // check token from extended class
    if (!(await super.canActivate(context))) {
      return false;
    }
    // check user has required roles
    return this.userHasRequiredRoles(context);
  }

  private userHasRequiredRoles(context: ExecutionContext) {
    if (this.requiredRoles.length === 0) return true;

    const user = getUser(context);
    return !!this.requiredRoles.find((it) => it === user.role);
  }
}

function getUser(context: ExecutionContext): JwtPayloadDto {
  const { user } = context.switchToHttp().getRequest();
  if (!user) {
    throw new UnauthorizedException();
  }

  return user;
}
