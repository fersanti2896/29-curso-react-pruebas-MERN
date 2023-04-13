import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = { }, formValidations = { } ) => {
    const [ formState, setFormState ] = useState( initialForm );
    const [ formValition, setFormValition ] = useState({  });

    useEffect(() => {
        createValidators();
    }, [ formState ])
    
    useEffect(() => {
        setFormState( initialForm );
    }, [ initialForm ]);
    

    /* Función que permite cambiar el valor de un input */
    const onInputChange = ( { target } ) => {
        const { name, value } = target;
        
        setFormState({
            ...formState,
            [ name ]: value
        })
    }

    /* Función que permite resetar los valores por defecto del formulario */
    const onResetForm = () => {
        setFormState( initialForm );
    }

    /* Función que obtiene los mensajes de validación de los campos */
    const createValidators = () => {
        const formCheckedValues = {};

        for (const formField of Object.keys( formValidations )) {
            const [ fn, errorMessage ] = formValidations[formField];

            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;
        }

        setFormValition( formCheckedValues );
    }

    /* Función que memoriza el valor que retorna si el formulario es válido o no. */
    const isFormValid = useMemo(() => {
        for (const formValue of Object.keys( formValition )) {
            if( formValition[formValue] !== null ) return false;
        }

        return true;
    }, [ formValition ])

    /* Expone la desestructuración del formState (propiedades) */
    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValition,
        isFormValid
    }
}
