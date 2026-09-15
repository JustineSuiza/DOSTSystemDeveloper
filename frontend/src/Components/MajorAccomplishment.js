import React, { useEffect, useState } from 'react';
import './MajorAccomplishment.css';
import { Tooltip } from 'react-tooltip';
import DataTable from 'react-data-table-component';

const storageKey = 'majorAccomplishments';

const MajorAccomplishment = ({ sidebarExpanded }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [availableYears, setAvailableYears] = useState(['2025']);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [rows, setRows] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newYear, setNewYear] = useState('2025');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterDesc, setFilterDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Handle responsive breakpoints
  useEffect(() => {
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
    // load all years from storage
    try {
      const all = JSON.parse(localStorage.getItem(storageKey) || '{}');
      const years = Object.keys(all).length ? Object.keys(all).sort() : ['2025'];
      setAvailableYears(years);
      if (!years.includes(selectedYear)) setSelectedYear(years[0]);
    } catch (e) {
      setAvailableYears(['2025']);
    }
  }, []);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem(storageKey) || '{}');
      setRows(all[selectedYear] || []);
    } catch (e) {
      setRows([]);
    }
  }, [selectedYear]);

  const persist = (year, data) => {
    try {
      const all = JSON.parse(localStorage.getItem(storageKey) || '{}');
      all[year] = data;
      localStorage.setItem(storageKey, JSON.stringify(all));
      const years = Object.keys(all).sort();
      setAvailableYears(years);
    } catch (e) {}
  };

  const openAdd = () => {
    setNewTitle('');
    setNewDesc('');
    setNewYear(selectedYear || '2025');
    setShowAddModal(true);
  };

  const handleAddSubmit = () => {
    const copy = [...rows, { title: newTitle, description: newDesc }];
    setRows(copy);
    persist(newYear, copy);
    setShowAddModal(false);
  };

  const deleteRow = (idx) => {
    const copy = rows.filter((_, i) => i !== idx);
    setRows(copy);
    persist(selectedYear, copy);
  };

  const updateRow = (idx, field, value) => {
    const copy = [...rows];
    copy[idx] = { ...copy[idx], [field]: value };
    setRows(copy);
    persist(selectedYear, copy);
  };

  const exportCSV = () => {
    if (!rows || rows.length === 0) return alert('No data to export');
    const header = ['Title', 'Description'];
    const csv = [header.join(','), ...rows.map(r => `"${(r.title||'').replace(/"/g,'""')}","${(r.description||'').replace(/"/g,'""')}"` )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `MajorAccomplishment_${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRows = rows.filter(r => {
    const titleMatch = (r.title || '').toLowerCase().includes(filterTitle.toLowerCase());
    const descMatch = (r.description || '').toLowerCase().includes(filterDesc.toLowerCase());
    const searchMatch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (r.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch && descMatch && searchMatch;
  });

  const handleEditClick = (idx) => {
    const record = filteredRows[idx];
    setSelectedRecord({ ...record, originalIdx: rows.indexOf(record) });
  };

  const handleDeleteClick = (idx) => {
    if (window.confirm('Are you sure you want to delete this accomplishment?')) {
      deleteRow(rows.indexOf(filteredRows[idx]));
    }
  };

  const columns = [
    { 
      name: 'No.', 
      selector: (row, index) => index + 1, 
      sortable: true, 
      width: '80px' 
    },
    { 
      name: `${selectedYear} Major Accomplishment`, 
      selector: (row) => row.title, 
      sortable: true, 
      wrap: true, 
      width: '300px', 
      minWidth: '300px' 
    },
    { 
      name: 'Description', 
      selector: (row) => row.description, 
      sortable: true, 
      wrap: true, 
      width: '400px', 
      minWidth: '400px' 
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <div className="dropdown dropstart">
            <button className="btn btn-outline rounded-circle" style={{ paddingInline: '11px' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            <ul className="dropdown-menu border-0 p-0 m-0 h-auto w-auto shadow-lg text-start">
              <li className='m-1 notif-item' style={{ width: '150px' }} onClick={() => handleEditClick(rows.indexOf(row))}>
                <div className=" d-flex align-items-center">
                  <div className='p-1 px-2 pt-1 me-1'>
                    <i className="bi bi-pencil-square fs-5"></i>
                  </div>
                  <div className='d-flex flex-column'>
                    <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>Edit</div>
                  </div>
                </div>
              </li>
              <li className='m-1 notif-item' style={{ width: '150px' }} onClick={() => handleDeleteClick(rows.indexOf(row))}>
                <div className=" d-flex align-items-center">
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
        </>
      ),
      width: '100px'
    }
  ];

  return (
    <article className={`pt-5 pb-5 ${isMobile ? 'ps-3 pe-3' : isTablet ? 'ps-4 pe-4' : 'pe-5'}`}>
      <div className="d-flex justify-content-between align-items-center">
        <label className='h5 fw-semibold pt-2'>Major Accomplishment</label>
        <div className="d-flex align-items-center gap-2">
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ minWidth: '250px' }}
            />
            {searchQuery && (
              <button
                className="btn btn-close"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  zIndex: '1',
                }}
                onClick={() => setSearchQuery('')}
              >
              </button>
            )}
          </div>
          <div className='sample me-3 filterTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <Tooltip anchorSelect=".filterTooltip" style={{ borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              Filter
            </Tooltip>
            <button type="button" className="btn border-0" onClick={() => setShowFilterModal(true)}>
              <i className="fa-solid fa-filter fs-5"></i>
            </button>
          </div>
          <div className='sample me-3 addTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <Tooltip anchorSelect=".addTooltip" style={{ borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              Add
            </Tooltip>
            <button type="button" className="btn border-0" onClick={openAdd}>
              <i className="fa-solid fa-plus fs-5"></i>
            </button>
          </div>
          <div className='sample me-3 exportTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <Tooltip anchorSelect=".exportTooltip" style={{ borderRadius: '10px', fontSize: '12px', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
              Export
            </Tooltip>
            <button type="button" className="btn border-0" onClick={exportCSV}>
              <i className="fa-solid fa-download fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
        pagination
        responsive
        highlightOnHover
        striped
        paginationPerPage={isMobile ? 5 : 10}
        paginationRowsPerPageOptions={isMobile ? [5, 10, 15] : [10, 25, 50]}
        className={!isMobile ? 'pt-5' : ''}
        style={{ 
          paddingLeft: !isMobile && sidebarExpanded ? (isTablet ? '250px' : '300px') : (isMobile ? '0px' : '150px'), 
          transition: 'padding-left 0.3s',
          fontSize: isMobile ? '12px' : '14px'
        }}
      />

      {/* Add Modal (mini page) */}
      <div className={`modal fade ${showAddModal ? 'show' : ''}`} style={{ display: showAddModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold">Add Major Accomplishment</h5>
              <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Year</label>
                <select className="form-select form-select-sm" value={newYear} onChange={(e) => setNewYear(e.target.value)}>
                  {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Title</label>
                <input className="form-control form-control-sm" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control form-control-sm" rows={4} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button type="button" className="btn btn-primary btn-sm px-3" onClick={handleAddSubmit}>Insert</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedRecord && (
        <div className={`modal fade show`} style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-semibold">Edit Major Accomplishment</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRecord(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Title</label>
                  <input 
                    className="form-control form-control-sm" 
                    value={selectedRecord.title} 
                    onChange={(e) => setSelectedRecord({...selectedRecord, title: e.target.value})} 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea 
                    className="form-control form-control-sm" 
                    rows={4} 
                    value={selectedRecord.description} 
                    onChange={(e) => setSelectedRecord({...selectedRecord, description: e.target.value})} 
                  />
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => setSelectedRecord(null)}>Cancel</button>
                <button 
                  type="button" 
                  className="btn btn-primary btn-sm px-3" 
                  onClick={() => {
                    updateRow(selectedRecord.originalIdx, 'title', selectedRecord.title);
                    updateRow(selectedRecord.originalIdx, 'description', selectedRecord.description);
                    setSelectedRecord(null);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      <div className={`modal fade ${showFilterModal ? 'show' : ''}`} style={{ display: showFilterModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-sm modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-semibold">Filter Major Accomplishments</h5>
              <button type="button" className="btn-close" onClick={() => setShowFilterModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Search by Title</label>
                <input className="form-control form-control-sm" placeholder="Enter title..." value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Search by Description</label>
                <input className="form-control form-control-sm" placeholder="Enter description..." value={filterDesc} onChange={(e) => setFilterDesc(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => { setFilterTitle(''); setFilterDesc(''); setShowFilterModal(false); }}>Clear</button>
              <button type="button" className="btn btn-primary btn-sm px-3" onClick={() => setShowFilterModal(false)}>Apply</button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MajorAccomplishment;
