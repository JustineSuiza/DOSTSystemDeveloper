import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import './Projects.css';

const MajorPrograms = ({ sidebarExpanded }) => {
  const [programsData, setProgramsData] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [newProgram, setNewProgram] = useState({ id: null, program: '', duration: '', budget: '', bannerProgram: '', pillar: '', strategy: '' });

  const yearOptions = ['2026', '2027', '2028'];

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

  const filteredData = programsData.filter((row) => {
    const matchesSearch =
      row.program.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.duration.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.budget.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.bannerProgram.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.pillar.toLowerCase().includes(filterValue.toLowerCase()) ||
      row.strategy.toLowerCase().includes(filterValue.toLowerCase());

    const matchesYear = selectedYear ? row.duration.includes(selectedYear) : true;

    return matchesSearch && matchesYear;
  });

  const columns = [
    { name: 'Program/Project', selector: (row) => row.program, sortable: true, wrap: true, minWidth: '200px' },
    { name: 'Duration', selector: (row) => row.duration, sortable: true, wrap: true },
    { name: 'Budget', selector: (row) => row.budget, sortable: true, wrap: true },
    { name: 'Banner Program', selector: (row) => row.bannerProgram, sortable: true, wrap: true },
    { name: 'Pillar', selector: (row) => row.pillar, sortable: true, wrap: true },
    { name: 'Strategy', selector: (row) => row.strategy, sortable: true, wrap: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="dropdown dropstart">
          <button className="btn btn-outline rounded-circle" style={{ paddingInline: '11px' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          <ul className="dropdown-menu border-0 p-0 m-0 h-auto w-auto shadow-lg text-start">
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleViewDetails(row)}>
              <div className="d-flex align-items-center">
                <div className='p-1 px-2 pt-1 me-1'>
                  <i className="bi bi-eye fs-5"></i>
                </div>
                <div className='d-flex flex-column'>
                  <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>View Details</div>
                </div>
              </div>
            </li>
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleEditProgram(row)}>
              <div className="d-flex align-items-center">
                <div className='p-1 px-2 pt-1 me-1'>
                  <i className="bi bi-pencil-square fs-5"></i>
                </div>
                <div className='d-flex flex-column'>
                  <div className='fw-medium' style={{ fontSize: '13px', paddingTop: '2px' }}>Edit</div>
                </div>
              </div>
            </li>
            <li className='m-1 notif-item' style={{ width: '210px' }} onClick={() => handleDeleteProgram(row.id)}>
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
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  const handleRefresh = () => {
    setProgramsData([]);
    setFilterValue('');
    setSelectedYear('');
  };

  const handleExport = () => {
    const exportRows = filteredData.map((row, index) => ({
      'No.': index + 1,
      'Program/Project': row.program,
      Duration: row.duration,
      Budget: row.budget,
      'Banner Program': row.bannerProgram,
      Pillar: row.pillar,
      Strategy: row.strategy,
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    ws['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 30 }];
    const wb = { Sheets: { 'Major Programs': ws }, SheetNames: ['Major Programs'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CY_2026-2028_Major_Programs.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddOpen = () => {
    setIsEditing(false);
    setNewProgram({ id: null, program: '', duration: '', budget: '', bannerProgram: '', pillar: '', strategy: '' });
    setIsAddOpen(true);
  };

  const handleViewDetails = (row) => {
    setSelectedProgram(row);
    setIsViewOpen(true);
  };

  const handleEditProgram = (row) => {
    setIsEditing(true);
    setNewProgram({ ...row });
    setIsAddOpen(true);
  };

  const handleDeleteProgram = (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      setProgramsData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAddProgram = () => {
    if (!newProgram.program.trim()) {
      alert('Please enter a program or project name.');
      return;
    }

    if (isEditing && newProgram.id !== null) {
      setProgramsData((prev) => prev.map((item) => (item.id === newProgram.id ? newProgram : item)));
    } else {
      setProgramsData((prev) => [{ ...newProgram, id: Date.now() }, ...prev]);
    }

    setIsAddOpen(false);
  };

  return (
    <article className={`pt-5 pb-5 ${isMobile ? 'ps-3 pe-3' : isTablet ? 'ps-4 pe-4' : 'pe-5'}`}>
      <div className="d-flex justify-content-between align-items-center flex-wrap">
        <label className="h5 fw-semibold pt-2">CY 2026-2028 Major Programs</label>
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
          <div className="sample me-3 filterTooltip" style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
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
          <div className="sample me-3 addNewTooltip" style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
            <button
              type="button"
              className="btn border-0"
              onClick={handleAddOpen}
              data-bs-toggle="tooltip"
              data-bs-title="Add Program"
            >
              <i className="fa-solid fa-plus fs-5"></i>
            </button>
          </div>
          <div className="sample me-3 refreshTooltip" style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
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
          <div className="sample me-3 excelTooltip" style={{ borderRadius: '50px', padding: '7px 2px 2px 2px' }}>
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

      <div className="table-responsive pt-4 goals-table-wrapper major-table-wrapper">
        <DataTable
          columns={columns}
          data={filteredData}
          noDataComponent="No programs found"
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
            fontSize: isMobile ? '12px' : '14px',
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
                  <select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    <option value="">All years</option>
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

      {isViewOpen && selectedProgram && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Major Program Details</h5>
                <button type="button" className="btn-close" onClick={() => setIsViewOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <strong>Program/Project:</strong> {selectedProgram.program}
                  </div>
                  <div className="col-md-6">
                    <strong>Duration:</strong> {selectedProgram.duration}
                  </div>
                  <div className="col-md-6">
                    <strong>Budget:</strong> {selectedProgram.budget}
                  </div>
                  <div className="col-md-6">
                    <strong>Banner Program:</strong> {selectedProgram.bannerProgram}
                  </div>
                  <div className="col-md-6">
                    <strong>Pillar:</strong> {selectedProgram.pillar}
                  </div>
                  <div className="col-md-12">
                    <strong>Strategy:</strong> {selectedProgram.strategy}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsViewOpen(false)}>Close</button>
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
                <h5 className="modal-title">{isEditing ? 'Edit Major Program' : 'Add Major Program'}</h5>
                <button type="button" className="btn-close" onClick={() => setIsAddOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label">Program/Project</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProgram.program}
                      onChange={(e) => setNewProgram({ ...newProgram, program: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProgram.duration}
                      onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Budget</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProgram.budget}
                      onChange={(e) => setNewProgram({ ...newProgram, budget: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Banner Program</label>
                    <select
                      className="form-select"
                      value={newProgram.bannerProgram}
                      onChange={(e) => setNewProgram({ ...newProgram, bannerProgram: e.target.value })}
                    >
                      <option value="">Select Banner Program</option>
                      <option value="Strategic R&D">Strategic R&D</option>
                      <option value="R&D Results utilization">R&D Results utilization</option>
                      <option value="Policy Research and Advocacy">Policy Research and Advocacy</option>
                      <option value="Capacity Building and R&D Governance">Capacity Building and R&D Governance</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Pillar</label>
                    <select
                      className="form-select"
                      value={newProgram.pillar}
                      onChange={(e) => setNewProgram({ ...newProgram, pillar: e.target.value })}
                    >
                      <option value="">Select Pillar</option>
                      <option value="Human well-being">Human well-being</option>
                      <option value="Wealth creation">Wealth creation</option>
                      <option value="Wealth protection">Wealth protection</option>
                      <option value="Sustainability">Sustainability</option>
                    </select>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Strategy</label>
                    <select
                      className="form-select"
                      value={newProgram.strategy}
                      onChange={(e) => setNewProgram({ ...newProgram, strategy: e.target.value })}
                    >
                      <option value="">Select Strategy</option>
                      <option value="Achieve Quality">Achieve Quality</option>
                      <option value="Food Security">Food Security</option>
                      <option value="Health and Nutrition Improve">Health and Nutrition Improve</option>
                      <option value="Access to Clean Water">Access to Clean Water</option>
                      <option value="Advance Research and Development">Advance Research and Development</option>
                      <option value="Scale-up technology adaption">Scale-up technology adaption</option>
                      <option value="Strengthen provision of Science, Technology and Innovation support">Strengthen provision of Science, Technology and Innovation support</option>
                      <option value="Boost Intellectual Property">Boost Intellectual Property</option>
                      <option value="Advance Disaster Risk Reduction Management">Advance Disaster Risk Reduction Management</option>
                      <option value="Monitoring and Warning Systems">Monitoring and Warning Systems</option>
                      <option value="Strengthen Capabilities for Local Disaster Risk Reduction Management">Strengthen Capabilities for Local Disaster Risk Reduction Management</option>
                      <option value="Enhance Climate and Disaster Risk Reduction">Enhance Climate and Disaster Risk Reduction</option>
                      <option value="Intersify environmental sustain">Intersify environmental sustain</option>
                      <option value="Enhance ecosystem resilience">Enhance ecosystem resilience</option>
                      <option value="Establish smart and sustain community">Establish smart and sustain community</option>
                      <option value="Improve access clean and green">Improve access clean and green</option>
                      <option value="Institutionize science community">Institutionize science community</option>
                      <option value="Build robust institutional capacity">Build robust institutional capacity</option>
                      <option value="Rollout S&T enabled system">Rollout S&T enabled system</option>
                      <option value="Enhance lintages for Science and Technology Information Institute">Enhance lintages for Science and Technology Information Institute</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddProgram}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default MajorPrograms;
