import calendarApi from '../../src/api/calendarApi';

describe('Pruebas en calendarApi.', () => {
    test('Debe de contener la configuración por defecto.', () => {
        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL )
    });

    test('Debe de tener el x-token en el header en las peticiones.', async() => {
        const token = 'ABC-123-YXZ';
        localStorage.setItem('token', token);

        const resp = await calendarApi.get('/auth').then( (res) => res ).catch( (res) => res );
        
        expect( resp.config.headers['x-token'] ).toBe( token );
    });
})