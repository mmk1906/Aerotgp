import * as XLSX from 'xlsx';
import { ClubMember } from '../services/databaseService';

/**
 * Export club members to CSV file
 */
export const exportMembersToCSV = (members: ClubMember[], filename: string = 'club-members.csv') => {
  // Prepare data for export
  const csvData = members.map(member => ({
    'Member Name': member.userName,
    'Email': member.email || 'N/A',
    'Department': member.department || 'N/A',
    'Year': member.year || 'N/A',
    'Club': member.clubName,
    'Role': member.role,
    'Join Date': new Date(member.joinedDate).toLocaleDateString(),
    'Phone': member.phone || 'N/A',
    'Contribution': member.contribution || 'N/A',
    'Status': member.status,
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(csvData);
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members');

  // Generate CSV and download
  XLSX.writeFile(wb, filename, { bookType: 'csv' });
};

/**
 * Export club members to Excel file
 */
export const exportMembersToExcel = (members: ClubMember[], filename: string = 'club-members.xlsx') => {
  // Prepare data for export
  const excelData = members.map(member => ({
    'Member Name': member.userName,
    'Email': member.email || 'N/A',
    'Department': member.department || 'N/A',
    'Year': member.year || 'N/A',
    'Club': member.clubName,
    'Role': member.role,
    'Join Date': new Date(member.joinedDate).toLocaleDateString(),
    'Phone': member.phone || 'N/A',
    'Contribution': member.contribution || 'N/A',
    'Status': member.status,
    'Featured': member.isFeatured ? 'Yes' : 'No',
  }));

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 25 }, // Member Name
    { wch: 30 }, // Email
    { wch: 25 }, // Department
    { wch: 10 }, // Year
    { wch: 20 }, // Club
    { wch: 15 }, // Role
    { wch: 12 }, // Join Date
    { wch: 15 }, // Phone
    { wch: 30 }, // Contribution
    { wch: 10 }, // Status
    { wch: 10 }, // Featured
  ];
  ws['!cols'] = colWidths;

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Members');

  // Generate Excel and download
  XLSX.writeFile(wb, filename);
};

/**
 * Export single club's members
 */
export const exportSingleClubMembers = (
  members: ClubMember[], 
  clubName: string, 
  format: 'csv' | 'excel' = 'excel'
) => {
  const filename = `${clubName.toLowerCase().replace(/\s+/g, '-')}-members.${format === 'csv' ? 'csv' : 'xlsx'}`;
  
  if (format === 'csv') {
    exportMembersToCSV(members, filename);
  } else {
    exportMembersToExcel(members, filename);
  }
};

/**
 * Export all clubs data with statistics
 */
export const exportAllClubsData = (clubsWithMembers: { clubName: string; members: ClubMember[] }[]) => {
  const wb = XLSX.utils.book_new();

  // Create summary sheet
  const summary = clubsWithMembers.map(club => ({
    'Club Name': club.clubName,
    'Total Members': club.members.length,
    'Active Members': club.members.filter(m => m.status === 'active').length,
    'Featured Members': club.members.filter(m => m.isFeatured).length,
    'Core Members': club.members.filter(m => m.role?.toLowerCase().includes('core')).length,
  }));

  const summaryWs = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Create sheet for each club
  clubsWithMembers.forEach(club => {
    const memberData = club.members.map(member => ({
      'Name': member.userName,
      'Email': member.email || 'N/A',
      'Department': member.department || 'N/A',
      'Year': member.year || 'N/A',
      'Role': member.role,
      'Join Date': new Date(member.joinedDate).toLocaleDateString(),
      'Phone': member.phone || 'N/A',
      'Status': member.status,
      'Featured': member.isFeatured ? 'Yes' : 'No',
    }));

    const ws = XLSX.utils.json_to_sheet(memberData);
    // Truncate sheet name if too long (Excel limit is 31 chars)
    const sheetName = club.clubName.substring(0, 30);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Generate Excel and download
  XLSX.writeFile(wb, `all-clubs-data-${new Date().toISOString().split('T')[0]}.xlsx`);
};
