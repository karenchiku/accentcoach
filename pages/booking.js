import Head from 'next/head'
import { useRouter } from 'next/router';
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import formStyles from '../styles/form.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { checkEmail } from '../components/utils/email'

export default function Order() {
  const router = useRouter();
  const [username, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [amount, setAmount] = useState('');
  const [itemname, setItemName] = useState('');
  const [bookingdate, setBookingdate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false)
  const teacherid = 1;
  const [options, setOptions] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      await fetch('/api/get-timesheet', {
        method: 'POST',
        body: JSON.stringify({ teacherid }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {

          setOptions(data)
        })
        .catch(error => {
          // console.log(error);
          router.push('/error')
        });
    }

    fetchData();
  }, [teacherid]);

  const handleEmailChange = (e) => {
    const enteredEmail = e.target.value;
    const isValid = checkEmail(enteredEmail);
    setEmail(enteredEmail);
    setIsValidEmail(isValid);
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    setIsSubmitting(true);

    await fetch('/api/create-booking', {
      method: 'POST',
      body: JSON.stringify({ username, phone, email, itemname, amount, bookingdate }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.orderid) {
          router.push(`/checkout/${data.orderid}`);
        }
      })
      .catch(error => {
        console.log(error);
      });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section>
        <div className={`${utilStyles.textMd} ${formStyles.content}`}>
          <div className={formStyles.formtitle}>
            <h1>預約課程</h1>
            {/* <div className={formStyles.line}></div> */}
          </div>

          <div className={utilStyles.flexc}>
            <div className={formStyles.twomode}>
              <h1 className={formStyles.twomodeheader}>Child</h1>
              <h3>(1) 2000/hr NTD</h3>
              <h3>(2) 3000/hr NTD</h3>
              

            </div>
            <div className={formStyles.twomode}>
              <h1 className={formStyles.twomodeheader}>Adult</h1>
              <h3>3000/hr NTD</h3>
         
            </div>
          </div>
          <br />
          <br />
          <div>
          <div className={formStyles.inputcontanier}>
              <div className={formStyles.inputlabel}><p>使用者名稱:*</p></div>
              <input className={formStyles.input} type="text" value={username} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div className={formStyles.inputcontanier}>
              <div className={formStyles.inputlabel}><p>連絡電話:*</p></div>
              <input className={formStyles.input} type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className={formStyles.inputcontanier}>
              <div className={formStyles.inputlabel}><p>email:*</p></div>
              <input className={formStyles.input} type="email" value={email} onChange={handleEmailChange} />
              {!isValidEmail && <p className={formStyles.invalid}>請輸入正確email</p>}
            </div>

            <div className={formStyles.inputcontanier}>
              <label className={formStyles.inputlabel} for="amount">大人/小孩:*</label>
              <select className={formStyles.select} id="amount" name="amount" value={itemname} onChange={(e) => {setAmount(e.target.value.split('-')[1]); setItemName(e.target.value)}}>
                <option value="0">請選擇</option>
                <option value="大人-3000">大人(3000)</option>
                <option value="小孩-3000">小孩(3000)</option>
                <option value="小孩-2500">小孩(2500)</option>
              </select>
            </div>
            <div className={formStyles.inputcontanier}>
              <label className={formStyles.inputlabel} for="bookingdate">預約日期時段:*</label>
              <select className={formStyles.select} id="bookingdate" name="bookingdate" value={bookingdate} onChange={(e) => setBookingdate(e.target.value)}>
               <option value="1900-01-01">請選擇</option>
                {options.map((option) => (
                  <option value={option.opendatetime.replace('T',' ').replace(':000Z','')}>{option.opendatetime.replace(':00.000Z','').replace('T',' ')}</option>))} 
              </select>
            </div>
          </div>

          <div className={utilStyles.flexcc}>
            <button className={formStyles.button} type="submit" onClick={handleSubmit}>預約課程</button>
            {isSubmitting ? ' 預約中...' : ''}
          </div>
          <div className={utilStyles.textSm}>
            <div className={utilStyles.pbold}>注意事項</div>
            <p>*請務必填寫正確<span className={utilStyles.pbold}>電話與email</span>, 可以透過填寫資料<Link href="/searchbooking">查詢</Link>目前預約狀態</p>
            <p>*取消政策:免費取消, 預約上課時間前48小時前取消可全額退款</p>
            <p>*上課時間為指定時段, 請準時抵達教室</p>          
          </div>

        </div>
      </section >
    </Layout >
  );
};

