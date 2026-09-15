import { matchesReportFilters } from './GenerateReport';

describe('matchesReportFilters', () => {
  it('matches selected tagging values case-insensitively', () => {
    const item = { tagging: 'Smart' };

    expect(matchesReportFilters(item, { selectedTagging: ['smart'] })).toBe(true);
    expect(matchesReportFilters(item, { selectedTagging: ['Climate change'] })).toBe(false);
  });

  it('supports combined status, funding, and tagging filters', () => {
    const item = {
      status: 'Completed',
      funding: 'PCAARRD GIA',
      tagging: 'Climate change',
    };

    expect(
      matchesReportFilters(item, {
        selectedStatus: ['Completed'],
        selectedFunding: ['PCAARRD GIA'],
        selectedTagging: ['Climate change'],
      })
    ).toBe(true);

    expect(
      matchesReportFilters(item, {
        selectedStatus: ['New'],
        selectedFunding: ['PCAARRD GIA'],
        selectedTagging: ['Climate change'],
      })
    ).toBe(false);
  });
});
