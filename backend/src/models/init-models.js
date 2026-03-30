const DataTypes = require("sequelize").DataTypes;
const _courses = require("./courses");
const _download_records = require("./download_records");
const _feedbacks = require("./feedbacks");
const _points_logs = require("./points_logs");
const _resource_tag_map = require("./resource_tag_map");
const _resources = require("./resources");
const _system_logs = require("./system_logs");
const _tags = require("./tags");
const _users = require("./users");

function initModels(sequelize) {
  const courses = _courses(sequelize, DataTypes);
  const download_records = _download_records(sequelize, DataTypes);
  const feedbacks = _feedbacks(sequelize, DataTypes);
  const points_logs = _points_logs(sequelize, DataTypes);
  const resource_tag_map = _resource_tag_map(sequelize, DataTypes);
  const resources = _resources(sequelize, DataTypes);
  const system_logs = _system_logs(sequelize, DataTypes);
  const tags = _tags(sequelize, DataTypes);
  const users = _users(sequelize, DataTypes);

  resources.belongsToMany(tags, { as: 'tag_ID_tags', through: resource_tag_map, foreignKey: "resource_ID", otherKey: "tag_ID" });
  tags.belongsToMany(resources, { as: 'resource_ID_resources', through: resource_tag_map, foreignKey: "tag_ID", otherKey: "resource_ID" });
  resources.belongsTo(courses, { as: "course", foreignKey: "course_ID"});
  courses.hasMany(resources, { as: "resources", foreignKey: "course_ID"});
  download_records.belongsTo(resources, { as: "resource", foreignKey: "resource_ID"});
  resources.hasMany(download_records, { as: "download_records", foreignKey: "resource_ID"});
  resource_tag_map.belongsTo(resources, { as: "resource", foreignKey: "resource_ID"});
  resources.hasMany(resource_tag_map, { as: "resource_tag_maps", foreignKey: "resource_ID"});
  resource_tag_map.belongsTo(tags, { as: "tag", foreignKey: "tag_ID"});
  tags.hasMany(resource_tag_map, { as: "resource_tag_maps", foreignKey: "tag_ID"});
  download_records.belongsTo(users, { as: "user", foreignKey: "user_ID"});
  users.hasMany(download_records, { as: "download_records", foreignKey: "user_ID"});
  feedbacks.belongsTo(users, { as: "user", foreignKey: "user_ID"});
  users.hasMany(feedbacks, { as: "feedbacks", foreignKey: "user_ID"});
  feedbacks.belongsTo(users, { as: "admin", foreignKey: "admin_ID"});
  users.hasMany(feedbacks, { as: "admin_feedbacks", foreignKey: "admin_ID"});
  points_logs.belongsTo(users, { as: "user", foreignKey: "user_ID"});
  users.hasMany(points_logs, { as: "points_logs", foreignKey: "user_ID"});
  resources.belongsTo(users, { as: "uploader", foreignKey: "uploader_ID"});
  users.hasMany(resources, { as: "resources", foreignKey: "uploader_ID"});
  system_logs.belongsTo(users, { as: "operator", foreignKey: "operator_ID"});
  users.hasMany(system_logs, { as: "system_logs", foreignKey: "operator_ID"});

  return {
    courses,
    download_records,
    feedbacks,
    points_logs,
    resource_tag_map,
    resources,
    system_logs,
    tags,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
