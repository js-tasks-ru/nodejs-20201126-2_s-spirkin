const path = require('path');
const Koa = require('koa');
const Chat = require('./chat');
const chat = new Chat();
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((res) => {
    chat.subscribe(res);
  });
  ctx.response.body = await promise;

  await next();
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    chat.publish(ctx.request.body.message);
    ctx.response.body = 'ok';
  } else {
    ctx.response.body = 'empty message';
  }

  await next();
});

app.use(router.routes());

module.exports = app;
