
const sql = require('mssql');
const crypto = require('crypto');
import { computeCheckMacValue } from '../../components/utils/checkmachinevalue';

import config from '../../config/config';
const pool = new sql.ConnectionPool(config);

const MERCHANT_ID = process.env.MERCHANT_ID;
const HASH_KEY = process.env.HASH_KEY;
const HASH_IV = process.env.HASH_IV;

export default async function ecpaycallback(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }


  const { RtnCode, RtnMsg, MerchantID, MerchantTradeNo, PaymentDate, PaymentType, PaymentTypeChargeFee, TradeNo, TradeDate, TradeAmt, CheckMacValue } = req.body
  const data = req.body
  console.log('before delete', data)
  delete data.CheckMacValue;
  console.log('after delete', data)
  const calculateCheckMacValue = computeCheckMacValue(data);
  try {

    if (1 == 1) {  // chage to chcekmacvalue
      await handleResult(RtnCode, RtnMsg, MerchantID, MerchantTradeNo, PaymentDate, PaymentType, PaymentTypeChargeFee, TradeNo, TradeDate, TradeAmt, CheckMacValue, calculateCheckMacValue)
      await handleRtncode(RtnCode, MerchantTradeNo, PaymentDate)
      await handleTimeSheet(MerchantTradeNo)

      res.status(200).send('1|OK')

    } else {
      res.status(400).send('0|FAIL')
    }

  } catch (err) {
    console.log(err)
    res.status(400).send('0|FAIL')
  }

}
//updata the rtncode to the database
async function handleRtncode(RtnCode, MerchantTradeNo, PaymentDate) {
  try {
    await pool.connect();
    const request = new sql.Request(pool);
    request.input('MerchantTradeNo', sql.VarChar, MerchantTradeNo);
    request.input('RtnCode', sql.VarChar, RtnCode);
    request.input('PaymentDate', sql.DateTime, PaymentDate);
    const result = await request.query(`
        UPDATE dbo.accentcoach_bookings
        SET paystatus = @RtnCode , payment_completed_datetime = @PaymentDate
        WHERE orderid = @MerchantTradeNo
    `);
  } catch (err) {
    console.log(err);
  } finally {
    await pool.close();
  }
}

//updata the rtncode to the database
async function handleTimeSheet(RtnCode, MerchantTradeNo, PaymentDate) {
  try {
    await pool.connect();
    const request = new sql.Request(pool);
    request.input('MerchantTradeNo', sql.VarChar, MerchantTradeNo);
    const result = await request.query(`
        exec dbo.sp_UpdateAccentCoachTimeSheetStatus @MerchantTradeNo
    `);
  } catch (err) {
    console.log(err);
  } finally {
    await pool.close();
  }
}

//insert the result to database 
async function handleResult(RtnCode, RtnMsg, MerchantID, MerchantTradeNo, PaymentDate, PaymentType, PaymentTypeChargeFee, TradeNo, TradeDate, TradeAmt, CheckMacValue, calculateCheckMacValue) {
  try {
    await pool.connect();
    const request = new sql.Request(pool);
    request.input('MerchantID', sql.VarChar, MerchantID);
    request.input('MerchantTradeNo', sql.VarChar, MerchantTradeNo);
    request.input('RtnCode', sql.VarChar, RtnCode);
    request.input('RtnMsg', sql.NVarChar, RtnMsg);
    request.input('PaymentDate', sql.DateTime, PaymentDate);
    request.input('PaymentType', sql.VarChar, PaymentType);
    request.input('PaymentTypeChargeFee', sql.VarChar, PaymentTypeChargeFee);
    request.input('TradeNo', sql.VarChar, TradeNo);
    request.input('TradeDate', sql.DateTime, TradeDate);
    request.input('TradeAmt', sql.Int, TradeAmt);
    request.input('CheckMacValue', sql.VarChar, CheckMacValue);
    request.input('CalculateCheckMacValue', sql.VarChar, calculateCheckMacValue);
    const result = await request.query(`
        INSERT INTO [accentcoach_epaycallback] (MerchantID, MerchantTradeNo, RtnCode, RtnMsg, PaymentDate, PaymentType, PaymentTypeChargeFee, TradeNo, TradeDate, TradeAmt , CheckMacValue,CalculateCheckMacValue)
        VALUES (@MerchantID, @MerchantTradeNo, @RtnCode, @RtnMsg, @PaymentDate, @PaymentType,@PaymentTypeChargeFee, @TradeNo, @TradeDate, @TradeAmt, @CheckMacValue, @CalculateCheckMacValue)
        `);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.close();
  }
}


// [Object: null prototype] {
//   CustomField1: '',
//   CustomField2: '',
//   CustomField3: '',
//   CustomField4: '',
//   MerchantID: '2000132',
//   MerchantTradeNo: 'aacp168394433458368',
//   PaymentDate: '2023/05/13 10:20:37',
//   PaymentType: 'Credit_CreditCard',
//   PaymentTypeChargeFee: '60',
//   RtnCode: '1',
//   RtnMsg: 'Succeeded',
//   SimulatePaid: '0',
//   StoreID: '',
//   TradeAmt: '3000',
//   TradeDate: '2023/05/13 10:19:58',
//   TradeNo: '2305131019589927',
//   CheckMacValue: 'F8C57828A5E5DFB301402E2922336E8DE080C5A4F76E4F77DAB58674C674022F'
// }


// // 計算 CheckMacValue
// const computeCheckMacValue = (data) => {
//   // 將參數按照參數名稱的字母順序排序
//   const sortedData = Object.keys(data).sort().reduce((acc, key) => {
//     acc[key] = data[key];
//     return acc;
//   }, {});

//   if (sortedData.CheckMacValue) {
//     delete sortedData.CheckMacValue
//   }

//   // 將參數轉換成 URL 字串
//   // const urlEncodedData = querystring.stringify(sortedData);
//   const urlEncodedString = Object.entries(sortedData).map(([key, value]) => `${key}=${value}`).join('&');
//   // 將 HashKey 加到 URL 字串的前面，將 HashIV 加到 URL 字串的後面
//   const urlEncodedDataWithHash = `HashKey=${HASH_KEY}&${urlEncodedString}&HashIV=${HASH_IV}`;
//   // console.log(urlEncodedDataWithHash)
//   // 將 URL 字串轉換成小寫的 STRING
//   const lowercaseEncodedDataWithHash = encodeURIComponent(urlEncodedDataWithHash).toLowerCase().replace(/%20/g, "+");

//   // console.log(lowercaseEncodedDataWithHash)
//   // 使用 SHA256 加密 HEX 字串，並轉換成大寫的 SHA256 字串
//   const hash = crypto.createHash('sha256').update(lowercaseEncodedDataWithHash).digest('hex').toUpperCase();
//   return hash;
// };
