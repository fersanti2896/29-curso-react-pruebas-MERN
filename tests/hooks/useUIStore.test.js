import { renderHook } from '@testing-library/react';
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
        })
    });
});