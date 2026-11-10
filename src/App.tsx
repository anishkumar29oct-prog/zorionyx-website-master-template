import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Atom, AudioWaveform, BrainCircuit,
  Check, ChevronRight, Cpu, ExternalLink, Globe2, Leaf, Menu, Orbit,
  Play, Radio, Send, Shield, Sparkles, X, Zap
} from 'lucide-react';

type Product = {
  name: string; category: string; description: string; accent: string;
  icon: typeof BrainCircuit; status: string; url?: string;
};

const products: Product[] = [
  { name: 'Tuvyra AI', category: 'AI-powered learning', description: 'An interactive learning environment exploring AI-assisted guidance, spatial classrooms and more engaging ways to learn.', accent: 'cyan', icon: BrainCircuit, status: 'In development', url: 'https://tutorai-spatial-classroom-1iaylw.v2.appdeploy.ai/' },
  { name: 'Sedavator AI', category: 'AI software creation', description: 'An AI-assisted software-building initiative designed to turn ideas into structured workflows, prototypes and applications.', accent: 'violet', icon: Cpu, status: 'In development', url: 'https://sedavator-ai-lv40zt.v2.appdeploy.ai/' },
  { name: 'Medicant AI', category: 'Healthcare technology', description: 'A healthcare-focused digital initiative exploring intelligent assistance and more accessible interactions with health information.', accent: 'blue', icon: Shield, status: 'In development', url: 'https://medicantai.floot.app/' },
  { name: 'Germinate AI', category: 'Agricultural intelligence', description: 'An AI and bio-soil analytics initiative exploring data-led insights for soil understanding and agricultural decisions.', accent: 'green', icon: Leaf, status: 'Planned', url: 'https://germinateai.floot.app/' },
  { name: 'Zyntra Motion Pictures', category: 'Entertainment & streaming', description: 'A creative motion-picture venture shaping original stories and a digital entertainment experience.', accent: 'pink', icon: AudioWaveform, status: 'Building' }
];

const navItems = ['Vision', 'About', 'Capabilities', 'Products', 'Partnerships'];

