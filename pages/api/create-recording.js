const sql = require('mssql');
import config from '../../config/config';

const pool = new sql.ConnectionPool(config);

export default async function handler(req, res) {

  if (req.method === 'POST') {
    try {
      await pool.connect();

      const { username, email, audiobuffer } = req.body;
      const request = new sql.Request(pool);
      request.input('username', sql.NVarChar, username);
      request.input('email', sql.NVarChar, email);
      request.input('audiobuffer', sql.VarBinary, audiobuffer);

      const result = await request.query(`
        INSERT INTO accentcoach_recording (username, email, audiobuffer)
        VALUES ( @username, @email, @audiobuffer)
      `);
      res.status(200).json({"result": "ok"});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error creating newsletters' });
    } finally {
      await pool.close();
    }
  } else {
    res.status(404).end();
  }

}