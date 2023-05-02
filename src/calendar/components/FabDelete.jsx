import { useCalendarStore } from '../../hooks';

export const FabDelete = () => {
    const { hasEventSelected, isModalClose, startDeleteEvent } = useCalendarStore();

    const handleDelete = () => {
        startDeleteEvent();
    }

    return (
        <>
            <button aria-label='btn-delete'
                    className="btn btn-danger fab-danger"
                    onClick={ handleDelete }
                    style={{ display: hasEventSelected && !isModalClose ? '' : 'none' }} >
                <i className="fas fa-trash-alt"></i>
            </button>
        </>
    )
}
