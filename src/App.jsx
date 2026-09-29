import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const metrics = [
  { value: "58%", label: "Increase in pick-up point use" },
  { value: "23%", label: "Fewer customer phone calls" },
  { value: "27%", label: "Increase in pick-up point use" },
  { value: "40%", label: "Fewer customer phone calls" },
];

const headline = [..."WELCOME ITZFIZZ"];

function App() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const carRef = useRef(null);
  const roadLinesRef = useRef(null);

  useGSAP(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const letters = gsap.utils.toArray(".headline-letter", pageRef.current);
    const stats = gsap.utils.toArray(".stat", pageRef.current);

    if (reduceMotion) return;

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(letters, { y: 34, opacity: 0, duration: 0.8, stagger: 0.045 })
      .from(stats, { y: 24, opacity: 0, duration: 0.7, stagger: 0.14 }, "-=0.35")
      .from(carRef.current, { opacity: 0, duration: 0.7 }, "-=0.55");

    gsap.set(letters, { opacity: 0.24 });

    const carWidth = () => carRef.current.getBoundingClientRect().width;
    const drive = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    drive.fromTo(carRef.current, { x: () => -carWidth() }, { x: () => window.innerWidth });
    drive.fromTo(roadLinesRef.current, { x: 0 }, { x: () => -(window.innerWidth + carWidth()) * 0.9 }, 0);

    letters.forEach((letter, index) => {
      drive.to(letter, { opacity: 1, duration: 0.06 }, 0.12 + (index / letters.length) * 0.72);
    });

    drive.to(stats, { y: -8, duration: 0.35, stagger: 0.07 }, 0.34);
  }, { scope: pageRef });

  return (
    <main ref={pageRef}>
      <div className="hero-wrap">
        <section className="hero" ref={heroRef} aria-label="Welcome to Itzfizz">
          <header className="hero-header">
            <p className="eyebrow"><span className="eyebrow-dot" /> Motion study / 001</p>
            <p className="edition">Built for the journey</p>
          </header>

          <h1 className="headline" aria-label="Welcome Itzfizz">
            {headline.map((character, index) => character === " " ? (
              <span className="headline-space" aria-hidden="true" key={index} />
            ) : (
              <span className="headline-letter" aria-hidden="true" key={index}>{character}</span>
            ))}
          </h1>

          <div className="road" aria-hidden="true">
            <div className="road-lines" ref={roadLinesRef} />
            <img
              className="car"
              ref={carRef}
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1100&q=85"
              alt=""
              fetchPriority="high"
            />
            <span className="road-label">ITZFIZZ / DRIVE FORWARD</span>
          </div>

          <ul className="stats" aria-label="Performance metrics">
            {metrics.map(({ value, label }, index) => (
              <li className="stat" key={`${value}-${index}`}>
                <strong>{value}</strong>
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className="scroll-cue" aria-hidden="true">
            <span className="scroll-line" /> Scroll to move
          </div>
        </section>
      </div>

      <section className="outro" aria-label="End of experience">
        <span className="outro-index">ITZFIZZ / 2026</span>
        <p>Good things happen<br />when you keep moving.</p>
        <span className="outro-mark" aria-hidden="true">↗</span>
      </section>
    </main>
  );
}

export default App;