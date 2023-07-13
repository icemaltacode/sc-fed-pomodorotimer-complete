import { useReducer } from "react";

const TIME_POMODORO = 25;
const TIME_SHORT_BREAK = 5;
const TIME_LONG_BREAK = 15; 

function reducer(state, { action, payload }) {
    switch(action) {
      case "ADD_TASK":
        // Add a new task to the list
        let taskSchedule = [];
        for (let i = 0; i<payload.pomodoros; i++) {
          taskSchedule.push({type: 'pomodoro', time: TIME_POMODORO, complete: false});
          if (i === payload.pomodoros - 1) break;
          if (i > 0 && i % 4 === 0) {
            taskSchedule.push({type: 'break_long', time: TIME_LONG_BREAK, complete: false});
          } else {
            taskSchedule.push({type: 'break_short', time: TIME_SHORT_BREAK, complete: false});
          }
        }
        return {
          ...state, 
          tasks: [...state.tasks, {name: payload.name, pomodoros: payload.pomodoros, taskSchedule: taskSchedule, schedulePointer: 0}]
        }
      case "NEXT_STEP":
        if (!state.currentTask) {
          // Start the first task
          return {
            ...state,
            currentTaskPointer: 0,
            currentTask: state.tasks[0],
            isTimerRunning: true
          }
        } else if (state.currentTaskSchedulePointer < state.currentTask.taskSchedule.length - 1) {
          // Go to the next item in the current task
          return {
            ...state,
            currentTaskSchedulePointer: state.currentTaskSchedulePointer + 1,
            isTimerRunning: true
          }
        }
        if (state.currentTaskPointer === state.tasks.length - 1) {
          // We've completed the last task
          return {
            ...state,
            currentTaskPointer: 0,
            currentTask: null,
            isTimerRunning: false
          }
        } else {
          // Go to the next task
          return {
            ...state,
            currentTaskPointer: state.currentTaskPointer + 1,
            currentTask: state.tasks[state.currentTaskPointer + 1],
            isTimerRunning: true
          }
        }
      case "COMPLETE_TASK_ITEM": 
        // Mark current task schedule item as complete
        if (state.currentTaskSchedulePointer < state.currentTask.taskSchedule.length) {
          let currentTask = state.currentTask;
          currentTask.taskSchedule[state.currentTaskSchedulePointer].complete = true;
          return {
            ...state,
            currentTask: currentTask,
          }
        }
        return state;
      default:
        return state;
    }
}

function useTaskProgress(initialState) {
    return useReducer(reducer, initialState);
}

export { useTaskProgress };