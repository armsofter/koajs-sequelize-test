'use strict'
module.exports = function (sequelize, DataTypes) {
  var lesson_students = sequelize.define('lesson_students', {
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    visit: {
      type: DataTypes.BOOLEAN
      // allowNull defaults to true
    }
  },
    {timestamps: false})

  var students = sequelize.define('students', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {timestamps: false})

  var lessons = sequelize.define('lessons', {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: '0'
      }
    },
    {timestamps: false})

  lesson_students.belongsTo(students, {foreignKey: 'student_id'});
  lesson_students.belongsTo(lessons, {foreignKey: 'lesson_id'});
  return lesson_students
}
