import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";
import DeleteModal from "../DeleteModal";
import toast from "react-hot-toast";

export default function BookingPage() {
    const {id} = useParams();
    const [booking, setBooking] = useState(null);
    const [redirect, setRedirect] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if(id){
            axios.get(`${import.meta.env.BACKEND_URL}/bookings/${id}`).then((response) => {
                setBooking(response.data);
              });
        }
    }, [id]);

    async function deleteBooking() {
        await axios.delete(`${import.meta.env.BACKEND_URL}/bookings/`+id);
        toast.success('Reserva eliminada con éxito');
        setModalOpen(false);
        setRedirect('/account/bookings');
    }

    if(redirect){
        return <Navigate to={redirect} />
    }

    if(!booking){
        return '';
    }



    return (
        <div className="my-8 px-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold md:text-3xl">{booking.place.title}</h1>
                    <AddressLink className="my-2 block">{booking.place.address}</AddressLink>
                </div>
                <div className="mr-2">
                    <button 
                        className="button-primary w-40 md:w-50 cursor-pointer hover:bg-[#ff5f92] hover:scale-110 transition-all h-12"
                        onClick={() => setModalOpen(true)}
                    >
                        <span className="text-sm md:text-[16px]">Eliminar reserva</span>
                    </button>
                </div>
            </div>
            
            
            <div className="bg-gray-200 p-2 md:p-6 my-6 rounded-2xl flex flex-col gap-7 py-5 md:flex-row items-center md:justify-between">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-xl md:text-2xl mb-4">Información sobre tu reserva</h2>
                    <BookingDates booking={booking} className={"md:justify-start"} />
                </div>
                <div className="bg-primary p-6 text-white rounded-2xl">
                    <div>Precio total: </div>
                    <div className="text-xl md:text-3xl">€{booking.price}</div>
                </div>               
            </div>
            <PlaceGallery place={booking.place} />

            {/* Modal de confimar eliminación */}
            <DeleteModal 
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onDelete={deleteBooking}
                title="¿Estás seguro que quieres eliminar esta reserva?"
            />
        </div>
    );
}