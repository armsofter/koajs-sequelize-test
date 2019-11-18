const LessonsModel = require('../models/index').lessons
const Sequelize = require('../models/index').Sequelize
const Op = Sequelize.Op
const students = require('../models/index').students
const teachers = require('../models/index').teachers
const Teachers = require('./Trachers')

const Lessons = {
  getLessons: (query) => {
    return new Promise((resolve, reject) => {
      let where = {where: {}}
      if (query.status) {
        where.where.status = Number(query.status)
      }
      let teachersWhere = {where: {}}

      if (query.teacherId && query.teacherId.indexOf(',') === -1) {
        teachersWhere.where.id = query.teacherId
      } else if (query.teacherId && query.teacherId.indexOf(',') !== -1) {
        teachersWhere.where.id = query.teacherId.split(',')
      }
      if (query.date && query.date.indexOf(',') !== -1) {
        where.where.date = {
          [Op.between]: [new Date(query.date.split(',')[0]), new Date(query.date.split(',')[1])]
        }
      } else if (query.date && query.date.indexOf(',') === -1) {
        where.where.date = query.date
      }
      let queryObj = {
        include: [
          {
            model: teachers,
            where: teachersWhere.where
          },
          {
            model: students
          }
        ],
        where: where.where,
        limit: Number(query.lessonsPerPage),
        offset: Number(query.lessonsPerPage) * query.page - Number(query.lessonsPerPage),
      }
      console.log(queryObj)
      LessonsModel.findAndCountAll(queryObj).then(result => {
        resolve(result)
      })
    })
  },

  createLessons: (ctx) => {
    return new Promise((resolve, reject) => {
      let lessons = []

      function nextDate (dayOfWeek, start) {
        let date = new Date(start)
        date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7)
        return date
      }

      if (ctx.request.body.lessonsCount) {
        let lessonsCount = ctx.request.body.lessonsCount
        if (lessonsCount > 300) {
          lessonsCount = 300
        }
        let date = new Date(ctx.request.body.firstDate)
        let year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()
        let lastDateLesson = new Date(year + 1, month, day)

        let pushForDate = (lastDate, index, dayIndex) => {
          lessons.push({
            title: ctx.request.body.title + index,
            date: nextDate(ctx.request.body.days[dayIndex], lastDate)
          })
          lastDate = nextDate(ctx.request.body.days[dayIndex], lastDate)
          lastDate = new Date(lastDate).setDate(new Date(lastDate).getDate() + 1)
          if (index++ < lessonsCount && lastDate < new Date(lastDateLesson)) {
            dayIndex++
            if (dayIndex + 1 === ctx.request.body.days.length) {
              dayIndex = 0
            }
            pushForDate(lastDate, index, dayIndex)
          }
        }
        pushForDate(new Date(ctx.request.body.firstDate), 1, 0)
      } else if (ctx.request.body.lastDate) {
        let datesCompare = (first, second) => {
          let one = new Date(first.getFullYear(), first.getMonth(), first.getDate())
          let two = new Date(second.getFullYear(), second.getMonth(), second.getDate())
          let millisecondsPerDay = 1000 * 60 * 60 * 24
          let millisBetween = two.getTime() - one.getTime()
          let days = millisBetween / millisecondsPerDay
          return Math.floor(days)
        }
        let lastDateLesson = ctx.request.body.lastDate
        if (datesCompare(new Date(ctx.request.body.firstDate), new Date(lastDateLesson)) > 365) {
          let date = new Date(ctx.request.body.firstDate)
          let year = date.getFullYear()
          let month = date.getMonth()
          let day = date.getDate()
          lastDateLesson = new Date(year + 1, month, day)
        }

        let pushForDate = (lastDate, index, dayIndex) => {
          lessons.push({
            title: ctx.request.body.title + index,
            date: nextDate(ctx.request.body.days[dayIndex], lastDate)
          })
          lastDate = nextDate(ctx.request.body.days[dayIndex], lastDate)
          lastDate = new Date(lastDate).setDate(new Date(lastDate).getDate() + 1)
          index++
          if (lastDate < new Date(lastDateLesson) && index < 300) {
            dayIndex++
            if (dayIndex + 1 === ctx.request.body.days.length) {
              dayIndex = 0
            }
            pushForDate(lastDate, index, dayIndex)
          }
        }
        pushForDate(new Date(ctx.request.body.firstDate), 1, 0)
      } else {
        return resolve() // @ToDo error on params
      }
      return LessonsModel.bulkCreate(lessons).then(result => {
        let lessonIds = []
        result.map(item => {
          lessonIds.push(item.id)
        })
        Teachers.connectTeachersToLessons(lessonIds, ctx.request.body.teacherIds).then(result2 => {
          resolve(result2)
        })
      })
    })
  }
}

module.exports = Lessons
