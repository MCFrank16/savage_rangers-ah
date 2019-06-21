import { Router } from 'express';
import ValidateUser from '../../middlewares/ValidateUser';
import authController from '../controllers/authController';
import socialAuthController from '../controllers/socialAuth';
import passport from '../../configs/passport';
import social from '../../middlewares/social/social';

const authRouter = new Router();

authRouter.post('/signup', ValidateUser.validateSignup, authController.signup);
authRouter.post('/login', authController.login);

authRouter.post('/mockFacebook', social, socialAuthController.facebookAuth);
authRouter.post('/mockGoogle', social, socialAuthController.googleAuth);
authRouter.post('/mockTwitter', social, socialAuthController.twitterAuth);

authRouter.get('/facebook', passport.authenticate('facebook'));
authRouter.get('/facebook/callback',
  passport.authenticate('facebook'),
  socialAuthController.facebookAuth);

authRouter.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
authRouter.get('/google/callback',
  passport.authenticate('google'),
  socialAuthController.googleAuth);

authRouter.get('/twitter', passport.authenticate('twitter', { scope: ['email', 'profile'] }));
authRouter.get('/twitter/callback',
  passport.authenticate('twitter'),
  socialAuthController.twitterAuth);

export default authRouter;
