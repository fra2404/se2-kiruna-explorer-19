import kiruna from '../assets/kiruna.jpg';
import { useNavigate } from 'react-router-dom';
import ButtonRounded from '../components/atoms/button/ButtonRounded';

const stats = [
    { name: 'Budget', value: '€1.4 billion' },
    { name: 'People affected', value: '23 000' },
    { name: 'Historic Buildings relocated', value: '21' },
    { name: 'New Kiruna is ready!', value: 'By 2033' },
]

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32 w-full h-screen">
            <img
                alt="Kiruna"
                src={kiruna}
                className="absolute inset-0 -z-10 size-full object-cover object-right md:object-center opacity-10"
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
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">Kiruna</h2>
                    <p className="mt-8 text-pretty text-lg font-medium text-gray-300 sm:text-xl/8">
                        A city on the move to protect it's future. 
                        Kiruna, faces a unique challenge: 
                        moving an entire city to prevent it from collapsing due to mining activities. 
                        This colossal project reflects a vision for sustainability and heritage. 
                        Discover how Kiruna is reinventing itself while preserving its cultural identity.
                        Learn more <a href="https://fr.wikipedia.org/wiki/Kiruna" className="text-white cursor-pointer">here</a>
                    </p>
                </div>
                <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                    <dl className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                        <div key={stat.name} className="flex flex-col-reverse gap-1">
                            <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                            <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
                        </div>
                        ))}
                    </dl>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
                <ButtonRounded className="mr-5" text="See The Map" onClick={() => navigate('/map')} />
                <ButtonRounded text="See The Diagram" onClick={() => navigate('/diagram')} />
            </div>
        </div>
      )
}

export default LandingPage;