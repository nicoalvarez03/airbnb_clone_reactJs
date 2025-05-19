import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function PlaceGallery({place}){
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [sliderRef, instanceRef] = useKeenSlider({loop: true});


    const nextSlide = () => {
      instanceRef.current?.next();
    };
  
    const prevSlide = () => {
      instanceRef.current?.prev();
    };

    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowAllPhotos(false);
          document.body.style.overflow = '';
        }
      };
    
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (showAllPhotos)
    {
      document.body.style.overflow = 'hidden';
    
        return (
          <div className="fixed inset-0 text-white bg-black h-screen w-full z-[9999]">
            <div className="bg-black p-8 grid gap-4">
              <div>
                <h2 className="text-3xl mr-48">Photos of {place.title}</h2>
                <button
                  onClick={() => {
                    setShowAllPhotos(false);
                    document.body.style.overflow = '';
                  }}
                  className="fixed right-12 top-8 flex gap-1 items-center py-2 px-4 rounded-2xl shadow shadow-black bg-white text-black cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                  Cerrar fotos
                </button>
              </div>

          
          <div ref={sliderRef} className="keen-slider mt-8">
            {place?.photos?.map((photo) => (
              <div
                key={photo}
                className="keen-slider__slide flex justify-center"
              >
                <img
                  src={`http://localhost:4000/uploads/${photo}`}
                  alt=""
                  className="max-h-[80vh] rounded-xl"
                />
              </div>
            ))}
          </div>

          <div className="absolute left-50 top-1/2 transform -translate-y-1/2 border-1 flex items-center justify-center text-white rounded-full shadow-lg hover:bg-white/40 transition z-50">
            <button
                onClick={prevSlide}
                className="p-4 cursor-pointer"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" />
                </svg>
            </button>
          </div>


            <div className="absolute right-50 top-1/2 transform -translate-y-1/2 border-1 flex items-center justify-center text-white rounded-full shadow-lg hover:bg-white/40 transition z-50">
              <button
                onClick={nextSlide}
                className="p-4 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                  <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>

              </button>
            </div>
            </div>
          </div>
        );
      }

        
    return(
        <div className="relative">
        <div className="grid gap-2 grid-cols-[2fr_1fr_1fr] rounded-2xl overflow-hidden">
          <div>
            {place.photos?.[0] && (
              <div>
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[1] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={"http://localhost:4000/uploads/" + place.photos?.[1]}
                alt=""
              />
            )}
            {place.photos?.[2] && (
              <div className="overflow-hidden">
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos?.[2]}
                  alt=""
                />
              </div>
            )}
          </div>
          <div className="grid">
            {place.photos?.[3] && (
              <img
                onClick={() => setShowAllPhotos(true)}
                className="aspect-square object-cover cursor-pointer"
                src={"http://localhost:4000/uploads/" + place.photos?.[3]}
                alt=""
              />
            )}
            {place.photos?.[4] && (
              <div className="overflow-hidden">
                <img
                  onClick={() => setShowAllPhotos(true)}
                  className="aspect-square object-cover relative top-2 cursor-pointer"
                  src={"http://localhost:4000/uploads/" + place.photos?.[4]}
                  alt=""
                />
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="flex gap-1 items-center absolute bottom-2 right-2 py-2 px-4 bg-white rounded-2xl border border-black shadow-md shadow-gray-500 cursor-pointer transition hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="size-4"
          >
            <path
              fillRule="evenodd"
              d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
            ></path>
          </svg>
          Mostrar más fotos
        </button>
      </div>
    )
}