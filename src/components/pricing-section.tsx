import styles from './pricing-section.module.css';

const websiteOffers = [
  {
    name: 'Landing page',
    description: 'Satu halaman untuk memperkenalkan bisnis, layanan, atau penawaranmu.',
    price: '1,999k',
    fullPrice: 'Rp1.999.000',
    details: ['Pembuatan landing page', 'Scope disepakati sebelum pengerjaan'],
    featured: false,
  },
  {
    name: 'Website company profile',
    description: 'Ruang yang lebih lengkap untuk mengenalkan bisnis dan layananmu.',
    price: '3,499k',
    fullPrice: 'Rp3.499.000',
    details: ['Sekitar 5–8 halaman', 'Scope disepakati sebelum pengerjaan'],
    featured: true,
  },
];

const optionalExtras = [
  { name: 'Domain', extension: '.com', price: 'Rp250.000', period: '/tahun' },
  { name: 'Domain', extension: '.id', price: 'Rp300.000', period: '/tahun' },
  { name: 'Domain', extension: '.co.id', price: 'Rp350.000', period: '/tahun' },
  { name: 'Hosting dan pengelolaan dasar', price: 'Rp400.000', period: '/tahun' },
  { name: 'Update konten kecil', price: 'Rp150.000–300.000', period: 'per permintaan' },
];

export default function PricingSection({ contactUrl }: { contactUrl: string }) {
  function inquiry(subject: string) {
    const url = new URL(contactUrl);
    url.searchParams.set('text', `Halo Conqueror Studio, saya ingin mendiskusikan ${subject}.`);
    return url.toString();
  }

  return (
    <section id="pricing" className={'section-space ' + styles.section} aria-labelledby="pricing-heading" lang="id">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Pricing / Conqueror Studio</p>
          <h2 id="pricing-heading">Harga jelas,<br />sebelum mulai.</h2>
        </div>
        <p className={styles.intro}>Mulai dari website sekali bayar.<br />Tambahan hanya jika kamu membutuhkannya.</p>
      </div>

      <div className={styles.grid}>
        {websiteOffers.map(offer => (
          <article className={styles.card + (offer.featured ? ' ' + styles.featured : '')} key={offer.name}>
            <span className={styles.badge}>Website · Sekali bayar</span>
            <h3>{offer.name}</h3>
            <p className={styles.description}>{offer.description}</p>
            <div className={styles.priceBlock}>
              <p className={styles.priceLabel} lang="en">Start from</p>
              <p className={styles.price}><span className={styles.srOnly}>{offer.fullPrice}</span><span aria-hidden="true">{offer.price}</span></p>
              <p className={styles.paymentNote}>Biaya pembuatan sekali bayar</p>
            </div>
            <ul className={styles.details}>
              {offer.details.map(detail => <li key={detail}><span aria-hidden="true">✓</span>{detail}</li>)}
              <li><span aria-hidden="true">↗</span><a href="#pricing-extras">Tambahan opsional dipilih terpisah</a></li>
            </ul>
            <a className={styles.cta} href={inquiry(offer.name)} target="_blank" rel="noopener noreferrer" aria-label={'Diskusikan ' + offer.name + ' melalui WhatsApp'}>Diskusikan proyek <span aria-hidden="true">↗</span></a>
          </article>
        ))}

        <article className={styles.card}>
          <span className={styles.badge}>Discovery lebih dulu</span>
          <h3>Solusi custom</h3>
          <p className={styles.description}>Untuk kebutuhan sistem bisnis, automation, dan AI yang lebih spesifik.</p>
          <div className={styles.priceBlock}>
            <p className={styles.priceLabel}>Penawaran personal</p>
            <p className={styles.customPrice}>Sesuai scope</p>
            <p className={styles.paymentNote}>Harga ditentukan setelah discovery</p>
          </div>
          <div className={styles.customServices}>
            <div><h4>Business systems</h4><p>Scope, integrasi, risiko, dan estimasi pengerjaan menjadi dasar penawaran.</p></div>
            <div><h4>Automation &amp; AI</h4><p>Proses, sumber data, integrasi, biaya pihak ketiga, dan hasil yang diharapkan dibahas sebelum proposal.</p></div>
          </div>
          <a className={styles.cta} href={inquiry('kebutuhan sistem bisnis atau automation & AI')} target="_blank" rel="noopener noreferrer">Diskusikan kebutuhan <span aria-hidden="true">↗</span></a>
        </article>
      </div>

      <p className={styles.scopeNote}>Harga pembuka menjadi acuan awal. Scope dan harga final disepakati sebelum pengerjaan.</p>

      <div id="pricing-extras" className={styles.extras}>
        <div className={styles.extrasIntro}>
          <p className={styles.eyebrow}>Sesuai kebutuhanmu</p>
          <h3>Tambahan opsional.</h3>
          <p>Dipilih terpisah dari pembuatan website. Biaya tahunan hanya berlaku untuk layanan tambahan yang kamu pilih.</p>
          <a className={styles.extrasLink} href={inquiry('tambahan domain, hosting, atau update konten')} target="_blank" rel="noopener noreferrer">Tanyakan tambahan <span aria-hidden="true">↗</span></a>
        </div>
        <table className={styles.table}>
          <caption className={styles.srOnly}>Harga pembuka untuk tambahan opsional website</caption>
          <thead><tr><th scope="col">Komponen</th><th scope="col">Harga pembuka</th></tr></thead>
          <tbody>{optionalExtras.map(extra => (
            <tr key={extra.name + (extra.extension || '')}>
              <th scope="row">{extra.name}{extra.extension && <> <span className={styles.extension}>{extra.extension}</span></>}</th>
              <td><span className={styles.extraAmount}>{extra.price}</span><span className={styles.extraPeriod}>{extra.period.startsWith('/') ? '' : ' '}{extra.period}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}
