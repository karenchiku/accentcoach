import { languagesytle } from './language.module.css';
import utilStyles from '../styles/utils.module.css'
import { useState } from 'react'

export const language = 'zh'

export function LanguageOption(){

        const [language, setLanguage] = useState('zh');
        
        return(
            <div className={utilStyles.headingMd}>
                <div className={languagesytle.buttonconstaniner}>
               
                <div className={language === 'en' ? languagesytle.selectedtext : languagesytle.buttontext} onClick={() => setLanguage('en')}>EN</div>
                <div> | </div> 
                <div className={language === 'zh' ? languagesytle.selectedtext : languagesytle.buttontext} onClick={() => setLanguage('zh')}>CH</div>
                
                </div>
            </div>

        )
}