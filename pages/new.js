import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Layout, { siteTitle } from '../components/layout'
import Head from 'next/head';
import utilStyles from '../styles/utils.module.css'
import formStyles from '../styles/form.module.css'
import { checkEmail } from '../components/utils/email'

export default function paymentsucess() {
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [username, setUserName] = useState('');
    // const router = useRouter();
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const [ishasRecording, setIshasRecording] = useState(false);

    const handleStartRecording = async () => {
        setAudioURL('');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log(audioUrl);
            setAudioURL(audioUrl);
            audioChunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setRecording(true);
    };

    const handleStopRecording = () => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    const handleEmailChange = (e) => {
        const enteredEmail = e.target.value;
        const isValid = checkEmail(enteredEmail);
        setEmail(enteredEmail);
        setIsValidEmail(isValid);
    };

    const handleSubmitRecording = () => {
        setIshasRecording(true);

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

                    <div className={utilStyles.textMd}>
                        <p>請念出以下句子, 並按下錄音寄出給我們</p>
                        <p>1. Is the laundry dry yet? I’ve been waiting for hours!</p>
                        <p>2. My brother says he doesn’t have any siblings. Mom, what do you think about that?</p>
                        <p>3. There’s a construction cone blocking the road ahead. Let’s turn left instead.</p>
                    </div>
                    <br />
                    <div className={utilStyles.flexcc}>
                        {recording ? (
                            <button className={formStyles.button} onClick={handleStopRecording}>停止錄音</button>)
                            : (<button className={formStyles.button} onClick={handleStartRecording}> {audioURL ? '重新錄音' : '開始錄音'}</button>)
                        }
                    </div>
                    {audioURL && (
                        <div className={formStyles.audioresult}>
                            <audio controls src={audioURL} type="audio/mpeg" />

                            <div className={formStyles.inputcontanier}>
                                <div className={formStyles.inputlabel}>您的名子</div>
                                <input className={formStyles.input} placeholder="jacky cheng" type="text" value={username} onChange={(e) => setUserName(e.target.value)} />
                            </div>
                            <div className={formStyles.inputcontanier}>
                                <div className={formStyles.inputlabel}>Email</div>
                                <input className={formStyles.input} placeholder="jackycheng@gmail.com" type="email" value={email} onChange={handleEmailChange} />
                                {!isValidEmail && <p className={formStyles.invalid}>請輸入正確email</p>}
                            </div>
                            <div className={utilStyles.flexcc}>
                                {ishasRecording ? (<p className={formStyles.invalid}>已傳送過一次錄音, 請等待老師回覆</p>) 
                                : (<button className={formStyles.button} onClick={handleSubmitRecording}>傳送錄音</button>)}
                            </div>
                            <div className={utilStyles.textSm}>
                                <div className={utilStyles.pbold}>注意事項</div>
                                <p>*請務必填寫與預約時相同的<span className={utilStyles.pbold}>email</span></p>
                                <p>*每個email僅限傳送一次</p>

                            </div>
                        </div>
                    )}
                </div>

            </section>
        </Layout>
    );
};


