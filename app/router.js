import Router from 'koa-router';

import DeviceRouter from './controller/device';

const router = new Router();

router.use('/adb/device', DeviceRouter.routes(), DeviceRouter.allowedMethods());

export default router;
