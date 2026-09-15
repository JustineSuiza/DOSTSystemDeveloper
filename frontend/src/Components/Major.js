import React, { useState, useEffect, useRef } from 'react';
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import './Major.css';

const Major = ({ sidebarExpanded }) => {
  const [entries, setEntries] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [technology, setTechnology] = useState('');
  const [level, setLevel] = useState('');
  const [modalities, setModalities] = useState('');
  const [remarks, setRemarks] = useState('');
  const [trlLink, setTrlLink] = useState('');
  const [instructions, setInstructions] = useState('');
  const isFirstLoad = useRef(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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
    const stored = localStorage.getItem('majorData');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch (e) {
        setEntries([]);
      }
    } else {
      // seed with example row when no data exists
      setEntries([
        {
          technology: 'Example Technology / Project',
          level: '5',
          modalities: 'Licensing / Collaboration',
          remarks: 'IA continued the R&D, further studies not pursued due to high cost of scaling up, etc',
          trlLink: 'https://drive.google.com/drive/folders/1i-TfG1gaOpyCbkx-s-4ZOu8JJKm61NhF_',
          instructions: ''
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // avoid overwriting existing data on first render
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    localStorage.setItem('majorData', JSON.stringify(entries));
  }, [entries]);

  const handleDelete = (idx) => {
    if (!window.confirm('Delete this entry?')) return;
    setEntries(prev => prev.filter((_, i) => i !== idx));
  };

  const handleOpenAddModal = () => {
    setSelectedIndex(null);
    setIsEditMode(false);
    setTechnology('');
    setLevel('');
    setModalities('');
    setRemarks('');
    setTrlLink('');
    setInstructions('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (idx) => {
    const entry = entries[idx];
    if (!entry) return;
    setSelectedIndex(idx);
    setIsEditMode(true);
    setTechnology(entry.technology || '');
    setLevel(entry.level || '');
    setModalities(entry.modalities || '');
    setRemarks(entry.remarks || '');
    setTrlLink(entry.trlLink || '');
    setInstructions(entry.instructions || '');
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (idx) => {
    setSelectedIndex(idx);
    setIsViewModalOpen(true);
  };

  const handleCloseAddModal = () => setIsAddModalOpen(false);
  const handleCloseViewModal = () => setIsViewModalOpen(false);

  const handleAddEntry = () => {
    if (!technology) { alert('Please enter Technology'); return; }
    const newEntry = { technology, level, modalities, remarks, trlLink, instructions };
    if (isEditMode && selectedIndex !== null) {
      setEntries(prev => prev.map((item, idx) => idx === selectedIndex ? newEntry : item));
    } else {
      setEntries(prev => [newEntry, ...prev]);
    }
    setIsAddModalOpen(false);
    setIsEditMode(false);
    setSelectedIndex(null);
  };

  const exportToExcel = () => {
    const exportRows = filteredData.map((r, i) => ({
      'No.': i + 1,
      'Technologies': r.technology || r.milestone || '',
      'Level (1-9)': r.level || '',
      'Tech Trans Modalities': r.modalities || '',
      'Remarks': r.remarks || '',
      'Link to TRL Assessment': r.trlLink || '',
      'Instructions': r.instructions || '',
    }));
    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [{ wch: 5 }, { wch: 40 }, { wch: 10 }, { wch: 25 }, { wch: 30 }, { wch: 40 }, { wch: 20 }];
    const wb = { Sheets: { Major: ws }, SheetNames: ['Major'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Major.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    { name: 'No.', selector: (row, idx) => idx + 1, sortable: true, width: '80px' },
    { name: 'Technologies', selector: row => row.technology || row.milestone || '-', sortable: true, wrap: true, minWidth: '220px' },
    { name: 'Level (1-9)', selector: row => row.level || '-', sortable: true, width: '120px' },
    { name: 'Tech Trans Modalities', selector: row => row.modalities || '-', wrap: true, minWidth: '180px' },
    { name: 'Remarks', selector: row => row.remarks || '-', wrap: true, minWidth: '220px' },
    { name: 'Link to TRL Assessment', selector: row => row.trlLink ? <a href={row.trlLink} target="_blank" rel="noreferrer">Link</a> : '-', wrap: true, minWidth: '180px' },
    { name: 'Instructions', selector: row => row.instructions || '-', wrap: true, minWidth: '120px' },
    {
      name: 'Actions', cell: (row, idx) => (
        <div className="dropdown dropstart">
          <button className="btn btn-outline rounded-circle" style={{ paddingInline: '11px' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          <ul className="dropdown-menu border-0 p-0 m-0 h-auto w-auto shadow-lg text-start">
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleViewDetails(idx)}>
              <div className="d-flex align-items-center">
                <div className='p-1 px-2 pt-1 me-1'>
                  <i className="bi bi-info-circle fs-5"></i>
                </div>
                <div className='d-flex flex-column'>
                  <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>View Details</div>
                </div>
              </div>
            </li>
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleOpenEditModal(idx)}>
              <div className="d-flex align-items-center">
                <div className='p-1 px-2 pt-1 me-1'>
                  <i className="bi bi-pencil-square fs-5"></i>
                </div>
                <div className='d-flex flex-column'>
                  <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>Edit</div>
                </div>
              </div>
            </li>
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleDelete(idx)}>
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
      ), width: '100px'
    }
  ];

  const filteredData = entries.filter(row => {
    const q = filterValue.toLowerCase();
    if (!q) return true;
    return (
      (row.technology && row.technology.toLowerCase().includes(q)) ||
      (row.milestone && row.milestone.toLowerCase().includes(q)) ||
      (row.modalities && row.modalities.toLowerCase().includes(q)) ||
      (row.remarks && row.remarks.toLowerCase().includes(q)) ||
      (row.instructions && row.instructions.toLowerCase().includes(q)) ||
      (row.trlLink && row.trlLink.toLowerCase().includes(q)) ||
      (row.level && String(row.level).toLowerCase().includes(q))
    );
  });

  const customStyles = {
    table: {
      style: {
        borderCollapse: 'separate',
      }
    },
    tableWrapper: {
      style: {
        borderRadius: '0',
        border: '0',
      }
    },
    headRow: {
      style: {
        borderBottomWidth: '0px',
      }
    },
    rows: {
      style: {
        minHeight: '72px',
        borderBottomWidth: '0px',
      }
    },
    cells: {
      style: {
        borderBottomWidth: '0px',
      }
    }
  };

  const sortedData = [...filteredData];

  return (
    <article className={`pt-5 pb-5 ${sidebarExpanded ? 'ps-4 pe-4' : 'ps-3 pe-3'}`}>
      <div className="d-flex justify-content-between align-items-start flex-wrap">
        <div>
          <label className="h5 fw-semibold pt-2">Major Milestone</label>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap major-actions">
          <div className="me-3" style={{ minWidth: '240px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search..."
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="form-control"
                style={{ width: '100%', fontSize: '14px' }}
              />
              {filterValue && (
                <button className="btn btn-close" style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', zIndex: '1' }} onClick={() => setFilterValue('')} />
              )}
            </div>
          </div>

          <div className='me-3'>
            <button type="button" className="btn major-icon-button" title="Add Entry" onClick={handleOpenAddModal}>
              <i className="fa-solid fa-plus fs-5"></i>
            </button>
          </div>
          <div className='me-3'>
            <button type="button" className="btn major-icon-button" title="Export to Excel" onClick={exportToExcel}>
              <i className="fa-solid fa-file-excel fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="card major-card rounded-3">
          <div className="card-body p-0">
            <div className="table-responsive major-table-wrapper">
              <DataTable
                className={`major-table ${!isMobile ? 'pt-5' : ''}`}
                columns={columns}
                data={sortedData}
                pagination
                responsive
                highlightOnHover
                striped
                customStyles={customStyles}
                paginationPerPage={isMobile ? 5 : 10}
                paginationRowsPerPageOptions={isMobile ? [5,10,15] : [10,25,50]}
                style={{ paddingLeft: !isMobile && sidebarExpanded ? (isTablet ? '250px' : '300px') : (isMobile ? '0px' : '150px'), transition: 'padding-left 0.3s', fontSize: isMobile ? '12px' : '14px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="major-modal-backdrop">
          <div className="major-modal card p-3">
            <h5 className="mb-3">{isEditMode ? 'Edit Major Milestone' : 'Add Major Milestone'}</h5>
            <div className="mb-2">
              <label className="form-label">Technologies</label>
              <input className="form-control" value={technology} onChange={e => setTechnology(e.target.value)} />
            </div>
            <div className="mb-2 row">
              <div className="col-4">
                <label className="form-label">Level (1-9)</label>
                <select className="form-control" value={level} onChange={e => setLevel(e.target.value)}>
                  <option value="">Select Level</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                </select>
              </div>
              <div className="col-8">
                <label className="form-label">Tech Trans Modalities</label>
                <select className="form-control" value={modalities} onChange={e => setModalities(e.target.value)}>
                  <option value="">Select Modalities</option>
                  <option value="Deployment">Deployment</option>
                  <option value="Roll-out">Roll-out</option>
                  <option value="Commercialization">Commercialization</option>
                </select>
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Remarks</label>
              <textarea className="form-control" value={remarks} onChange={e => setRemarks(e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">Link to TRL Assessment</label>
              <input className="form-control" value={trlLink} onChange={e => setTrlLink(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Instructions</label>
              <textarea className="form-control" value={instructions} onChange={e => setInstructions(e.target.value)} />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCloseAddModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddEntry}>Save</button>
            </div>
          </div>
        </div>
      )}
      {isViewModalOpen && selectedIndex !== null && (
        <div className="major-modal-backdrop">
          <div className="major-modal card p-3">
            <h5 className="mb-3">Major Milestone Details</h5>
            <div className="mb-2">
              <strong>Technologies</strong>
              <div>{entries[selectedIndex]?.technology || '-'}</div>
            </div>
            <div className="mb-2">
              <strong>Level (1-9)</strong>
              <div>{entries[selectedIndex]?.level || '-'}</div>
            </div>
            <div className="mb-2">
              <strong>Tech Trans Modalities</strong>
              <div>{entries[selectedIndex]?.modalities || '-'}</div>
            </div>
            <div className="mb-2">
              <strong>Remarks</strong>
              <div>{entries[selectedIndex]?.remarks || '-'}</div>
            </div>
            <div className="mb-2">
              <strong>Link to TRL Assessment</strong>
              <div>{entries[selectedIndex]?.trlLink ? <a href={entries[selectedIndex].trlLink} target="_blank" rel="noreferrer">Open Link</a> : '-'}</div>
            </div>
            <div className="mb-3">
              <strong>Instructions</strong>
              <div>{entries[selectedIndex]?.instructions || '-'}</div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-secondary" onClick={handleCloseViewModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Major;
