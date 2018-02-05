import Koa from 'koa';
import router from './router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err) => {
  console.error(err);
});

export default app;
