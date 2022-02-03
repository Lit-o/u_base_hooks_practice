import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Container } from 'react-bootstrap';
import './App.css';

// hooks можно использовать только внутри компонентов, нельзя в for if и так далее.
// useCallback мемоизирует функции, коллбеки, чтобы они не вызывались каждый раз при рендере
// useMemo мемоизирует значение, чтобы если его расчет тяжелый, он не производился зря при каждом рендере
// в useMemo нельзя помещать побочные эффекты - запросы, подписки, тк этот хук запускается во время рендеринга
// можно мемоизировать объекты
// применять и useCallback и useMemo не надо повсеместно, 
// только если делаются ненужные запросы на сервер или если происходят действительно сложные вычисления

const countTotal = (num) => {
    console.log('counting + 10 ===>>>')
    return num + 10
}

const Slider = (props) => {

    const myRef = useRef(null)

    const FocusRef = () => {
        myRef.current.focus();
    }

    const myRefValueVault = useRef(1)
    // somewhere in code onClick={() => myRefValueVault.current++ } 
    // в итоге useRef можно использовать как хранилище данных расчета
    // которые срабатывают и записываются без перерендеринга
    // обновление и изменения рефов не вызывает перерендеринга, 
    // что в какие-то моменты может помочь сделать рассчеты при этом не попадая в петлю перерендера
    // так же можно еще и сохранять предидущее состояние

    // const sliderStateArray = useState();
    // console.log(sliderStateArray);
    const [slideState, setSlideState] = useState(0);
    const [autoplay, setAutoplay] = useState(false);

    // так же можно еще и сохранять предидущее состояние
    // записываем предидущее состояние slideState в myRefValueVault
    useEffect(() => {
        myRefValueVault.current = slideState
    })

    const fetchingImg = useCallback(() => {
        console.log('fetching')
        return [
            "https://all4desktop.com/data_images/original/4247303-bay.jpg",
            "https://www.traveloffpath.com/wp-content/uploads/2020/08/phuket-thailand-reopening.jpg.webp",
            "http://www.angelbach.com/wp-content/uploads/2018/04/DSC05584.jpg"
        ]
    }, [slideState])

    const logger = (n) => {
        console.log('Login' + n)
    }

    // useEffect(() => {
    //     window.addEventListener('click', () => { logger(slideState) })
    //     // return в useEffect это аналог willUnmount здесь снимаем подписки, 
    //     // чтобы они не зависали в памяти при удалении компоненте 
    //     return () => {
    //         window.removeEventListener('click', () => { logger(slideState) })
    //     }
    // }, [slideState])


    const changeSlide = (i) => {
        setSlideState(slideState => slideState + i)
    }

    function toggleAutoplay() {
        setAutoplay(autoplay => !autoplay);
        // setAutoplay(autoplay => !autoplay) прописываем если зависит от предыдущего состояния
        // setAutoplay(!autoplay) прописываем если не зависит от предыдущего состояния
    }

    const total = useMemo(() => {
        return countTotal(slideState);
    }, [slideState]);


    return (
        <Container>
            <div className="slider w-50 m-auto">
                {/* {
                    fetchingImg().map((url, i) => {
                        return (
                            <img className="d-block w-100" src={url} key={i} alt="slide" />
                        )
                    })
                } */}

                <Slides fetchingImg={fetchingImg}/>

                <div className="text-center mt-5">Active slide {slideState} <br />{autoplay ? 'Autoplay ON' : 'Autoplay OFF'}</div>
                <div className="text-center mt-5" onClick={FocusRef}>Test useMemo {total} </div>
                <div className="buttons mt-3">
                    <button 
                        className="btn btn-primary me-2"
                        onClick={() => changeSlide(-1)}>-1</button>
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => changeSlide(1)}>+1</button>
                    <button
                        ref={myRef}
                        className="btn btn-primary me-2"
                        onClick={toggleAutoplay}
                    >toggle autoplay</button>
                </div>
            </div>
        </Container>
    )
}

const Slides = ({ fetchingImg }) => {
    const [images, setImages] = useState([])

    useEffect(() => {
        setImages(fetchingImg())
    }, [fetchingImg])

    return (
        <>
            {images.map((url, i) => <img className="d-block w-100" src={url} key={i} alt="slide" />)}
        </>
    )
}


function App() {
    return (
        <Slider />
    );
}

export default App;
