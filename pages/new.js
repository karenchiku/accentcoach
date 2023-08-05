import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout, { siteTitle } from '../components/layout'
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css'
import formStyles from '../styles/form.module.css'
import { checkEmail } from '../components/utils/email'

export default function paymentsucess() {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [username, setUserName] = useState('');
    const router = useRouter();

    const handleEmailChange = (e) => {
        const enteredEmail = e.target.value;
        const isValid = checkEmail(enteredEmail);
        setEmail(enteredEmail);
        setIsValidEmail(isValid);
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
            <section>
            <div className={`${utilStyles.textMd} ${formStyles.content}`}>

                    <div className={formStyles.formtitle}>
                        <h1>錄下你/妳的發音</h1>
                    </div>
                    <div className={formStyles.inputcontanier}>
                        <div className={formStyles.inputlabel}>您的名子</div>
                        <input className={formStyles.input} placeholder="jacky cheng" type="text" value={username} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className={formStyles.inputcontanier}>
                        <div className={formStyles.inputlabel}>Email</div>
                        <input className={formStyles.input} placeholder="jackycheng@gmail.com" type="email" value={email} onChange={handleEmailChange} />
                        {!isValidEmail && <p className={formStyles.invalid}>請輸入正確email</p>}
                    </div>

                    <div className={utilStyles.textMd}>
                        <p>請念出以下句子, 並按下錄音寄出給我們</p>
                        <p>1. Is the laundry dry yet? I’ve been waiting for hours!</p>
                        <p>2. My brother says he doesn’t have any siblings. Mom, what do you think about that?</p>
                        <p>3. There’s a construction cone blocking the road ahead. Let’s turn left instead.</p>

                    </div>

                    <div className={utilStyles.flexcc}>
                        <button className={formStyles.button} onClick={handleClick}>按下錄音</button>
                    </div>
                </div>

            </section>
        </Layout>
    );
};


