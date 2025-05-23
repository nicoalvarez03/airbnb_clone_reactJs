export default function PlaceImg({place, index = 0, className=null}){
    if(!place.photos?.length){
        return '';
    }
    if(!className){
        className = 'object-cover w-full max-h-[240px] md:h-full md:w-full rounded-t-2xl lg:rounded-none'
    }
    return(
        <img className={className} src={place.photos[index]} alt={`Foto de ${place.title}`} />
    );
}