import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { CalendarEvent, CalendarModal, FabAddNew, FabDelete, Navbar } from '../';
import { localizer, getMessage } from '../../helpers';
import { useUIStore, useCalendarStore, useAuthStore } from '../../hooks';

export const CalendarPage = () => {
    const { user } = useAuthStore();
    const [ lastView, setLastView ] = useState(localStorage.getItem('lastView') || 'week');
    const { openDateModal } = useUIStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        const isMyEvent = ( user.uid === event.user._id ) || ( user.uid === event.user.uid );

        const style = {
            backgroundColor: isMyEvent ? '#347CF7' : '#173B0B',
            borderRadius: '15px',
            color: 'white',
            opacity: 1
        }

        return {
            style
        }
    }

    const onDoubleClick = ( event ) => {
        openDateModal();
    }

    const onSelect = ( event ) => {
        setActiveEvent( event );
    }

    const onViewChanged = ( event ) => {
        localStorage.setItem( 'lastView', event );
        setLastView( event );
    }

    useEffect(() => {
        startLoadingEvents();
    }, [ ])
    

    return (
        <>
            <Navbar />

            <Calendar culture='es'
                      defaultView={ lastView }
                      endAccessor="end"
                      eventPropGetter={ eventStyleGetter }
                      events={ events }
                      localizer={ localizer }
                      messages={ getMessage() }
                      startAccessor="start"
                      style={{ height: 'calc( 100vh - 80px )' }}
                      components={{
                        event: CalendarEvent
                      }}
                      onDoubleClickEvent={ onDoubleClick }
                      onSelectEvent={ onSelect }
                      onView={ onViewChanged }
            />
            <CalendarModal />
            <FabAddNew />
            <FabDelete />
        </>
    )
}
