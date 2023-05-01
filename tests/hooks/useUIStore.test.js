import { act, renderHook } from '@testing-library/react';
import { useUIStore } from '../../src/hooks/useUIStore';
import { Provider } from 'react-redux';
import { store } from '../../src/store';
import { configureStore } from '@reduxjs/toolkit';
import { uiSlice } from '../../src/store/ui';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            ui: uiSlice.reducer
        },
        preloadedState: {
            ui: { ...initialState }
        }
    });
}

describe('Pruebas en el hook useUIStore', () => { 
    test('Debe de regresar los valores por defecto.', () => { 
        /* Estado inicial */
        const mockStore = getMockStore({ isDateModalOpen: false });
        /* Monstamos el hook */
        const { result } = renderHook( () => useUIStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        expect( result.current ).toEqual({
            isDateModalOpen: false,
            openDateModal: expect.any( Function ),
            closeDateModal: expect.any( Function )
        });
    });

    test('openDateModal debe de colocar true en el isDateModalOpen.', () => { 
        /* Estado inicial */
        const mockStore = getMockStore({ isDateModalOpen: false });
        /* Monstamos el hook */
        const { result } = renderHook( () => useUIStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        const { isDateModalOpen, openDateModal } = result.current;
        
        act( () => {
            openDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeTruthy();
    });

    test('closeDateModal debe de colocar un false en el isDateModalOpen.', () => { 
        /* Estado inicial */
        const mockStore = getMockStore({ isDateModalOpen: true });
        /* Monstamos el hook */
        const { result } = renderHook( () => useUIStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        const { isDateModalOpen, closeDateModal } = result.current;

        act( () => {
            closeDateModal();
        });

        expect( result.current.isDateModalOpen ).toBeFalsy();
    });
});