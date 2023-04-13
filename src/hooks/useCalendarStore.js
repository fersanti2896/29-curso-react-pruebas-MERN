import { useDispatch, useSelector } from 'react-redux';
import { onAddNewEvent, onDeleteEvent, onLoadingEvents, onSetActiveEvent, onUpdateEvent } from '../store/calendar';
import { calendarApi } from '../api';
import { convertEventsToDateEvents } from '../helpers';
import Swal from 'sweetalert2';

export const useCalendarStore = () => {
    const dispatch = useDispatch();
    const { activeEvent, events } = useSelector( state => state.calendar );
    const { isDateModalOpen } = useSelector( state => state.ui );
    const { user } = useSelector( state => state.auth );

    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent(calendarEvent) )
    }

    const startLoadingEvents = async() => {
        try {
            const { data } = await calendarApi.get('/events');
            const events = convertEventsToDateEvents( data.events );

            dispatch( onLoadingEvents( events ) );
        } catch (error) {
            console.log(error);
        }
    }

    const startSavingEvent = async( calendarEvent ) => {
        try {
            if( calendarEvent.id ) {
                /* Actualizando el evento */
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
    
                dispatch( onUpdateEvent({ ...calendarEvent, user }) );
    
                return;
            } 
    
            /* Creando el evento */
            const { data } = await calendarApi.post('/events', calendarEvent );
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.eventSave.id, user }) );
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '¡Error al guardar!',
                text: error.response.data.msg
            });
        }
        
    }

    const startDeleteEvent = async( ) => {
        try {
            /* Eliminando el evento */
            await calendarApi.delete(`/events/${ activeEvent.id }` );

            dispatch( onDeleteEvent() );            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: '¡Error al eliminar!',
                text: error.response.data.msg
            });
        }
    }

    return {
        //* Propiedades
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        isModalClose: isDateModalOpen,

        //* Métodos
        setActiveEvent,
        startDeleteEvent,
        startLoadingEvents,
        startSavingEvent,
    }    
}
