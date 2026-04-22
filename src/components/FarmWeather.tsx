import {AnimatePresence, motion} from 'motion/react';
import {useState} from 'react';
import {useLocalWeather} from '../hooks/useLocalWeather';

const IMPORT_META_ENV = (import.meta as ImportMeta & {env?: {DEV?: boolean}}).env;

export type WeatherType = 'sunny' | 'cloudy' | 'rainy' | 'sunset' | 'night';

const WEATHER_ORDER: WeatherType[] = ['sunny', 'cloudy', 'rainy', 'sunset', 'night'];

const CLOUDS = [
  {id: 'cloud-a', top: '14%', width: 220, height: 78, duration: 22, delay: 0, opacity: 0.48},
  {id: 'cloud-b', top: '21%', width: 168, height: 58, duration: 26, delay: 3, opacity: 0.42},
  {id: 'cloud-c', top: '11%', width: 190, height: 64, duration: 30, delay: 6, opacity: 0.34},
  {id: 'cloud-d', top: '28%', width: 132, height: 46, duration: 18, delay: 2, opacity: 0.28},
];

export const getRainStreakConfig = (index: number) => ({
  id: `rain-${index}`,
  left: `${(index * 13) % 100}%`,
  delay: `${(index % 7) * 0.16}s`,
  duration: `${1.08 + (index % 5) * 0.1}s`,
  opacity: 0.22 + (index % 4) * 0.08,
  scale: 0.72 + (index % 3) * 0.14,
  heightClassName: 'h-24',
});

const RAIN_STREAKS = Array.from({length: 36}, (_, index) => getRainStreakConfig(index));

const WEATHER_LABELS: Record<WeatherType, string> = {
  sunny: 'SUNNY',
  cloudy: 'CLOUDY',
  rainy: 'RAINY',
  sunset: 'SUNSET',
  night: 'NIGHT',
};

export const getNextWeather = (currentWeather: WeatherType): WeatherType => {
  const currentIndex = WEATHER_ORDER.indexOf(currentWeather);
  return WEATHER_ORDER[(currentIndex + 1) % WEATHER_ORDER.length];
};

export const shouldShowWeatherDebugToggle = (
  isDevelopment: boolean,
  externalWeather?: WeatherType,
): boolean => isDevelopment && externalWeather === undefined;

const WeatherButton = ({
  currentWeather,
  onToggle,
}: {
  currentWeather: WeatherType;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-label="切换天气"
    onClick={onToggle}
    className="pointer-events-auto fixed top-4 right-4 z-50 rounded-full border border-white/30 bg-white/14 px-4 py-2 text-xs font-black tracking-[0.24em] text-white shadow-[0_8px_30px_rgba(15,23,42,0.28)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/18 active:translate-y-0"
  >
    {`WEATHER: ${WEATHER_LABELS[currentWeather]}`}
  </button>
);

const SunnyLayer = () => (
  <>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.6, ease: 'easeOut'}}
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(circle at 76% 18%, rgba(255,225,120,0.42) 0%, rgba(255,214,74,0.28) 12%, rgba(255,212,88,0.12) 24%, rgba(255,255,255,0) 42%)',
      }}
    />
    <motion.div
      animate={{scale: [1, 1.08, 1], opacity: [0.42, 0.64, 0.42]}}
      transition={{duration: 4.5, repeat: Infinity, ease: 'easeInOut'}}
      className="absolute right-[10%] top-[7%] h-40 w-40 rounded-full blur-2xl"
      style={{
        background:
          'radial-gradient(circle, rgba(255,220,96,0.68) 0%, rgba(255,201,71,0.3) 52%, rgba(255,201,71,0) 75%)',
      }}
    />
    <motion.div
      animate={{rotate: 360}}
      transition={{duration: 18, repeat: Infinity, ease: 'linear'}}
      className="absolute right-[11%] top-[8%] h-28 w-28 rounded-full"
      style={{
        background:
          'conic-gradient(from 0deg, rgba(255,234,164,0.18), rgba(255,189,61,0.92), rgba(255,234,164,0.18))',
        boxShadow: '0 0 50px rgba(255,200,74,0.3)',
      }}
    >
      <div className="absolute inset-[18%] rounded-full bg-yellow-200/95 shadow-[inset_0_-8px_14px_rgba(245,158,11,0.25)]" />
    </motion.div>
  </>
);

const CloudLayer = ({stormy = false}: {stormy?: boolean}) => (
  <div className="absolute inset-0 overflow-hidden">
    {CLOUDS.map((cloud) => (
      <motion.div
        key={cloud.id}
        initial={{x: '-18vw', opacity: 0}}
        animate={{
          x: ['-12vw', '108vw'],
          y: [0, -10, 0],
          opacity: [0, cloud.opacity, cloud.opacity],
        }}
        transition={{
          duration: cloud.duration,
          repeat: Infinity,
          ease: 'linear',
          delay: cloud.delay,
        }}
        className="absolute rounded-full blur-[1px]"
        style={{
          top: cloud.top,
          width: cloud.width,
          height: cloud.height,
          background: stormy
            ? 'linear-gradient(180deg, rgba(148,163,184,0.88) 0%, rgba(71,85,105,0.9) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(203,213,225,0.84) 100%)',
          boxShadow: stormy
            ? '0 20px 40px rgba(15,23,42,0.22)'
            : '0 16px 38px rgba(148,163,184,0.16)',
        }}
      >
        <div className="absolute -left-[10%] top-[30%] h-[62%] w-[42%] rounded-full bg-inherit" />
        <div className="absolute left-[26%] -top-[22%] h-[76%] w-[38%] rounded-full bg-inherit" />
        <div className="absolute right-[8%] top-[18%] h-[68%] w-[34%] rounded-full bg-inherit" />
      </motion.div>
    ))}
  </div>
);

