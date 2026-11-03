import { Download } from 'lucide-react'
import type { CVProfile } from '../profiles'
import type { Lang } from '../content'

export function DownloadCv({ profile, lang }: { profile: CVProfile; lang: Lang }) {
  return <details className="download-cv">
    <summary><Download size={16}/>{lang === 'en' ? 'Download CV' : 'Скачать резюме'}</summary>
    <div className="download-options">
      <p>{profile.label[lang]} · {lang.toUpperCase()}</p>
      {(['pdf', 'docx'] as const).map(format => <a key={format}
        href={`${import.meta.env.BASE_URL}cv/${profile.id}/${lang}.${format}`}
        download={`${profile.downloadName}_${lang.toUpperCase()}.${format}`}>
        <span>{format.toUpperCase()}</span><small>{format === 'pdf'
          ? (lang === 'en' ? 'Ready to send' : 'Для отправки')
          : (lang === 'en' ? 'Editable document' : 'Редактируемый документ')}</small><Download size={14}/>
      </a>)}
    </div>
  </details>
}
