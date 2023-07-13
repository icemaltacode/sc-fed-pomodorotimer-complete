import { createContext, useContext, useState, useEffect } from 'react';
import Timer from './Timer';
import useToggle from './hooks/useToggle';
import { useTaskProgress } from './hooks/useTaskProgress';
import { Section } from './ui/Section';
import { AddTaskButton, StartTimerButton } from './ui/Button';
import Heading from './ui/Heading';
import Task from './ui/Task';
import TomatoClock from './ui/TomatoClock';
import './App.css';

const AppContext = createContext();

function TomatoTimer() {
  const ctx = useContext(AppContext);
  const currentTimer = 
    ctx.currentTask ? 
    ctx.currentTask.taskSchedule[ctx.currentTaskSchedulePointer] : 
    0;
  const taskType = 
    ctx.currentTask ? 
    ctx.currentTask.taskSchedule[ctx.currentTaskSchedulePointer].type : 
    'pomodoro';

  const [timeTarget, setTimeTarget] = useState(0);

  useEffect(() => {
    setTimeTarget(currentTimer.time ? currentTimer.time : 0);
  }, [currentTimer.time])
  
  if (ctx.tasks.length === 0 || !ctx.currentTask) {
    return <div className='card'>
      <div className='card-body align-items-center d-flex flex-column'>
        <TomatoClock />
      </div>
    </div>
  };
 
  return <div className='card'>
    <div className='card-body align-items-center d-flex flex-column'>
      {(timeTarget > 0) && 
          <Timer 
            timerHours={0} 
            timerMinutes={timeTarget} 
            timerSeconds={0} 
            completeHandler={ctx.timerCompleteHandler} 
            graphic={taskType}/>
      }
    </div>
  </div>
}

function AddTaskForm({ cancelHandler }) {
  const [taskName, setTaskName] = useState('');
  const [taskPomodoros, setTaskPomodors] = useState(1);
  
  const ctx = useContext(AppContext);

  const onSubmit = (evt) => {
    evt.preventDefault();
    ctx.addTaskHandler(taskName, taskPomodoros);
    cancelHandler();
  }

  return <div className='addTask'>
    <form onSubmit={onSubmit}>
      <div className='row g-3'>
        <div className='col'>
          <input 
            type='text' required 
            className='form-control' 
            id='taskName' 
            placeholder="What's next?" 
            value={taskName} 
            onChange={evt => setTaskName(evt.target.value)}/>
        </div>
      </div>
      <div className='row g-3'>
        <div className='col'>
          <label htmlFor='taskPomodoros'>Est. Pomodors: </label>
          <input 
            type='number' 
            className='form-control' 
            id='taskPomodoros' 
            defaultValue={taskPomodoros} 
            onChange={evt => setTaskPomodors(evt.target.value)} 
            aria-describedby='pomodoroHelp' />
          <div id='pomodoroHelp' className='form-text'>
            1 Pomodoro = 25 minutes.
          </div>
        </div>
        <div className='col'>
          <div className='addTaskButtons' role='group'>
            <button type='submit' className='btn btn-success'>Add</button>
            <button type='button' className='btn btn-secondary' onClick={cancelHandler}>Cancel</button>
          </div>
        </div>
      </div>
    </form>
  </div>
}

function TaskList() {
  const [isAddingTask, setIsAddingTask] = useToggle(false);
  
  const ctx = useContext(AppContext);

  return <>
    {
      isAddingTask ?  
      <AddTaskForm cancelHandler={setIsAddingTask} /> : 
        ctx.isTimerRunning ? 
        null :
        <AddTaskButton clickHandler={setIsAddingTask} />
    }
    {
      (ctx.tasks.length > 0 && !ctx.isTimerRunning) && 
        <StartTimerButton clickHandler={ctx.startTimerHandler}/>
    }
    {ctx.tasks.map((task, i) => 
      {
        const active = task === ctx.currentTask;
        const completed = task.taskSchedule.filter(task => task.type === 'pomodoro' && task.complete === true).length;
        return <Task key={i} name={task.name} pomodoros={task.pomodoros} completed={completed} active={active} />
      }
    )}
  </>
}