const RainLayer = () => (
  <>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.45, ease: 'easeOut'}}
      className="absolute inset-0 bg-[linear-gradient(180deg,rgba(37,99,235,0.18)_0%,rgba(15,23,42,0.34)_65%,rgba(12,18,32,0.48)_100%)]"
    />
    <CloudLayer stormy />
    <div className="absolute inset-0 overflow-hidden">
      {RAIN_STREAKS.map((streak) => (
        <span
          key={streak.id}
          className={`farm-weather-rain absolute top-[-22%] block ${streak.heightClassName} w-[2px] rounded-full`}
          style={{
            left: streak.left,
            opacity: streak.opacity,
            transform: `rotate(14deg) scaleY(${streak.scale})`,
            animationDelay: streak.delay,
            animationDuration: streak.duration,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(219,234,254,0.88) 40%, rgba(255,255,255,0) 100%)',
            boxShadow: '0 0 10px rgba(191,219,254,0.35)',
          }}
        />
      ))}
    </div>
  </>
);

const SunsetLayer = () => (
  <>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.65, ease: 'easeOut'}}
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(249,115,22,0.22) 0%, rgba(251,146,60,0.18) 22%, rgba(244,114,182,0.14) 55%, rgba(88,28,135,0.14) 100%)',
      }}
    />
    <div
      className="absolute inset-x-0 bottom-0 h-[48%]"
      style={{
        background:
          'radial-gradient(circle at 50% 100%, rgba(255,220,160,0.42) 0%, rgba(255,190,92,0.24) 16%, rgba(255,190,92,0.08) 30%, rgba(255,255,255,0) 54%)',
      }}
    />
    <motion.div
      animate={{opacity: [0.28, 0.42, 0.28], scale: [1, 1.04, 1]}}
      transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
      className="absolute bottom-[16%] left-1/2 h-32 w-64 -translate-x-1/2 rounded-[50%] blur-3xl"
      style={{
        background:
          'radial-gradient(circle, rgba(254,215,170,0.62) 0%, rgba(251,146,60,0.26) 52%, rgba(251,146,60,0) 76%)',
      }}
    />
  </>
);

const NightLayer = () => (
  <>
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.65, ease: 'easeOut'}}
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(180deg, rgba(10,15,34,0.54) 0%, rgba(15,23,42,0.46) 38%, rgba(8,13,25,0.58) 100%)',
      }}
    />
    <div
      className="absolute right-[11%] top-[10%] h-24 w-24 rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(254,249,195,0.85) 0%, rgba(250,250,210,0.18) 46%, rgba(255,255,255,0) 70%)',
        boxShadow: '0 0 42px rgba(250,250,210,0.22)',
      }}
    />
    {Array.from({length: 14}, (_, index) => (
      <motion.span
        key={`night-star-${index}`}
        animate={{opacity: [0.18, 0.72, 0.24], scale: [0.85, 1.08, 0.9]}}
        transition={{
          duration: 2.8 + (index % 4) * 0.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.16,
        }}
        className="absolute block rounded-full bg-white"
        style={{
          top: `${8 + (index * 7) % 32}%`,
          left: `${12 + (index * 11) % 74}%`,
          width: `${2 + (index % 2)}px`,
          height: `${2 + (index % 2)}px`,
          boxShadow: '0 0 10px rgba(255,255,255,0.32)',
        }}
      />
    ))}
  </>
);

export default function FarmWeather({externalWeather}: {externalWeather?: WeatherType}) {
  const liveWeather = useLocalWeather();
  const [debugWeather, setDebugWeather] = useState<WeatherType | null>(null);
  const currentWeather = externalWeather ?? debugWeather ?? liveWeather;
  const showDebugToggle = shouldShowWeatherDebugToggle(Boolean(IMPORT_META_ENV?.DEV), externalWeather);

  return (
    <>
      <style>{`
        @keyframes farm-weather-rain-fall {
          0% {
            transform: translate3d(-16px, -18vh, 0) rotate(14deg);
          }
          100% {
            transform: translate3d(44px, 118vh, 0) rotate(14deg);
          }
        }

        .farm-weather-rain {
          animation-name: farm-weather-rain-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-0" data-current-weather={currentWeather}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentWeather}
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.5, ease: 'easeInOut'}}
            className="absolute inset-0"
          >
            {currentWeather === 'sunny' ? <SunnyLayer /> : null}
            {currentWeather === 'cloudy' ? (
              <>
                <motion.div
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(203,213,225,0.2)_48%,rgba(148,163,184,0.14)_100%)]"
                />
                <CloudLayer />
              </>
            ) : null}
            {currentWeather === 'rainy' ? <RainLayer /> : null}
            {currentWeather === 'sunset' ? <SunsetLayer /> : null}
            {currentWeather === 'night' ? <NightLayer /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {showDebugToggle ? (
        <WeatherButton
          currentWeather={currentWeather}
          onToggle={() =>
            setDebugWeather((previousWeather) => getNextWeather(previousWeather ?? liveWeather))
          }
        />
      ) : null}
    </>
  );
}
