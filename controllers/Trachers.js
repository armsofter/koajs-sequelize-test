const TeachersModel = require('../models/index').lesson_teachers;

const Teachers = {
  connectTeachersToLessons: (ids, teachers) => {
    return new Promise((resolve, reject) => {
      let bulkData = [];
      ids.map(id => {
        teachers.map(t => {
          bulkData.push({lesson_id: id, teacher_id: t})
        })
      })
      console.log(bulkData)
      TeachersModel.bulkCreate(bulkData).then(result => {
        resolve(result);
      })
    });
  }
}

module.exports = Teachers;