function TomatoStats() {
  const ctx = useContext(AppContext);
  
  let totalPomodoros = 0;
  let completePomodoros = 0;
  let totalShortBreaks = 0;
  let completeShortBreaks = 0;
  let totalLongBreaks = 0;
  let completeLongBreaks = 0;

  ctx.tasks.forEach(task => {
      task.taskSchedule.forEach(item => {
          if (item.type === 'pomodoro') {
              totalPomodoros++;
          } else if (item.type === 'break_short') {
              totalShortBreaks++;
          } else if (item.type === 'break_long') {
              totalLongBreaks++;
          }
          (item.type === 'pomodoro' && item.complete) && completePomodoros++;
          (item.type === 'break_short' && item.complete) && completeShortBreaks++;
          (item.type === 'break_long' && item.complete) && completeLongBreaks++;
      });
  });

  const workLeft = (totalPomodoros - completePomodoros) * 25;
  const timeLeft = workLeft + 
                  (totalLongBreaks - completeLongBreaks) * 15 +
                  (totalShortBreaks - completeShortBreaks) * 5;
  const completeBreaks = completeLongBreaks + completeShortBreaks;
  const totalBreaks = totalLongBreaks + totalShortBreaks;

  const completionTime = new Date(new Date().getTime() + timeLeft*60000).toTimeString().split(' ')[0];
  
  return (ctx.tasks ? <>
      <div className="card-header">
          Done at {completionTime}
      </div>
      <ul className="list-group list-group-flush">
          <li className="list-group-item">⏲️ Work Left: {Math.floor(workLeft / 60)}h {workLeft % 60}m</li>
          <li className="list-group-item">🕰️ Time Left: {Math.floor(timeLeft / 60)}h {timeLeft % 60}m</li>
          <li className="list-group-item">🍅 Pomodoros: {completePomodoros}/{totalPomodoros}</li>
          <li className="list-group-item">☕ Breaks: {completeBreaks}/{totalBreaks}</li>
      </ul>
  </> : <div className="card-header">
      No Stats Yet
  </div>)
}

function App() {
  const [state, dispatch] = useTaskProgress({
    tasks: [],
    currentTask: null,
    currentTaskPointer: 0,
    currentTaskSchedulePointer: 0,
    isTimerRunning: false,
  });

  const addTask = (taskName, taskPomodoros) => {
    dispatch({ action: 'ADD_TASK', payload: {name: taskName, pomodoros: taskPomodoros}});
  };

  const startTimer = () => {
    nextStep();
  }

  const timerComplete = () => {
    dispatch({ action: 'COMPLETE_TASK_ITEM'});
    nextStep();
  };

  const nextStep = () => {
    dispatch({ action: 'NEXT_STEP'})
    playsfx();
  };

  const playsfx = () => {
    if (!state.currentTask) {
      new Audio('pomodoro.mp3').play();
      return null;
    }
    const taskType = state.currentTask.taskSchedule[state.currentTaskSchedulePointer].type;
    if (taskType === 'pomodoro') {
      new Audio('break.mp3').play();
    } else {
      new Audio('pomodoro.mp3').play();
    }
  }

  return <div className='container'>
    <AppContext.Provider value={
        {
          tasks: state.tasks, 
          addTaskHandler: addTask,
          timerCompleteHandler: timerComplete,
          startTimerHandler: startTimer,
          currentTask: state.currentTask,
          currentTaskPointer: state.currentTaskPointer,
          currentTaskSchedulePointer: state.currentTaskSchedulePointer,
          isTimerRunning: state.isTimerRunning,
        }
    }>
      <Section>
        <Heading role='secondary'>Pomodoro Timer</Heading>
      </Section>
      <Section role='tertiary'>
        <div className='row'>
          <div className='col col-xs-12 col-md-3'>
            <TomatoTimer />
          </div>
          <div className='col col-xs-12 col-md-6'>
            <div className='card h-100'>
              <div className='card-body'>
                <TaskList />
              </div>
            </div>
          </div>
          <div className='col col-xs-12 col-md-3'>
            <div className='card h-100'>
              <div className='card-body'>
                <TomatoStats />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </AppContext.Provider>
  </div>
}

export default App;
