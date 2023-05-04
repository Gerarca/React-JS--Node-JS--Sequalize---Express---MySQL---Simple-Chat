var DataTypes = require("sequelize").DataTypes;
var _Chat = require("./chat");

function initModels(sequelize) {
  var Chat = _Chat(sequelize, DataTypes);


  return {
    Chat,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

const output = "./entities/models";
const options = {
  directory: output,
  caseFile: "l",
  caseModel: "p",
  caseProp: "c",
  lang: "js",
  useDefine: false,
  singularize: true,
  spaces: true,
  indentation: 2,
  host: "127.0.0.1",
};

const sequelize = new Sequelize(
  "chat", "root", "", {
    dialect: "mysql",
    ...options,
  }
);

export const baseDataSource = initModels(sequelize);