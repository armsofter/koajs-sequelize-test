const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')

const app = new Koa()
const router = new Router()
const Lessons = require('./controllers/Lessons')


router.get('/', async (ctx) => {
  ctx.body = await Lessons.getLessons(ctx.query)
})

router.post('/lessons', koaBody(), async (ctx) => {
  ctx.body = await Lessons.createLessons(ctx);
})


app.use(router.allowedMethods())
	.use(router.routes())
	.use(require('koa-body')())


app.listen(3000)
console.log('listening on port 3000')