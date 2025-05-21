import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

export default function DeleteModal({ isOpen, onClose, title, onDelete }) {
    return (          
        <Transition show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={onClose}>
            {/* Fondo oscuro */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            </Transition.Child>
    
            {/* Panel del modal */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`
                    relative max-w-2xl max-h-[60vh] md:max-h-[90vh] 
                    rounded-2xl 
                    bg-white p-6 md:p-8 
                    shadow-xl overflow-y-auto
                  `}
                >
                  {/* Botón de cerrar */}
                  <button
                    onClick={onClose}
                    className="absolute top-2 right-2 md:top-4 md:right-4 text-gray-500 hover:text-black"
                  >
                    <X />
                  </button>
    
                  <Dialog.Title className="text-xl md:text-2xl font-bold mb-4">
                    {title}
                  </Dialog.Title>
    
                  <div className="space-y-4 text-gray-800 text-sm md:text-base">
                      <div className="flex justify-between">
                          <button
                            onClick={onClose}
                            className="button-primary w-30 md:w-50 bg-gray-500 cursor-pointer hover:bg-gray-400 transition-all h-12"
                          >
                          <span className="text-[12px] md:text-sm">Cancelar</span>
                          </button>
                          <button
                            onClick={onDelete}
                            className="button-primary w-30 md:w-50 cursor-pointer hover:bg-[#ff5f92] transition-all h-12"
                          >
                          <span className="text-[12px] md:text-sm">Eliminar reserva</span>
                          </button>
                      </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      );
}