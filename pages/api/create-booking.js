const sql = require('mssql');
import config from '../../config/config';

const pool = new sql.ConnectionPool(config);

//0 init, 1 student confrimed, 2 pay completed, 3 teacher confirmed, 4 applied cancel, 6 refund completed

export default async function handler(req, res) {

  if (req.method === 'POST') {
    try {
      await pool.connect();

       const orderid = `aacp${(new Date()).getTime()}${Math.floor(Math.random() * 100)}`;
      const {  username, phone, email, itemname, amount, bookingdate } = req.body;
      const request = new sql.Request(pool);
      request.input('username', sql.NVarChar, username);
      request.input('phone', sql.VarChar, phone);
      request.input('email', sql.VarChar, email);
      request.input('itemname', sql.NVarChar, itemname);
      request.input('amount', sql.VarChar, amount);
      request.input('bookingdate', sql.DateTime, bookingdate);
      request.input('orderid', sql.VarChar, orderid);
      request.input('created_datetime', sql.DateTime, new Date());


      const result = await request.query(`
        INSERT INTO accentcoach_bookings (orderid, username, phone, email, itemname, amount, bookingdate, created_datetime, paytatus, bookstatus)
        VALUES (@orderid, @username, @phone, @email, @itemname, @amount, @bookingdate, @created_datetime, 0,0)
      `);

      res.status(200).json({orderid});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: 'Error creating booking'});
    } finally {
      await pool.close();
    }
  } else {
    res.status(404).end();
  }


}