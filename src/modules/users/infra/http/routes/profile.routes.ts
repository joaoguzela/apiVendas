import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { isAuthenticated } from '@shared/infra/http/middlewares/isAuthenticated';
import ProfileController from '../controllers/ProfileController';
const profileRouter = Router();
profileRouter.use(isAuthenticated);

const profileController = new ProfileController();

profileRouter.get('/', profileController.show);

profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      oldPassword: Joi.string(),
      password: Joi.string().optional(),
      password_confirmation: Joi.string()
        .valid(Joi.ref('password'))
        .when('password', { is: Joi.exist(), then: Joi.required() }),
    },
  }),
  profileController.update,
);

export default profileRouter;
