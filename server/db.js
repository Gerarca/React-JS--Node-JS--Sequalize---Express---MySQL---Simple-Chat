import SequelizeAuto from "sequelize-auto"

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

var auto = new SequelizeAuto("chat", "root", "", {
  dialect: "mysql",
  ...options,
});

auto.run().then((data) => {
  const tableNames = Object.keys(data.tables);
  console.log(tableNames); 
});
