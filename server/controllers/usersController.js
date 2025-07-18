const pool = require('../db');

exports.getUsers = async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
  res.json(result.rows);
};

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
  res.json(result.rows[0]);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
  res.json(result.rows[0]);
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.sendStatus(204);
};
