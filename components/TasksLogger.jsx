import React, { useState, useEffect } from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import TaskModal from './TaskModal';
import '../assets/stylesheets/style.css';

function TasksLogger() {
    const [tasks, setTasks] = useState(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            return JSON.parse(storedTasks);
        } else {
            return {
                'front-end': [],
                'back-end': []
            };
        }
    });

    const [currentTask, setCurrentTask] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleAddTask = event => {
        event.preventDefault();
        const taskTitle = event.target.elements.taskTitle.value;
        const taskType = event.target.elements.taskType.value;

        const newTask = {
            title: taskTitle,
            progress: 0,
            subtasks: []
        };

        setTasks(prevState => ({
            ...prevState,
            [taskType]: [...prevState[taskType], newTask]
        }));
    };

    const handleDeleteTask = (taskType, title) => {
        setTasks(prevState => ({
            ...prevState,
            [taskType]: prevState[taskType].filter(task => task.title !== title)
        }));
    };

    const handleProgressBarClick = task => {
        setCurrentTask(task);
        setSubtasks(task.subtasks || []);
        setShowModal(true);
    };

    const handleAddSubtask = subtaskTitle => {
        const newSubtask = {
            title: subtaskTitle,
            progress: 0
        };
    
        const updatedTasks = {
            ...tasks,
            [currentTask.type]: tasks[currentTask.type].map(task => {
                if (task.title === currentTask.title) {
                    return {
                        ...task,
                        subtasks: [...subtasks, newSubtask]
                    };
                }
                return task;
            })
        };
    
        setTasks(updatedTasks);
        setSubtasks([...subtasks, newSubtask]);
    };
    

    const handleCloseModal = () => {
        setCurrentTask(null);
        setSubtasks([]);
        setShowModal(false);
    };
    
    // update localStorage whenever the tasks change
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks, subtasks,]);

    
    const calculateTaskProgress = (task) => {
        if (task.subtasks.length === 0) {
            return task.progress;
        }
    
        const subtasksProgress = task.subtasks.reduceRight((totalProgress, subtask) => {
            return totalProgress + subtask.progress;
        }, 0);
    
        const subtasksProgressPercentage = (subtasksProgress / (task.subtasks.length * 100)) * 100;
        const totalProgressPercentage = (task.progress + subtasksProgressPercentage) / 2;
    
        return Math.round(totalProgressPercentage);
    };
    
    
    return (
        <>
            <header>
                <h1>Tasks Logger</h1>
                <div className='add-task'>
                    <form onSubmit={handleAddTask}>
                        <p>Task Title
                            <input type='text' name='taskTitle' placeholder='Task Title' />
                        </p>
                        <p>Task Type
                            <input type='radio' id='front-end' name='taskType' value='front-end' />
                            <label htmlFor='front-end'>Front-End</label>
                            <input type='radio' id='back-end' name='taskType' value='back-end' />
                            <label htmlFor='back-end'>Back-End</label>
                        </p>
                        <button className='add-Btn'>Add New Task</button>
                    </form>
                </div>
            </header>
            <main>
                <div className='front-end'>
                    <h4>Front-End</h4>
                    {tasks['front-end'].map(task => (
                        <div key={task.title}>
                            <p>{task.title}</p>
                            <ProgressBar 
                                variant="success" 
                                now={calculateTaskProgress(task)} 
                                label={`${calculateTaskProgress(task)}%`} 
                                className='custom-progress' 
                                onClick={() => handleProgressBarClick({...task, type: 'front-end'})} 
                            />
                            <button onClick={() => handleDeleteTask('front-end', task.title)}>X</button>
                        </div>
                    ))}
                </div>
                <div className='back-end'>
                    <h4>Back-End</h4>
                    {tasks['back-end'].map(task => (
                        <div key={task.title}>
                            <p>{task.title}</p>
                            <ProgressBar 
                                variant="success" 
                                now={calculateTaskProgress(task)} 
                                label={`${calculateTaskProgress(task)}%`} 
                                className='custom-progress' 
                                onClick={() => handleProgressBarClick({...task, type: 'back-end'})} 
                            />
                            <button classsname='delete-Btn' onClick={() => handleDeleteTask('back-end', task.title)}>X</button>
                        </div>
                    ))}
                </div>
            </main>
            {currentTask && (
            <TaskModal
                task={currentTask}
                subtasks={subtasks}
                show={showModal}
                handleClose={handleCloseModal}
                handleAddSubtask={handleAddSubtask}
            />
            )}
        </>
    );
}
export default TasksLogger;

