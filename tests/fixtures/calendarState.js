import { addHours } from 'date-fns';

export const events = [
    {
        id: '1',
        start: new Date('2023-04-24 13:00:00'),
        end: new Date('2023-04-24 15:00:00'),
        title: 'Programar en React',
        notes: 'Tomar lección'
    },
    {
        id: '2',
        start: new Date('2023-04-23 13:00:00'),
        end: new Date('2023-04-23 15:00:00'),
        title: 'Programar en Angular',
        notes: 'Tomar lección de Angular'
    }
];

export const initialState = {
    isLoadingEvents: true,
    events: [ ],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false, 
    events: [ ...events ],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false, 
    events: [ ...events ],
    activeEvent: { ...events[0] }
}