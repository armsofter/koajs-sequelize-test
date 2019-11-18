
'use strict'
module.exports = function (sequelize, DataTypes) {
  var lesson_teachers = sequelize.define('lesson_teachers', {
      lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'lessons',
          key: 'id'
        }
      },
      teacher_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'teachers',
          key: 'id'
        }
      }
    },
    {timestamps: false})

  return lesson_teachers
}
