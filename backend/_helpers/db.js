/**
 * Database config file
 */
const path = require("path");
const config = require("_config/config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
const logger = require("./logger");
const models = require("../models");

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exists
    const { host, port, user, password, database, timezone } = config.database;
    const connection = await mysql.createConnection({
        host,
        port,
        user,
        password,
    });

    // Check db connction
    connection.connect(function (err) {
        if (err) throw err;
        console.log("DB Connected !!");
    });

    // Check db state
    if (connection.state === "disconnected") {
        return respond(null, { status: "fail", message: "server down" });
    }
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, {
        dialect: "mysql",
        timezone,
        logging: (msg) =>
            process.env.NODE_ENV === "production"
                ? logger.info(msg)
                : console.log(msg)
    });

    // Testing the connection
    try {
        await sequelize.authenticate();
        process.env.NODE_ENV === "production"
            ? logger.info("Connection has been established successfully.")
            : console.log("Connection has been established successfully.");
    } catch (error) {
        process.env.NODE_ENV === "production"
            ? logger.error(`Unable to connect to the database: ${error}`)
            : console.error(`Unable to connect to the database: ${error}`);
    }

    /// init models and add them to the exported db object
    if (models.length > 0) {
        models.forEach((file) => {
            let model = require(path.join(__dirname, "..", "models", file))(
                sequelize
            );
            db[model.name] = model;
        });
        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });
    }
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    // sync all models with database
    // await sequelize.sync({
    //     force: false,
    //     alter: false,
    // });
}
