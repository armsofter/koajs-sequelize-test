
'use strict'
module.exports = function (sequelize, DataTypes) {
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

  var teachers = sequelize.define('teachers', {
      name: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {timestamps: false})

  lessons.belongsToMany(students, {through: 'lesson_students', foreignKey: 'lesson_id', otherKey: 'student_id'});
  lessons.belongsToMany(teachers, {through: 'lesson_teachers', foreignKey: 'lesson_id', otherKey: 'teacher_id'});
  lessons.hasMany(lesson_students, {foreignKey: 'lesson_id'});
  lessons.hasMany(lesson_teachers, {foreignKey: 'lesson_id'});
  return lessons
}
