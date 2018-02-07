import Router from "koa-router";
import adb from "../adb";
import { listen } from "../ipc/listen";

const router = new Router();

router.get('/list', async () => {
  return await adb.devices();
});

router.get('/info/base', async ctx => {
  const { device } = ctx.query;
  return await adb.cpuInfo(device);
});

router.get('/info/cpu', async ctx => {
  const { device } = ctx.query;
  return await adb.cpuInfo(device);
});

router.get('/info/memory', async ctx => {
  const { device } = ctx.query;
  return await adb.memoryInfo(device);
});

export default router;
