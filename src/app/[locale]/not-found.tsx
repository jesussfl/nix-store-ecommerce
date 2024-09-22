import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')
  return (
    <div style={{ maxWidth: 510 }}>
      <h1>{t(`title`)}</h1>
    </div>
  )
}
