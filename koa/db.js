const mysql = require("mysql");

const pool = mysql.createPool({
	host: "127.0.0.1",
	user: "root",
	password: "123456",
	database: "koa_session"
});

module.exports = (sql, values) => {
	return new Promise((resolve, reject) => {
		pool.getConnection((err, connection) => {
			if (err) {
				reject(err);
			} else {
				// sql = "select * from _mysql_session_store;"
				connection.query(sql, values, (error, rows) => {
					if (error) {
						reject(error);
					} else {
						resolve(rows);
					}
					connection.release();
				})
			}
		})
	})
}
