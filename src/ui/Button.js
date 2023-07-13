function AddTaskButton({ clickHandler }) {
    return <div className='addTaskButton' onClick={clickHandler}>
        <i className='bi bi-plus-circle-fill' /> ADD
    </div>
}

function StartTimerButton({ clickHandler }) {
    return <div className='startTimerButton' onClick={clickHandler}>
        <i className='bi bi-play-circle-fill' /> START
    </div>
}

export { AddTaskButton, StartTimerButton };