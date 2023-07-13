function Task({ name, pomodoros, active, completed }) {
    return <div className={`task ${active ? 'active': ''} ${completed === pomodoros ? 'complete': ''}`}>
        <div className='taskName'>{name}</div>
        <div className='taskPomodoros' style={{marginLeft: 'auto'}}>🍅 {completed}/{pomodoros}</div>
    </div>
}

export default Task;