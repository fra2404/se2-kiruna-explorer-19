import { useEffect, useRef, useState } from 'react';
import kiruna from '../assets/kiruna.jpg';
import { useNavigate } from 'react-router-dom';
import ButtonRounded from '../components/atoms/button/ButtonRounded';
import CountUp from 'react-countup';
import AOS from 'aos';
import 'aos/dist/aos.css';
import enFlag from '../assets/en-flag.png';
import itFlag from '../assets/it-flag.png';
import svFlag from '../assets/sv-flag.png';

const texts = {
  en: {
    title: 'Kiruna',
    description: `A city on the move to protect its future. Kiruna faces a unique challenge: moving an entire city to prevent it from collapsing due to mining activities. This colossal project reflects a vision for sustainability and heritage. Discover how Kiruna is reinventing itself while preserving its cultural identity. Learn more`,
    learnMore: 'here',
    wikiLink: 'https://en.wikipedia.org/wiki/Kiruna',
    seeMap: 'See The Map',
    seeDiagram: 'See The Diagram',
    stats: [
      { name: 'Budget', value: 1400000000, prefix: '€', suffix: '' },
      { name: 'People affected', value: 23000, suffix: '' },
      { name: 'Historic Buildings relocated', value: 21, suffix: '' },
      { name: 'New Kiruna is ready!', value: 2033, isYear: true, suffix: '' },
    ],
  },
  it: {
    title: 'Kiruna',
    description: `Una città in movimento per proteggere il suo futuro. Kiruna affronta una sfida unica: spostare un'intera città per evitare che crolli a causa delle attività minerarie. Questo colossale progetto riflette una visione di sostenibilità e patrimonio. Scopri come Kiruna si sta reinventando preservando la sua identità culturale. Scopri di più`,
    learnMore: 'qui',
    wikiLink: 'https://it.wikipedia.org/wiki/Kiruna',
    seeMap: 'Vedi La Mappa',
    seeDiagram: 'Vedi Il Diagramma',
    stats: [
      { name: 'Bilancio', value: 1400000000, prefix: '€', suffix: '' },
      { name: 'Persone coinvolte', value: 23000, suffix: '' },
      { name: 'Edifici storici trasferiti', value: 21, suffix: '' },
      {
        name: 'La nuova Kiruna è pronta!',
        value: 2033,
        isYear: true,
        suffix: '',
      },
    ],
  },
  sv: {
    title: 'Kiruna',
    description: `En stad på väg att skydda sin framtid. Kiruna står inför en unik utmaning: att flytta en hel stad för att förhindra att den kollapsar på grund av gruvverksamhet. Detta kolossala projekt speglar en vision för hållbarhet och kulturarv. Upptäck hur Kiruna återuppfinner sig själv samtidigt som den bevarar sin kulturella identitet. Läs mer`,
    learnMore: 'här',
    wikiLink: 'https://sv.wikipedia.org/wiki/Kiruna',
    seeMap: 'Se Kartan',
    seeDiagram: 'Se Diagrammet',
    stats: [
      { name: 'Budget', value: 1400000000, prefix: '€', suffix: '' },
      { name: 'Påverkade personer', value: 23000, suffix: '' },
      { name: 'Historiska byggnader flyttade', value: 21, suffix: '' },
      { name: 'Nya Kiruna är klar!', value: 2033, isYear: true, suffix: '' },
    ],
  },
};

type Language = 'en' | 'it' | 'sv';

const LandingPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language>('en');
  const imgRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    AOS.init({ duration: 2000 });

    let xOffset = 0;
    let yOffset = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      xOffset = (clientX / innerWidth - 0.5) * 100; // Increase the multiplier for more movement
      yOffset = (clientY / innerHeight - 0.5) * 100; // Increase the multiplier for more movement
    };

    const updatePosition = () => {
      const imgElement = imgRef.current;
      if (imgElement) {
        const maxXOffset = (imgElement.clientWidth - window.innerWidth) / 2;
        const maxYOffset = (imgElement.clientHeight - window.innerHeight) / 2;
        const limitedXOffset = Math.max(
          -maxXOffset,
          Math.min(maxXOffset, xOffset),
        );
        const limitedYOffset = Math.max(
          -maxYOffset,
          Math.min(maxYOffset, yOffset),
        );
        imgElement.style.transform = `translate(${limitedXOffset}px, ${limitedYOffset}px)`;
      }
      requestRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  const text = texts[language];

  return (
    <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 w-full h-screen cursor-default">
      <img
        ref={imgRef}
        alt="Kiruna"
        src={kiruna}
        className="absolute inset-0 -z-10 w-full h-full object-cover object-right md:object-center opacity-10 transition-transform duration-200 scale-110" // Ingrandisci l'immagine
      />
      <div
        aria-hidden="true"
        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
        />
      </div>
      <div className="absolute top-4 right-4 flex space-x-2">
        <ButtonRounded
          className={`text-xs bg-black cursor-pointer ${language === 'en' ? 'border-2 border-white' : ''}`}
          text={<img src={enFlag} alt="English" className="w-5 h-5" />}
          onClick={() => setLanguage('en')}
        />
        <ButtonRounded
          className={`text-xs bg-black cursor-pointer ${language === 'it' ? 'border-2 border-white' : ''}`}
          text={<img src={itFlag} alt="Italiano" className="w-5 h-5" />}
          onClick={() => setLanguage('it')}
        />
        <ButtonRounded
          className={`text-xs bg-black cursor-pointer ${language === 'sv' ? 'border-2 border-white' : ''}`}
          text={<img src={svFlag} alt="Svenska" className="w-5 h-5" />}
          onClick={() => setLanguage('sv')}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0" data-aos="fade-up">
          <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            {text.title}
          </h2>
          <p className="mt-8 text-pretty text-lg font-medium text-gray-300 sm:text-xl/8">
            {text.description}{' '}
            <a
              href={text.wikiLink}
              target="blank"
              className="text-white cursor-pointer"
            >
              {text.learnMore}
            </a>
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
          <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
            {text.stats.map((stat) => (
              <div
                key={stat.name}
                className="flex flex-col-reverse gap-1"
                data-aos="fade-up"
              >
                <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                <dd className="text-4xl font-semibold tracking-tight text-white">
                  {stat.isYear ? (
                    <CountUp
                      start={1900}
                      end={stat.value}
                      duration={2.5}
                      suffix={stat.suffix || ''}
                      separator=""
                    />
                  ) : (
                    <CountUp
                      end={stat.value}
                      duration={2.5}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      separator=","
                    />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <ButtonRounded
          className="mr-16 text-lg bg-black cursor-pointer"
          text={text.seeMap}
          onClick={() => navigate('/map')}
        />
        <ButtonRounded
          className="text-lg bg-black cursor-pointer"
          text={text.seeDiagram}
          onClick={() => navigate('/diagram')}
        />
      </div>
    </div>
  );
};

export default LandingPage;
