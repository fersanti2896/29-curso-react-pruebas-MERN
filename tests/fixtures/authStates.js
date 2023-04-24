
export const initialState = {
    status: 'checking', // 'authenticated', 'not-authenticated'
    user: {},
    errorMessage: undefined
}

export const authenticatedState = {
    status: 'authenticated', // 'authenticated', 'not-authenticated'
    user: {
        uid: 'ABC123',
        name: 'Marisol Contreras'
    },
    errorMessage: undefined
}

export const notAuthenticatedState = {
    status: 'not-authenticated', // 'authenticated', 'not-authenticated'
    user: {},
    errorMessage: undefined
}