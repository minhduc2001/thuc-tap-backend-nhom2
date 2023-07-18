import { config } from '@/base/config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { IDataThirdParty } from '../interfaces/auth.interface';
// import { AuthService } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
      callbackURL: 'http://localhost:8080/api/v1/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ): Promise<any> {
    const user: IDataThirdParty = {
      id: profile.id,
      username: profile.displayName,
      provider: 'facebook',
    };

    // const user = await this.authService.validateFacebookUser(profile);
    return user;
  }
}
