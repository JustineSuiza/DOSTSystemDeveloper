import { normalizeImportedConceptProposalRows } from './conceptProposalImportUtils';

describe('normalizeImportedConceptProposalRows', () => {
  it('maps imported spreadsheet rows into concept proposal objects', () => {
    const importedRows = [
      {
        Classification: 'R&D',
        'Date Received': '2024-01-01',
        'Date Actioned': '2024-01-02',
        'Lead TRD': 'SERD',
        'Concept Proposal Title': 'Sample Proposal',
        'Project Leader': 'Juan Dela Cruz',
        'Implementing Agency': 'DOST',
        'Proposed Budget': '100000',
        Status: 'Submitted',
      },
    ];

    const result = normalizeImportedConceptProposalRows(importedRows);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      classification: 'R&D',
      dateReceived: '2024-01-01',
      dateActioned: '2024-01-02',
      leadTRD: 'SERD',
      conceptTitle: 'Sample Proposal',
      projectLeader: 'Juan Dela Cruz',
      implementingAgency: 'DOST',
      proposedBudget: '100000',
      status: 'Submitted',
      files: '',
    });
    expect(result[0].id).toBeDefined();
  });
});
