const Router = require('koa-router')
const marked = require('marked')
const router = new Router()
const Article = require('../database/schema/article')
const Tag = require('../database/schema/tag')
const ObjectId = require('mongoose').Types.ObjectId
const checkRoot = require('./root')

router.post('/insertArticle', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    const data = ctx.request.body.data
    const currentTime = new Date().getTime()
    const tags = data.tags || []
    const html = marked(data.content)
    let tagsId = []
    if (tags.length !== 0) {
      let insertTags = [], tagResult = []
      tags.forEach(ele => {
        if (ele.id.indexOf('newTag') !== -1) {
          insertTags.push({name: ele.name, createTime: currentTime})
        } else {
          tagsId.push(ObjectId(ele.id))
        }
      })
      tagResult = await Tag.insertMany(insertTags)
      tagResult.forEach(ele => {
        tagsId.push(ObjectId(ele._id))
      })
    }
    let htmlTags = html.match(/.*|<(.|\n)*?<\/.*>.*/g)
    let summary = ''
    let count = 0
    let limit = 2
    for(let i = 0, len = htmlTags.length; i < len; i++) {
      if (htmlTags[i] === '') {
        summary += '\n'
      }
      if (htmlTags[i].match(/^<(.)/)) {
        let tag = htmlTags[i].match(/^<(.)/)[1]
        if (tag === 'h') {
          count += 1
        }
        if (count > limit && tag === 'h') {
          break
        }
      }
      summary += htmlTags[i]
    }
    summary += '<p>......</p>'
    summary = summary.replace(/\'/g, '"')
    const article = new Article({
      title: data.title,
      summary,
      content: data.content,
      html,
      user: ObjectId(data.user),
      tag: tagsId,
      createTime: currentTime,
    })
    await article.save()
    ctx.body = {code: 200, message: '发布成功'}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/getArticle', async (ctx) => {
  try {
    const checkResult = checkRoot(ctx)
    if (checkResult.code === 500) {
      ctx.body = checkResult
      return
    }
    const data = ctx.request.body.data
    let result
    if (data.admin) {
      result = await Article.find({}, {summary: 0, content: 0, html: 0, comment: 0}).populate('tag')
    } else if (data.summary) {
      result = await Article.find({}, {content: 0, html: 0, comment: 0}).populate('tag')
    }
    ctx.body = {code: 200, message: result}
  } catch(err) {
    throw new Error(err)
  }
})

router.post('/getArticleInfo', async (ctx) => {

})

module.exports = router