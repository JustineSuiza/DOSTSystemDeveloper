import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import './Goals.css';

const Goals = ({ sidebarExpanded }) => {
    const defaultGoals = [
        'Hatchery',
        'Nursery',
        'Grow-out',
        'Post-harvest',
    ];

    const [goals, setGoals] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [goalDescription, setGoalDescription] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const storedGoals = localStorage.getItem('goalsData');
        if (storedGoals) {
            try {
                setGoals(JSON.parse(storedGoals));
            } catch (error) {
                console.error('Failed to parse stored goals:', error);
                setGoals([]);
            }
        }

        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        localStorage.setItem('goalsData', JSON.stringify(goals));
    }, [goals]);

    const filteredGoals = goals.filter((goal) =>
        goal.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        (goal.description || '').toLowerCase().includes(filterValue.toLowerCase())
    );

    const handleOpenAddModal = () => {
        setIsAddModalOpen(true);
        setSelectedGoal('');
        setGoalDescription('');
    };

    const handleCloseAddModal = () => {
        setIsAddModalOpen(false);
        setIsEditing(false);
        setEditIndex(null);
    };

    const handleAddGoal = () => {
        const newGoal = selectedGoal.trim();
        const newDescription = goalDescription.trim();

        if (!newGoal) {
            alert('Please select a goal.');
            return;
        }

        if (isEditing && editIndex !== null) {
            setGoals((prev) => prev.map((item, index) => index === editIndex ? { name: newGoal, description: newDescription } : item));
        } else {
            setGoals((prev) => [{ name: newGoal, description: newDescription }, ...prev]);
        }

        handleCloseAddModal();
    };

    const handleEditGoal = (goal) => {
        const absoluteIndex = goals.findIndex((item) => item === goal);
        if (absoluteIndex >= 0) {
            setSelectedGoal(goal.name);
            setGoalDescription(goal.description || '');
            setEditIndex(absoluteIndex);
            setIsEditing(true);
            setIsAddModalOpen(true);
        }
    };

    const handleDeleteGoal = (goal) => {
        const absoluteIndex = goals.findIndex((item) => item === goal);
        if (absoluteIndex >= 0) {
            if (window.confirm('Delete this goal?')) {
                setGoals((prev) => prev.filter((_, i) => i !== absoluteIndex));
            }
        }
    };

    const handleRefresh = () => {
        const storedGoals = localStorage.getItem('goalsData');
        if (storedGoals) {
            try {
                setGoals(JSON.parse(storedGoals));
            } catch (error) {
                console.error('Failed to parse stored goals:', error);
                setGoals([]);
            }
        } else {
            setGoals([]);
        }
        setFilterValue('');
    };

    const exportToExcel = () => {
        const exportRows = filteredGoals.map((goal) => ({ Goal: goal.name, Description: goal.description }));
        const ws = XLSX.utils.json_to_sheet(exportRows);
        ws['!cols'] = [{ wch: 30 }, { wch: 60 }];
        const wb = { Sheets: { Goals: ws }, SheetNames: ['Goals'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Goals.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <article className={`pt-5 pb-5 ${isMobile ? 'ps-3 pe-3' : isTablet ? 'ps-4 pe-4' : 'pe-5'}`}>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <label className='h5 fw-semibold pt-2'>Goals</label>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    <div className="me-3" style={{ minWidth: isMobile ? '180px' : '280px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={filterValue}
                                onChange={(e) => setFilterValue(e.target.value)}
                                className="form-control"
                                style={{ width: '100%', fontSize: isMobile ? '12px' : '14px' }}
                            />
                            {filterValue && (
                                <button
                                    className="btn btn-close"
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: '10px',
                                        transform: 'translateY(-50%)',
                                        zIndex: '1',
                                    }}
                                    onClick={() => setFilterValue('')}
                                ></button>
                            )}
                        </div>
                    </div>
                    
                    <div className='sample me-3 addNewTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
                        <button
                            type="button"
                            className="btn border-0"
                            onClick={handleOpenAddModal}
                            data-bs-toggle="tooltip"
                            data-bs-title="Add Goal"
                        >
                            <i className="fa-solid fa-plus fs-5"></i>
                        </button>
                    </div>
                    <div className='sample me-3 refreshTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
                        <button type="button" className="btn border-0" onClick={handleRefresh}>
                            <i className="fa-solid fa-sync fs-5"></i>
                        </button>
                    </div>
                    <div className='sample me-3 excelTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
                        <button type="button" className="btn border-0" onClick={exportToExcel}>
                            <i className="fa-solid fa-file-excel fs-5"></i>
                        </button>
                    </div>
                </div>
            </div>

            {goals.length > 0 && (
                <div className='table-responsive pt-4 goals-table-wrapper major-table-wrapper'>
                    <DataTable
                        columns={[
                            { name: 'Goal', selector: row => row.name, sortable: true, wrap: true, minWidth: '160px' },
                            { name: 'Description', selector: row => row.description || '-', sortable: false, wrap: true },
                            {
                                name: 'Actions',
                                cell: (row) => (
                                    <div className="dropdown dropstart">
                                        <button className="btn btn-outline rounded-circle" style={{ paddingInline: '11px' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul className="dropdown-menu border-0 p-0 m-0 h-auto w-auto shadow-lg text-start">
                                            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleEditGoal(row)}>
                                                <div className="d-flex align-items-center">
                                                    <div className='p-1 px-2 pt-1 me-1'>
                                                        <i className="bi bi-pencil-square fs-5"></i>
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>Edit</div>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleDeleteGoal(row)}>
                                                <div className="d-flex align-items-center">
                                                    <div className='p-1 px-2 pt-1 me-1'>
                                                        <i className="bi bi-trash fs-5 text-danger"></i>
                                                    </div>
                                                    <div className='d-flex flex-column'>
                                                        <div className='fw-medium text-danger' style={{ fontSize: '13px', paddingTop: '2px' }}>Delete</div>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                ),
                                button: true,
                                width: '120px',
                            },
                        ]}
                        data={filteredGoals}
                        pagination
                        responsive
                        highlightOnHover
                        striped
                        paginationPerPage={isMobile ? 5 : 10}
                        paginationRowsPerPageOptions={isMobile ? [5,10,15] : [10,25,50]}
                        className={!isMobile ? 'pt-5 major-table' : 'major-table'}
                        style={{
                            paddingLeft: !isMobile && sidebarExpanded ? (isTablet ? '250px' : '300px') : (isMobile ? '0px' : '150px'),
                            transition: 'padding-left 0.3s',
                            fontSize: isMobile ? '12px' : '14px'
                        }}
                    />
                </div>
            )}

            {isAddModalOpen && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Edit Goal' : 'Add Goal'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseAddModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="goalSelect" className="form-label">Goal</label>
                                    <select
                                        id="goalSelect"
                                        className="form-select"
                                        value={selectedGoal}
                                        onChange={(e) => setSelectedGoal(e.target.value)}
                                    >
                                        <option value="">Select a goal</option>
                                        {defaultGoals.map((goal) => (
                                            <option key={goal} value={goal}>{goal}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="goalDescription" className="form-label">Description</label>
                                    <textarea
                                        id="goalDescription"
                                        className="form-control"
                                        placeholder="Enter goal description"
                                        value={goalDescription}
                                        onChange={(e) => setGoalDescription(e.target.value)}
                                        rows={3}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseAddModal}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={handleAddGoal}>{isEditing ? 'Save Changes' : 'Add Goal'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
};

export default Goals;
