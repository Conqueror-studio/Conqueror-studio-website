import Image from 'next/image';

const technologies = [
  { name: 'Next.js', asset: 'nextjs.svg', width: 18, height: 18 },
  { name: 'TypeScript', asset: 'typescript.svg', width: 18, height: 18 },
  { name: 'Tailwind CSS', asset: 'tailwind.svg', width: 16, height: 15 },
  { name: 'shadcn/ui', asset: 'shadcn.svg', width: 15, height: 13 },
  { name: 'Framer Motion', asset: 'motion.svg', width: 18, height: 16 },
  { name: 'Vercel', asset: 'vercel.svg', width: 14, height: 12 },
];

export default function ToolsMarquee() {
  return <section className="technology-strip" aria-label="Our tools" data-figma-node="21:5024">
    <p>Powering our interfaces with industry-leading software &amp; tools</p>
    <div className="tools-window"><div className="tools-track">
      {[0, 1].map(copy => <ul className="tools-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {technologies.map(tool => <li key={tool.name}><Image src={'/figma/' + tool.asset} alt="" width={tool.width} height={tool.height} /><span>{tool.name}</span></li>)}
      </ul>)}
    </div></div>
    <label className="tools-pause"><input type="checkbox" /> Pause tools animation</label>
  </section>;
}
