'use strict'
module.exports = function (sequelize, DataTypes) {
  var teachers = sequelize.define('teachers', {
      name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {timestamps: false})

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

  teachers.hasMany(lesson_teachers, {foreignKey: 'teachers_id'});

  return teachers
}