function NeuralScene() {
  const mount = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = mount.current;
    if (!host) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const coreGeometry = new THREE.IcosahedronGeometry(1.52, 5);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x102a55, wireframe: true, transparent: true, opacity: 0.72 });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.12, 4),
      new THREE.MeshBasicMaterial({ color: 0x39c7ff, wireframe: true, transparent: true, opacity: 0.16 })
    );
    group.add(inner);

    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0x8b7cff, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.008, 8, 180), ringMaterial);
    ring.rotation.set(1.05, 0.28, -0.3);
    group.add(ring);
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.45, 0.006, 8, 180), new THREE.MeshBasicMaterial({ color: 0x32d6ff, transparent: true, opacity: 0.48 }));
    ring2.rotation.set(0.3, 1.1, 0.5);
    group.add(ring2);

    const count = 1250;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.25 + Math.random() * 1.85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      const t = Math.random();
      colors[i * 3] = 0.16 + t * 0.35;
      colors[i * 3 + 1] = 0.62 + t * 0.25;
      colors[i * 3 + 2] = 1;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.88, sizeAttenuation: true }));
    group.add(particles);

    const light = new THREE.PointLight(0x40bfff, 2.5, 12);
    light.position.set(2, 2, 3);
    scene.add(light);
    const clock = new THREE.Clock();
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.55;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.35;
    };
    host.addEventListener('pointermove', onPointer);
    const resize = () => {
      if (!host) return;
      camera.aspect = host.clientWidth / Math.max(host.clientHeight, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const animate = () => {
      const t = clock.getElapsedTime();
      group.rotation.y += 0.0018;
      group.rotation.x = Math.sin(t * 0.24) * 0.12 + pointerY;
      group.rotation.y += pointerX * 0.0007;
      ring.rotation.z = t * 0.08;
      ring2.rotation.x = 0.3 + Math.sin(t * 0.16) * 0.08;
      particles.rotation.y = -t * 0.018;
      core.rotation.x = t * 0.055;
      inner.rotation.y = -t * 0.075;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      host.removeEventListener('pointermove', onPointer);
      coreGeometry.dispose(); coreMaterial.dispose(); inner.geometry.dispose();
      (inner.material as THREE.Material).dispose(); ring.geometry.dispose(); ringMaterial.dispose();
      ring2.geometry.dispose(); (ring2.material as THREE.Material).dispose();
      particleGeometry.dispose(); (particles.material as THREE.Material).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, []);
  return <div className="neural-scene" ref={mount} aria-label="Animated three-dimensional neural orbit visualization" />;
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [activeNav, setActiveNav] = useState('Vision');
  const [form, setForm] = useState({ name: '', email: '', organization: '', topic: 'Strategic partnership', message: '' });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.toLowerCase())).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setActiveNav(navItems.find(item => item.toLowerCase() === entry.target.id) || 'Vision'); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Zorionyx website inquiry — ${form.topic}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nOrganization: ${form.organization}\nTopic: ${form.topic}\n\n${form.message}`);
    window.location.href = `mailto:contact@zorionyx.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  return (
    <main className="site-shell">
      <div className="ambient-grid" />
      <div className="scanline" />
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Zorionyx home"><span className="logo-glyph"><Orbit size={21} /></span><span>ZORIONYX<span className="wordmark-dot">.</span></span></a>
        <nav className={`desktop-nav ${menuOpen ? 'nav-open' : ''}`}>
          {navItems.map(item => <a key={item} className={activeNav === item ? 'nav-active' : ''} href={`#${item.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Start a conversation <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot" /> INDEPENDENT TECHNOLOGY VENTURE <span className="eyebrow-line" /></div>
          <h1>Intelligence that<br /><span className="gradient-text">moves ideas</span><br />forward<span className="hero-period">.</span></h1>
          <p className="hero-lede">We explore the frontier where artificial intelligence, engineering and imagination converge — transforming ambitious ideas into meaningful digital experiences.</p>
          <div className="hero-actions"><a className="button button-primary" href="#products">Explore our ecosystem <ArrowRight size={16} /></a><a className="button button-ghost" href="#about"><Play size={14} /> Discover Zorionyx</a></div>
          <div className="hero-proof"><div className="proof-item"><strong>05</strong><span>Product initiatives</span></div><span className="proof-divider" /><div className="proof-item"><strong>04</strong><span>Technology domains</span></div><span className="proof-divider" /><div className="proof-item"><strong>∞</strong><span>Ideas in motion</span></div></div>
        </div>
        <div className="hero-visual"><div className="visual-orbit orbit-a" /><div className="visual-orbit orbit-b" /><div className="visual-label label-top"><span>NEURAL FIELD</span><b>ACTIVE</b></div><NeuralScene /><div className="visual-label label-bottom"><span>INTELLIGENCE CORE</span><b>SYS. 01 / 05</b></div><div className="float-chip chip-a"><Sparkles size={13} /> SYSTEMS THINKING</div><div className="float-chip chip-b"><Radio size={13} /> SIGNAL DETECTED</div></div>
        <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
      </section>

      <section className="ticker" aria-label="Areas of exploration"><div className="ticker-track">{['ARTIFICIAL INTELLIGENCE','SOFTWARE ENGINEERING','ROBOTICS & AUTOMATION','CONNECTED PLATFORMS','PRODUCT INNOVATION','ARTIFICIAL INTELLIGENCE','SOFTWARE ENGINEERING','ROBOTICS & AUTOMATION'].map((word,i) => <span key={i}>{word}<i>✳</i></span>)}</div></section>

      <section className="section about-section" id="about">
        <Reveal className="section-heading"><span className="section-index">01 / THE VISION</span><h2>Built for the <span className="gradient-text">next frontier.</span></h2><p>Technology should do more than function. It should expand what people can imagine, create and achieve.</p></Reveal>
        <div className="about-grid"><Reveal className="about-statement"><div className="statement-mark">“</div><h3>Curiosity is our starting point.<br /><em>Impact is our direction.</em></h3><p>Zorionyx is an emerging technology venture exploring ideas across intelligent software, digital platforms and future-facing engineering. We bring disciplines together to turn complex possibilities into clear, useful experiences.</p><a className="text-link" href="#capabilities">What drives us <ArrowUpRight size={15} /></a></Reveal><Reveal className="signal-card"><div className="signal-top"><span>OUR OPERATING PRINCIPLE</span><Sparkles size={17} /></div><div className="signal-graphic"><div className="signal-ring r1" /><div className="signal-ring r2" /><div className="signal-core"><Atom size={36} /></div><div className="signal-node n1" /><div className="signal-node n2" /><div className="signal-node n3" /></div><div className="signal-bottom"><b>IDEA → EXPERIMENT → EXPERIENCE</b><span>ALWAYS IN MOTION</span></div></Reveal></div>
      </section>

      <section className="section capabilities-section" id="capabilities">
        <Reveal className="section-heading"><span className="section-index">02 / WHAT WE EXPLORE</span><h2>Where disciplines <span className="gradient-text">connect.</span></h2><p>Our work spans a connected set of technology domains, each creating new ways to solve meaningful problems.</p></Reveal>
        <div className="capability-grid">
          {[
            {icon:BrainCircuit,number:'01',title:'Artificial intelligence',copy:'Conversational systems, AI-assisted workflows and practical intelligent applications.',tags:['Applied AI','Intelligent UX']},
            {icon:Cpu,number:'02',title:'Software engineering',copy:'Thoughtful interfaces, reliable application architecture and purposeful product development.',tags:['Web platforms','Product systems']},
            {icon:Globe2,number:'03',title:'Connected platforms',copy:'Web experiences, API integrations and digital systems designed to work together.',tags:['Digital ecosystems','Integration']},
            {icon:Zap,number:'04',title:'Emerging technologies',copy:'Exploration across robotics, automation, data and new engineering concepts.',tags:['Robotics','Automation']}
          ].map((item) => {const Icon=item.icon;return <Reveal className="capability-card" key={item.number}><div className="capability-top"><span>{item.number} / DOMAIN</span><Icon size={20}/></div><h3>{item.title}</h3><p>{item.copy}</p><div className="tag-row">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div><div className="card-arrow"><ArrowUpRight size={17}/></div></Reveal>;})}
        </div>
      </section>

      <section className="section products-section" id="products">
        <Reveal className="section-heading"><span className="section-index">03 / THE ECOSYSTEM</span><h2>Ideas becoming <span className="gradient-text">realities.</span></h2><p>A portfolio of initiatives at different stages — connected by a shared belief in technology with purpose.</p></Reveal>
        <div className="product-grid">{products.map((product,index)=>{const Icon=product.icon;return <Reveal className={`product-card accent-${product.accent}`} key={product.name}><div className="product-card-head"><div className="product-icon"><Icon size={22}/></div><span className="product-number">0{index+1}</span></div><div className="product-meta">{product.category}</div><h3>{product.name}</h3><p>{product.description}</p><div className="product-card-foot"><span className="status"><i />{product.status}</span>{product.url?<a href={product.url} target="_blank" rel="noreferrer" aria-label={`Explore ${product.name}`}><ArrowUpRight size={17}/></a>:<span className="coming-soon">COMING INTO FOCUS</span>}</div><div className="card-glow" /></Reveal>;})}</div>
      </section>

      <section className="manifesto"><div className="manifesto-noise" /><Reveal className="manifesto-inner"><span className="section-index">A PRINCIPLE WE BUILD BY</span><h2>The future isn't<br />found. It's <span className="gradient-text">engineered.</span></h2><p>We believe meaningful progress happens when bold thinking meets disciplined execution.</p><a className="button button-primary" href="#contact">Build with us <ArrowRight size={16}/></a></Reveal><div className="manifesto-orb"><NeuralScene /></div></section>

      <section className="section partnership-section" id="partnerships">
        <Reveal className="section-heading"><span className="section-index">04 / COLLABORATION</span><h2>Better futures are <span className="gradient-text">co-created.</span></h2><p>We welcome conversations with institutions, researchers, technology providers, investors and people who believe in building what's next.</p></Reveal>
        <div className="partner-grid"><Reveal className="partner-panel"><div className="partner-icon"><Globe2/></div><h3>Technology & infrastructure</h3><p>Cloud platforms, infrastructure providers, engineering communities and technology partners.</p><a href="#contact" className="text-link">Explore collaboration <ArrowUpRight size={15}/></a></Reveal><Reveal className="partner-panel"><div className="partner-icon"><Orbit/></div><h3>Research & incubation</h3><p>Academic institutions, research centres, incubators and innovation ecosystems.</p><a href="#contact" className="text-link">Explore collaboration <ArrowUpRight size={15}/></a></Reveal><Reveal className="partner-panel"><div className="partner-icon"><Sparkles/></div><h3>Strategic & investment</h3><p>Mission-aligned investors, mentors and strategic collaborators supporting early-stage innovation.</p><a href="#contact" className="text-link">Explore collaboration <ArrowUpRight size={15}/></a></Reveal></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-glow" />
        <div className="contact-layout"><Reveal className="contact-copy"><span className="section-index">05 / START SOMETHING</span><h2>Have a bold idea?<br /><span className="gradient-text">Let's explore it.</span></h2><p>Tell us what you're imagining. The most interesting things often begin with a conversation.</p><div className="contact-direct"><span className="contact-pulse" /> OPEN TO SELECT COLLABORATIONS</div><a className="contact-email" href="mailto:contact@zorionyx.com">contact@zorionyx.com <ArrowUpRight size={16}/></a></Reveal>
        <Reveal className="contact-form-wrap"><form className="contact-form" onSubmit={submit}><div className="form-title"><span>PROJECT / PARTNERSHIP INQUIRY</span><Sparkles size={16}/></div><div className="form-row"><label>Your name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name"/></label><label>Email address<input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@company.com"/></label></div><label>Organization <span className="optional">(optional)</span><input value={form.organization} onChange={e=>setForm({...form,organization:e.target.value})} placeholder="Company or institution"/></label><label>I'm interested in<select value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})}><option>Strategic partnership</option><option>Investment & funding</option><option>Research & incubation</option><option>Technology collaboration</option><option>General inquiry</option></select></label><label>Tell us a little more<textarea required rows={4} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Share your idea or how you'd like to collaborate..."/></label><button className="button button-primary submit-button" type="submit">Send inquiry <Send size={15}/></button>{formSent&&<span className="form-note"><Check size={14}/> Your email app should open with your inquiry.</span>}<span className="form-footnote">Your details are used only to respond to your inquiry.</span></form></Reveal></div>
      </section>

      <footer className="footer"><div className="footer-top"><a className="wordmark" href="#top"><span className="logo-glyph"><Orbit size={21}/></span><span>ZORIONYX<span className="wordmark-dot">.</span></span></a><p>Intelligence that moves ideas forward.</p><a className="back-top" href="#top">BACK TO TOP <ArrowUpRight size={14}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Zorionyx. All rights reserved.</span><div><a href="mailto:contact@zorionyx.com">Contact</a><a href="#partnerships">Partnerships</a><a href="#products">Ecosystem</a></div><span className="footer-signal"><i/> DESIGNED FOR WHAT'S NEXT</span></div></footer>
    </main>
  );
}

export default App;
