'use strict'
module.exports = function (sequelize, DataTypes) {
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

  students.hasMany(lesson_students, {foreignKey: 'student_id'});
  return students
}

