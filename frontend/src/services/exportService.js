import api from './api';

const downloadFile = async (url, filename) => {
  const response = await api.get(url, { responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
};

const exportService = {
  exportExpensesCsv: () => downloadFile('/exports/expenses.csv', 'expenses.csv'),
  exportIncomeCsv: () => downloadFile('/exports/income.csv', 'income.csv'),
  exportMonthlyReportPdf: () => downloadFile('/exports/monthly-report.pdf', 'monthly-report.pdf'),
};

export default exportService;
