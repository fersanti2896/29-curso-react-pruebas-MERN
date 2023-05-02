import { configureStore } from '@reduxjs/toolkit';
import { useAuthStore } from '../../src/hooks/useAuthStore';
import { authSlice, caldendarSlice } from '../../src/store';
import { act, renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { initialState, notAuthenticatedState } from '../fixtures/authStates';
import { testUserCredentials } from '../fixtures/testUser';
import { calendarApi } from '../../src/api';

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: { ...initialState }
        }
    });
}

describe('Pruebas en useAuthStore', () => { 
    beforeEach( () => localStorage.clear() );

    test('Debe de regresar los valores por defecto.', () => { 
        /* Estado inicial */
        const mockStore = getMockStore( initialState );
        /* Montamos el hook */
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        expect( result.current ).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any( Function ),
            startLogin: expect.any( Function ),
            startLogout: expect.any( Function ),
            startRegister: expect.any( Function ),
        });
    });

    test('startLogin debe de realizar el login correctamente.', async() => { 
        const mockStore = getMockStore( notAuthenticatedState );
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startLogin( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Usuario Test', uid: '643db55bd85d5c9a5ce415ba' }
        });

        expect( localStorage.getItem('token') ).toEqual( expect.any( String ) );
        expect( localStorage.getItem('token-init-date') ).toEqual( expect.any( String ) );
    });

    test('startLogin debe de realizar el login incorrectamente.', async() => { 
        const mockStore = getMockStore( notAuthenticatedState );
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startLogin({ email: 'algo@google.com', password: '12345678' });
        } );

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Credenciales incorrectas',
            status: 'not-authenticated',
            user: {}
        });

        expect( localStorage.getItem('token') ).toBe( null );
        expect( localStorage.getItem('token-init-date') ).toBe( null );

        await waitFor( 
            () => expect( result.current.errorMessage ).toBe( undefined )
        );
    });

    test('startRegister debe de crear un usuario.', async() => { 
        const newUser = { email: 'algo2@prueba.com', password: '12345678', name:'Test User 2' };
        const mockStore = getMockStore( notAuthenticatedState );
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        /* Realizando un espía - Evitando que se realizando la petición post */
        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({
            data: {
                "ok": true,
                "uid": "39872198379287391283",
                "name": "Test User",
                "token": "ALGUN-TOKEN"
            }
        });

        await act( async() => {
            await result.current.startRegister( newUser );
        } );

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '39872198379287391283' }
        });

        /* Destruyendo el espía */
        spy.mockRestore();
    });

    test('startRegister debe de fallar la creación cuando ya hay un usuario existente.', async() => { 
        const mockStore = getMockStore( notAuthenticatedState );
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.startRegister( testUserCredentials );
        } );

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Ya existe un usuario con ese email.',
            status: 'not-authenticated',
            user: {}
        });
    });

    test('checkAuthToken debe de fallar si no hay token.', async() => { 
        const mockStore = getMockStore({ initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.checkAuthToken()
        } );

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'not-authenticated', 
            user: {}
        });
    });

    test('checkAuthToken debe de autenticar un usuario si hay token.', async() => { 
        const { data } = await calendarApi.post( '/auth', testUserCredentials );
        localStorage.setItem( 'token', data.token );
        
        const mockStore = getMockStore({ initialState });
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>
        } );

        await act( async() => {
            await result.current.checkAuthToken()
        } );

        const { errorMessage, status, user } = result.current;
        
        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Usuario Test', uid: '643db55bd85d5c9a5ce415ba' }
        });
    });
});