import { caldendarSlice, onAddNewEvent, onDeleteEvent, onLoadingEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from '../../../src/store/calendar/calendarSlice';
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from '../../fixtures/calendarState';

describe('Pruebas en calendarSlice.', () => { 
    test('Debe de regresar el estado por defecto.', () => { 
        const state = caldendarSlice.getInitialState();
        
        expect( state ).toEqual( initialState );
    });

    test('onSetActiveEvent debe activar el evento.', () => { 
        const state = caldendarSlice.reducer( calendarWithActiveEventState, onSetActiveEvent( events[0] ) );
        
        expect( state.activeEvent ).toEqual( events[0] );
    });

    test('onAddNewEvent debe de agregar un nuevo evento.', () => { 
        const newEvent = {
            id: '3',
            start: new Date('2023-04-22 13:00:00'),
            end: new Date('2023-04-22 15:00:00'),
            title: 'Programar en Vue',
            notes: 'Tomar lección de Vue'
        };

        const state = caldendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );

        expect( state.events ).toEqual([ ...events, newEvent ]);
    });

    test('onUpdateEvent debe de actualizar un evento.', () => { 
        const updateEvent = {
            id: '1',
            start: new Date('2023-04-22 13:00:00'),
            end: new Date('2023-04-22 15:00:00'),
            title: 'Programar en Vue',
            notes: 'Tomar lección de Vue'
        };

        const state = caldendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updateEvent ) );

        expect( state.events[0] ).toEqual( updateEvent );
        expect( state.events ).toContain( updateEvent );
    });

    test('onDeleteEvent debe de eliminar un evento activo.', () => { 
        let state = caldendarSlice.reducer( calendarWithActiveEventState, onSetActiveEvent( events[0] ) );
        state = caldendarSlice.reducer( state, onDeleteEvent( events[0] ) );

        expect( state.events.length ).toBe( 1 );
        expect( state.activeEvent ).toBe( null );
    });

    test('onLoadingEvents debe de establecer los eventos.', () => { 
        const state = caldendarSlice.reducer( initialState, onLoadingEvents( events ) );
        
        expect( state.events ).toEqual( events );
    });

    test('onLogoutCalendar debe de limpiar el estado.', () => { 
        const state = caldendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar( ) );
        
        expect( state ).toEqual( initialState );
    });
});