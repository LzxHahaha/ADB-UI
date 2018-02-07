import Router from 'koa-router';

import DeviceRouter from './controller/device';

const router = new Router();

router.use('/adb/*', async (ctx, next) => {
  try {
    const data = await next();
    ctx.body = JSON.stringify({ code: 200, data });
  } catch (err) {
    console.log(err);
    ctx.body = JSON.stringify({ code: err.code || 500, message: err.message || 'Unknown error.' });
  }
});

router.use('/adb/device', DeviceRouter.routes(), DeviceRouter.allowedMethods());

export default router;
