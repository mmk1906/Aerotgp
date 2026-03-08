// Excel/CSV Export Service
import * as XLSX from 'xlsx';

export interface ExportData {
  [key: string]: any;
}

// Export data to Excel
export const exportToExcel = (data: ExportData[], fileName: string): void => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate Excel file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw new Error('Failed to export to Excel');
  }
};

// Export data to CSV
export const exportToCSV = (data: ExportData[], fileName: string): void => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // Generate CSV file
    XLSX.writeFile(wb, `${fileName}.csv`);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw new Error('Failed to export to CSV');
  }
};

// Format event registrations for export
export const formatEventRegistrationsForExport = (registrations: any[]): ExportData[] => {
  return registrations.map(reg => ({
    'Registration ID': reg.id,
    'Name': reg.userName,
    'Email': reg.userEmail,
    'Phone': reg.userPhone || 'N/A',
    'Event': reg.eventTitle || 'N/A',
    'Status': reg.status,
    'Payment Status': reg.paymentStatus,
    'Registration Date': reg.createdAt ? new Date(reg.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
  }));
};

// Format users for export
export const formatUsersForExport = (users: any[]): ExportData[] => {
  return users.map(user => ({
    'User ID': user.id,
    'Name': user.name,
    'Email': user.email,
    'Phone': user.phone || 'N/A',
    'Department': user.department || 'N/A',
    'Year': user.year || 'N/A',
    'PRN': user.prn || 'N/A',
    'Role': user.role,
    'Join Date': user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
  }));
};

// Format club members for export
export const formatClubMembersForExport = (members: any[]): ExportData[] => {
  return members.map(member => ({
    'Member ID': member.id,
    'Name': member.name,
    'Email': member.email,
    'Phone': member.phone || 'N/A',
    'Department': member.department || 'N/A',
    'Year': member.year || 'N/A',
    'Position': member.position || 'N/A',
    'Status': member.status,
    'Joined Date': member.joinedDate || 'N/A',
  }));
};

// Format blog submissions for export
export const formatBlogsForExport = (blogs: any[]): ExportData[] => {
  return blogs.map(blog => ({
    'Blog ID': blog.id,
    'Title': blog.title,
    'Author': blog.authorName,
    'Category': blog.category,
    'Status': blog.status,
    'Views': blog.views || 0,
    'Likes': blog.likes || 0,
    'Created Date': blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
  }));
};

// Format test results for export
export const formatTestResultsForExport = (results: any[]): ExportData[] => {
  return results.map(result => ({
    'Test ID': result.id,
    'Student Name': result.userName,
    'Test Title': result.testTitle,
    'Score': result.score,
    'Total Questions': result.totalQuestions,
    'Correct Answers': result.correctAnswers,
    'Incorrect Answers': result.incorrectAnswers,
    'Time Taken (minutes)': result.timeTaken || 'N/A',
    'Status': result.passed ? 'Passed' : 'Failed',
    'Date': result.createdAt ? new Date(result.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
  }));
};

// Format gallery photos for export
export const formatGalleryForExport = (photos: any[]): ExportData[] => {
  return photos.map(photo => ({
    'Photo ID': photo.id,
    'Caption': photo.caption,
    'Category': photo.category,
    'Uploaded By': photo.uploaderName,
    'Status': photo.status,
    'Likes': photo.likes || 0,
    'Upload Date': photo.createdAt ? new Date(photo.createdAt.seconds * 1000).toLocaleDateString() : 'N/A',
  }));
};

// Generic export function with auto-formatting
export const exportData = (
  data: any[],
  fileName: string,
  format: 'excel' | 'csv' = 'excel',
  dataType?: 'users' | 'events' | 'clubs' | 'blogs' | 'quizzes' | 'gallery'
): void => {
  let formattedData = data;
  
  // Auto-format based on data type
  if (dataType) {
    switch (dataType) {
      case 'users':
        formattedData = formatUsersForExport(data);
        break;
      case 'events':
        formattedData = formatEventRegistrationsForExport(data);
        break;
      case 'clubs':
        formattedData = formatClubMembersForExport(data);
        break;
      case 'blogs':
        formattedData = formatBlogsForExport(data);
        break;
      case 'quizzes':
        formattedData = formatTestResultsForExport(data);
        break;
      case 'gallery':
        formattedData = formatGalleryForExport(data);
        break;
    }
  }
  
  if (format === 'csv') {
    exportToCSV(formattedData, fileName);
  } else {
    exportToExcel(formattedData, fileName);
  }
};