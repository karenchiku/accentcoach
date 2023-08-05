import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout, { siteTitle } from '../../components/layout'
import Head from 'next/head';
import utilStyles from '../../styles/utils.module.css'
import formStyles from '../../styles/form.module.css'

export default function paymentsucess() {

    const router = useRouter();
    const { orderid } = router.query;
    const [booking, setBooking] = useState([]);
    const [isloading, setIsLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {

            await fetch('/api/get-booking', {
                method: 'POST',
                body: JSON.stringify({ orderid }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data) {
                        setBooking(data);
                        // console.log(booking)
                        setIsLoading(false);
                    }

                })
                .catch(error => {
                    console.log(error);
                });
        }

        fetchData();
        setIsLoading(true);
    }, [orderid])


    const handleSearch = () => {
        router.push('/searchbooking');
    };
    const handleClick = () => {
        router.push('/');
    };

    return (
        <Layout>
            <Head>
                <title>{siteTitle}</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>
            {!isloading ? (
                <section>
                    <div className={`${utilStyles.textMd} ${formStyles.content}`}>
                        <div className={formStyles.formtitle}>
                            <h1>付款結果 : 付款成功 </h1>
                        </div>
                        <div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>訂單編號：</p></div>
                                <div className={utilStyles.five} ><p>{booking.orderid}</p></div>
                            </div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>預約項目:</p></div>
                                <div className={utilStyles.five} ><p>{booking.itemname}</p></div>
                            </div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>預約日期:</p></div>
                                <div className={utilStyles.five} ><p>{booking.bookingdate}</p></div>
                            </div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>使用者名稱:</p></div>
                                <div className={utilStyles.five} ><p>{booking.username}</p></div>
                            </div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>連絡電話:</p></div>
                                <div className={utilStyles.five} ><p>{booking.phone}</p></div>
                            </div>
                            <div className={utilStyles.flexcc}>
                                <div className={utilStyles.three}><p>email:</p></div>
                                <div className={utilStyles.five} ><p>{booking.email}</p></div>
                            </div>
                            <br />
                            <div className={utilStyles.flexcc}>
                                <button className={formStyles.button} onClick={handleSearch}>查詢訂單狀態</button>
                                <button className={formStyles.button} onClick={handleClick}>返回主頁</button>
                            </div>
                        </div>
                    </div>
                </section>) : null}
        </Layout>
    );
};


