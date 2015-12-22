"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "手机号码不能为空"  
        },
        isNumeric: {
          args: true,
          msg: "手机号码必须为数字"  
        }
      }
    },
    email: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "姓名不能为空"  
        }
      }
    },
    password: {
      type: DataTypes.STRING
    },
    department_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: "部门不能为空"  
        }
      }
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    activated: {
      type: DataTypes.BOOLEAN
    },
    after_hangup: {
      type: DataTypes.STRING
    },
    job_code: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: "工号不能为空"  
        }
      }
    },
    extensioned: {
      type: DataTypes.BOOLEAN
    },
    device_no: {
      type: DataTypes.STRING
    },
    device_type: {
      type: DataTypes.STRING
    },
    after_work_timeout: {
      type: DataTypes.INTEGER
    },
    answer_mode: {
      type: DataTypes.STRING
    },
    default_ani: {
      type: DataTypes.STRING
    },
    sip_password: {
      type: DataTypes.STRING
    },
    remember_created_at: {
      type: DataTypes.DATE
    },
    current_sign_in_at: {
      type: DataTypes.DATE
    },
    last_sign_in_at: {
      type: DataTypes.DATE
    },
    current_sign_in_ip: {
      type: DataTypes.STRING
    },
    last_sign_in_ip: {
      type: DataTypes.STRING
    }
  }, {
    defaultScope: {
        where: { deleted: false }
    },
    underscored: true,
    classMethods: {
      associate: function(models) {
        User.belongsToMany(models.Role, { through: 'users_roles' });
        User.belongsTo(models.Department)
      }
    },
    instanceMethods: {
      showErr: function(errors, field) {
        var mes = [];
        for(var i=0; i < errors.length; i++){
          var err = errors[i];
          if(err.path==field){
           mes.push(err.message);
          }
        }
        return mes.join(",");
      }
    }
  });
  return User;
};