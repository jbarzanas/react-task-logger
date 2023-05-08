import React, { useState, useEffect } from 'react';
import {Modal,Button, ProgressBar} from 'react-bootstrap';

function TaskModal({ task, subtasks, show, handleClose, handleAddSubtask }) {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [subtaskStatus, setSubtaskStatus] = useState({});
    const [lastModified, setLastModified] = useState(task.lastModified);

    useEffect(() => {
        const subtaskStatusLocalStorage = JSON.parse(localStorage.getItem('subtaskStatus')) || {};
        setSubtaskStatus(subtaskStatusLocalStorage);
    }, []);

    const handleFormSubmit = (event) => {
        event.preventDefault();
        handleAddSubtask(newSubtaskTitle, subtaskStatus);
        setNewSubtaskTitle('');
        setSubtaskStatus({});
        setLastModified(Date.now());
        task.lastModified = lastModified; // update the lastModified property of the task
    };

    const handleStatusChange = (subtaskTitle, status) => {
        setSubtaskStatus({ ...subtaskStatus, [subtaskTitle]: status });
        setLastModified(Date.now());
        task.lastModified = lastModified;
      
        localStorage.setItem('subtaskStatus', JSON.stringify({
            ...subtaskStatus,
            [subtaskTitle]: status,
        }));
      };

    const calculateProgress = () => {
        if (subtasks.length === 0) {
        return 0;
        }
        const completedCount = subtasks.filter(
        (subtask) => subtaskStatus[subtask.title] === 'completed'
        ).length;
        return Math.round((completedCount / subtasks.length) * 100);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{task.title} - Last Modified: {task.lastModified ? new Date(task.lastModified).toLocaleString() : "Not modified yet"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Subtasks</h4>
                <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    placeholder="Subtask Title"
                    value={newSubtaskTitle}
                    onChange={(event) => setNewSubtaskTitle(event.target.value)}
                />
                <Button type="submit">Add Subtask</Button>
                </form>
                {subtasks.map((subtask) => (
                <div key={subtask.title} className={subtaskStatus[subtask.title]}>
                    <p>{subtask.title}</p>

                    <label>
                    <input
                        type="radio"
                        name={subtask.title}
                        value="completed"
                        checked={subtaskStatus[subtask.title] === 'completed'}
                        onChange={() => handleStatusChange(subtask.title, 'completed')}
                    />
                    Completed
                    </label>
                    <label>
                    <input
                        type="radio"
                        name={subtask.title}
                        value="ongoing"
                        checked={subtaskStatus[subtask.title] === 'ongoing'}
                        onChange={() => handleStatusChange(subtask.title, 'ongoing')}
                    />
                    Ongoing
                    </label>
                    <label>
                    <input
                        type="radio"
                        name={subtask.title}
                        value="pending"
                        checked={subtaskStatus[subtask.title] === 'pending'}
                        onChange={() => handleStatusChange(subtask.title, 'pending')}
                    />
                    Pending
                    </label>
                </div>
                ))}
                <ProgressBar now={calculateProgress()} label={`${calculateProgress()}%`} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskModal;



