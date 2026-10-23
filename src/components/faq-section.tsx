import styles from './faq-section.module.css';

const generalFaqs = [
  {
    question: 'Apa saja layanan Conqueror Studio?',
    answer: 'Kami menyediakan desain dan pengembangan website custom, workflow automation untuk mengurangi pekerjaan manual, serta integrasi tools agar sistem yang kamu gunakan saling terhubung.',
  },
  {
    question: 'Berapa biaya pembuatan website? Apakah harus berlangganan?',
    answer: 'Landing page mulai dari Rp1.999.000 dan website company profile mulai dari Rp3.499.000, dengan biaya pembuatan sekali bayar. Domain, hosting, dan pembaruan konten merupakan tambahan opsional. Untuk sistem bisnis, automation, dan integrasi, kami menyusun penawaran setelah membahas kebutuhanmu.',
  },
  {
    question: 'Berapa lama proses pengerjaannya?',
    answer: 'Kami memberikan estimasi setelah meninjau jumlah halaman, kesiapan konten, serta kebutuhan fitur atau integrasi. Kamu dan tim Conqueror menyepakati scope serta jadwal sebelum pengerjaan dimulai.',
  },
  {
    question: 'Bisa menghubungkan website dengan tools yang sudah saya gunakan?',
    answer: 'Kami dapat meninjau kebutuhan integrasi, seperti CRM atau email marketing, sekaligus peluang mengotomasi pekerjaan berulang. Sebelum menawarkan solusi, kami memeriksa akses integrasi, sumber data, keamanan, dan biaya layanan pihak ketiga. Pekerjaan ini memiliki scope dan penawaran terpisah dari harga dasar website.',
  },
  {
    question: 'Bagaimana cara memulai dan apa yang perlu saya siapkan?',
    answer: 'Hubungi kami melalui WhatsApp atau email dan ceritakan tujuan proyekmu. Siapkan informasi bisnis, referensi desain, serta logo dan konten yang sudah tersedia. Jika ada bahan yang belum siap, sampaikan saat diskusi awal agar kita bisa menentukan kebutuhan sebelum mulai.',
  },
];

const exclusions = [
  'Penulisan seluruh konten dan penyediaan foto profesional',
  'Revisi tanpa batas',
  'E-commerce, checkout, dan payment gateway',
  'Login pengguna atau dashboard administrasi khusus',
  'Integrasi API atau layanan pihak ketiga',
  'WhatsApp automation dan workflow AI',
  'SEO lanjutan atau jaminan peringkat pencarian',
  'Update konten rutin tanpa kuota dan biaya terpisah',
  'SLA, dukungan 24/7, serta jaminan hasil bisnis',
];

export default function FaqSection() {
  return (
    <section id="faq" className={'section-space ' + styles.section} aria-labelledby="faq-heading" lang="id">
      <div className={styles.intro}>
        <h2 id="faq-heading">FAQs.</h2>
        <p>Supaya scope jelas sejak awal.</p>
      </div>
      <div className={styles.list}>
        {generalFaqs.map(faq => (
          <details className={styles.item} key={faq.question}>
            <summary>
              <span>{faq.question}</span>
              <span className={styles.symbol} aria-hidden="true">+</span>
            </summary>
            <div className={styles.answer}><p>{faq.answer}</p></div>
          </details>
        ))}
        <details className={styles.item}>
          <summary>
            <span>Apa saja yang tidak termasuk harga dasar pembuatan website?</span>
            <span className={styles.symbol} aria-hidden="true">+</span>
          </summary>
          <div className={styles.answer}>
            <p>Harga awal pada bagian Pricing berlaku untuk scope dasar pembuatan website. Hal-hal berikut tidak otomatis termasuk:</p>
            <ul>{exclusions.map(item => <li key={item}>{item}</li>)}</ul>
            <p>Jika proyek membutuhkan fitur atau layanan tambahan, scope, biaya, dan kelayakannya dibahas sebelum pengerjaan.</p>
          </div>
        </details>
      </div>
    </section>
  );
}
