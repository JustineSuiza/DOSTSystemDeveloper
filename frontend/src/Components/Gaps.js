import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import './Projects.css';

const Gaps = ({ sidebarExpanded }) => {
  const [gapsData, setGapsData] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState(null);
  const [newGap, setNewGap] = useState({ phase: '', hatchery: '', nursery: '', growOut: '', postHarvest: '' });

  const yearOptions = ['2011-2016', '2017-2021', '2022-2028'];

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

  const filteredData = gapsData.filter((row) => {
    const matchesSearch =
      row.phase.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.hatchery.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.nursery.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.growOut.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.postHarvest.toLowerCase().includes(filterValue.toLowerCase());

    const matchesYear = selectedYear ? row.phase === selectedYear : true;

    return matchesSearch && matchesYear;
  });

  const columns = [
    { name: 'ISP Phase', selector: (row) => row.phase, sortable: true, wrap: true, minWidth: '160px' },
    { name: 'Hatchery', selector: (row) => row.hatchery, sortable: true, wrap: true },
    { name: 'Nursery', selector: (row) => row.nursery, sortable: true, wrap: true },
    { name: 'Grow-out', selector: (row) => row.growOut, sortable: true, wrap: true },
    { name: 'Post-harvest', selector: (row) => row.postHarvest, sortable: true, wrap: true },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <div className="dropdown dropstart">
            <button className="btn btn-outline rounded-circle" style={{ paddingInline: '11px' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
            <ul className="dropdown-menu border-0 p-0 m-0 h-auto w-auto shadow-lg text-start">
              <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleViewDetails(row)}>
                <div className="d-flex align-items-center">
                  <div className='p-1 px-2 pt-1 me-1'>
                    <i className="bi bi-info-circle fs-5"></i>
                  </div>
                  <div className='d-flex flex-column'>
                    <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>View Details</div>
                  </div>
                </div>
              </li>
              <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleEditOpen(row)}>
                <div className="d-flex align-items-center">
                  <div className='p-1 px-2 pt-1 me-1'>
                    <i className="bi bi-pencil-square fs-5"></i>
                  </div>
                  <div className='d-flex flex-column'>
                    <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>Edit</div>
                  </div>
                </div>
              </li>
              <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleDeleteGap(row.id)}>
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
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      minWidth: '120px'
    }
  ];

  const handleRefresh = () => {
    setGapsData([]);
    setFilterValue('');
    setSelectedYear('');
  };

  const handleViewDetails = (row) => {
    setSelectedGap(row);
    setIsViewOpen(true);
  };

  const handleEditOpen = (row) => {
    setSelectedGap(row);
    setNewGap({
      phase: row.phase || '',
      hatchery: row.hatchery || '',
      nursery: row.nursery || '',
      growOut: row.growOut || '',
      postHarvest: row.postHarvest || '',
    });
    setIsEditOpen(true);
  };

  const handleDeleteGap = (id) => {
    if (!window.confirm('Are you sure you want to delete this gap record?')) return;
    setGapsData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleExport = () => {
    const exportRows = filteredData.map((row, index) => ({
      'No.': index + 1,
      'ISP Phase': row.phase,
      'Hatchery': row.hatchery,
      'Nursery': row.nursery,
      'Grow-out': row.growOut,
      'Post-harvest': row.postHarvest,
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [{ wch: 10 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }, { wch: 25 }];
    const wb = { Sheets: { Gaps: ws }, SheetNames: ['Gaps'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Gaps.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddOpen = () => {
    setSelectedGap(null);
    setNewGap({ phase: '', hatchery: '', nursery: '', growOut: '', postHarvest: '' });
    setIsAddOpen(true);
  };

  const handleAddGap = () => {
    if (!newGap.phase.trim()) {
      alert('Please enter ISP Phase before adding.');
      return;
    }

    setGapsData((prev) => [{ ...newGap, id: Date.now() }, ...prev]);
    setIsAddOpen(false);
  };

  const handleSaveEdit = () => {
    if (!newGap.phase.trim()) {
      alert('Please enter ISP Phase before saving.');
      return;
    }

    setGapsData((prev) => prev.map((item) => (item.id === selectedGap.id ? { ...item, ...newGap } : item)));
    setIsEditOpen(false);
    setSelectedGap(null);
  };

  return (
    <article className={`pt-5 pb-5 ${isMobile ? 'ps-3 pe-3' : isTablet ? 'ps-4 pe-4' : 'pe-5'}`}>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <label className='h5 fw-semibold pt-2'>Gaps</label>
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
          <div className='sample me-3 filterTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <button
              type="button"
              className="btn border-0"
              onClick={() => setIsFilterOpen(true)}
              data-bs-toggle="tooltip"
              data-bs-title="Filter"
            >
              <i className="fa-solid fa-filter fs-5"></i>
            </button>
          </div>
          <div className='sample me-3 addNewTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <button
              type="button"
              className="btn border-0"
              onClick={handleAddOpen}
              data-bs-toggle="tooltip"
              data-bs-title="Add Gap"
            >
              <i className="fa-solid fa-plus fs-5"></i>
            </button>
          </div>
          <div className='sample me-3 refreshTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <button
              type="button"
              className="btn border-0"
              onClick={handleRefresh}
              data-bs-toggle="tooltip"
              data-bs-title="Refresh"
            >
              <i className="fa-solid fa-sync fs-5"></i>
            </button>
          </div>
          <div className='sample me-3 excelTooltip' style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <button
              type="button"
              className="btn border-0"
              onClick={handleExport}
              data-bs-toggle="tooltip"
              data-bs-title="Export to Excel"
            >
              <i className="fa-solid fa-file-excel fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      <div className='table-responsive pt-4 goals-table-wrapper major-table-wrapper'>
        <DataTable
          columns={columns}
          data={filteredData}
          noDataComponent="No gaps found"
          pagination
          responsive
          highlightOnHover
          striped
          paginationPerPage={isMobile ? 5 : 10}
          paginationRowsPerPageOptions={isMobile ? [5, 10, 15] : [10, 25, 50]}
          className={!isMobile ? 'pt-5 major-table' : 'major-table'}
          style={{
            paddingLeft: !isMobile && sidebarExpanded ? (isTablet ? '250px' : '300px') : (isMobile ? '0px' : '150px'),
            transition: 'padding-left 0.3s',
            fontSize: isMobile ? '12px' : '14px'
          }}
        />
      </div>

      {isFilterOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Filter</h5>
                <button type="button" className="btn-close" onClick={() => setIsFilterOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Year</label>
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">Select Year</option>
                    {yearOptions.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFilterOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isAddOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Gap</h5>
                <button type="button" className="btn-close" onClick={() => setIsAddOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">ISP Phase</label>
                    <select
                      className="form-select"
                      value={newGap.phase}
                      onChange={(e) => setNewGap({ ...newGap, phase: e.target.value })}
                    >
                      <option value="">Select ISP Phase</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hatchery</label>
                    <input type="text" className="form-control" value={newGap.hatchery} onChange={(e) => setNewGap({ ...newGap, hatchery: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nursery</label>
                    <input type="text" className="form-control" value={newGap.nursery} onChange={(e) => setNewGap({ ...newGap, nursery: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Grow-out</label>
                    <input type="text" className="form-control" value={newGap.growOut} onChange={(e) => setNewGap({ ...newGap, growOut: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Post-harvest</label>
                    <input type="text" className="form-control" value={newGap.postHarvest} onChange={(e) => setNewGap({ ...newGap, postHarvest: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddGap}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Gap</h5>
                <button type="button" className="btn-close" onClick={() => { setIsEditOpen(false); setSelectedGap(null); }} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">ISP Phase</label>
                    <select
                      className="form-select"
                      value={newGap.phase}
                      onChange={(e) => setNewGap({ ...newGap, phase: e.target.value })}
                    >
                      <option value="">Select ISP Phase</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Hatchery</label>
                    <input type="text" className="form-control" value={newGap.hatchery} onChange={(e) => setNewGap({ ...newGap, hatchery: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nursery</label>
                    <input type="text" className="form-control" value={newGap.nursery} onChange={(e) => setNewGap({ ...newGap, nursery: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Grow-out</label>
                    <input type="text" className="form-control" value={newGap.growOut} onChange={(e) => setNewGap({ ...newGap, growOut: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Post-harvest</label>
                    <input type="text" className="form-control" value={newGap.postHarvest} onChange={(e) => setNewGap({ ...newGap, postHarvest: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsEditOpen(false); setSelectedGap(null); }}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isViewOpen && selectedGap && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Gap Details</h5>
                <button type="button" className="btn-close" onClick={() => { setIsViewOpen(false); setSelectedGap(null); }} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3"><strong>ISP Phase:</strong> {selectedGap.phase}</div>
                <div className="mb-3"><strong>Hatchery:</strong> {selectedGap.hatchery || '-'}</div>
                <div className="mb-3"><strong>Nursery:</strong> {selectedGap.nursery || '-'}</div>
                <div className="mb-3"><strong>Grow-out:</strong> {selectedGap.growOut || '-'}</div>
                <div className="mb-3"><strong>Post-harvest:</strong> {selectedGap.postHarvest || '-'}</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setIsViewOpen(false); setSelectedGap(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default Gaps;
