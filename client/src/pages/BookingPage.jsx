import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    useEffect(() => {
        if(id){
            axios.get('/bookings').then(response => {
                const foundBooking = response.data.find(({_id}) => _id === id);
                if(foundBooking){
                    setBooking(foundBooking);
                }
            });
        }
    }, [id]);

    if(!booking){
        return '';
    }

    return (
        <div className="my-8 px-5">
            <h1 className="text-2xl font-semibold md:text-3xl">{booking.place.title}</h1>
            <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
            <div className="bg-gray-200 p-2 md:p-6 my-6 rounded-2xl flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl mb-4">Información sobre tu reserva</h2>
                    <BookingDates booking={booking} className={"justify-start"} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Precio total: </div>
                    <div className="text-xl md:text-3xl">€{booking.price}</div>
                </div>               
            </div>
            <PlaceGallery place={booking.place} />
        </div>
    );
}