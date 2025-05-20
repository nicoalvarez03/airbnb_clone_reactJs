export default function PlaceImg({place, index = 0, className=null}){
    if(!place.photos?.length){
        return '';
    }
    if(!className){
        className = 'object-cover rounded-t-2xl md:rounded-none'
    }
    return(
        <img className={className} src={'http://localhost:4000/uploads/'+place.photos[index]} alt="" />
    );
}