import * as XLSX from 'xlsx';
import { 
  EventRegistration, 
  ClubApplication, 
  Event
} from './databaseService';

// Helper to format timestamp
const formatDate = (timestamp: any): string => {
  if (!timestamp) return 'N/A';
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }
  return new Date(timestamp).toLocaleString();
};

// Export Event Registrations to Excel
export const exportEventRegistrationsToExcel = (registrations: EventRegistration[]) => {
  const data = registrations.map(reg => ({
    'Registration ID': reg.id || 'N/A',
    'User Name': reg.userName,
    'Email': reg.userEmail,
    'Phone': reg.userPhone || 'N/A',
    'Event ID': reg.eventId,
    'Status': reg.status,
    'Payment Status': reg.paymentStatus,
    'Registered At': formatDate(reg.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Event Registrations');

  // Auto-size columns
  const maxWidth = 50;
  const columnWidths = Object.keys(data[0] || {}).map(key => ({
    wch: Math.min(maxWidth, Math.max(key.length, 15))
  }));
  worksheet['!cols'] = columnWidths;

  // Download file
  const fileName = `Event_Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export Club Applications to Excel
export const exportClubApplicationsToExcel = (applications: ClubApplication[]) => {
  const data = applications.map(app => ({
    'Application ID': app.id || 'N/A',
    'Full Name': app.fullName,
    'Email': app.email,
    'Phone': app.phone,
    'Club Name': app.clubName,
    'Department': app.department,
    'Year': app.year,
    'Skills': app.skills,
    'Experience': app.experience || 'N/A',
    'Motivation': app.motivation,
    'Portfolio': app.portfolio || 'N/A',
    'Status': app.status,
    'Applied At': formatDate(app.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Club Applications');

  // Auto-size columns
  worksheet['!cols'] = [
    { wch: 15 }, // Application ID
    { wch: 20 }, // Full Name
    { wch: 30 }, // Email
    { wch: 15 }, // Phone
    { wch: 20 }, // Club Name
    { wch: 20 }, // Department
    { wch: 10 }, // Year
    { wch: 40 }, // Skills
    { wch: 40 }, // Experience
    { wch: 50 }, // Motivation
    { wch: 30 }, // Portfolio
    { wch: 12 }, // Status
    { wch: 20 }, // Applied At
  ];

  const fileName = `Club_Applications_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export Events to Excel
export const exportEventsToExcel = (events: Event[]) => {
  const data = events.map(event => ({
    'Event ID': event.id || 'N/A',
    'Title': event.title,
    'Description': event.description,
    'Date': new Date(event.date).toLocaleDateString(),
    'Venue': event.venue,
    'Type': event.isPaid ? 'Paid' : 'Free',
    'Price': event.isPaid ? `₹${event.price}` : 'Free',
    'Max Participants': event.maxParticipants,
    'Registered': event.registeredCount,
    'Status': event.status,
    'Registration Deadline': event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'N/A',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Events');

  worksheet['!cols'] = [
    { wch: 15 }, // Event ID
    { wch: 35 }, // Title
    { wch: 50 }, // Description
    { wch: 15 }, // Date
    { wch: 20 }, // Venue
    { wch: 10 }, // Type
    { wch: 10 }, // Price
    { wch: 15 }, // Max Participants
    { wch: 12 }, // Registered
    { wch: 12 }, // Status
    { wch: 20 }, // Registration Deadline
  ];

  const fileName = `Events_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Export All Data (Combined)
export const exportAllDataToExcel = (data: {
  events: Event[];
  registrations: EventRegistration[];
  clubs: ClubApplication[];
}) => {
  const workbook = XLSX.utils.book_new();

  // Events Sheet
  if (data.events.length > 0) {
    const eventsData = data.events.map(event => ({
      'Event ID': event.id || 'N/A',
      'Title': event.title,
      'Date': new Date(event.date).toLocaleDateString(),
      'Venue': event.venue,
      'Type': event.isPaid ? 'Paid' : 'Free',
      'Price': event.isPaid ? `₹${event.price}` : 'Free',
      'Registered': event.registeredCount,
      'Status': event.status,
    }));
    const eventsSheet = XLSX.utils.json_to_sheet(eventsData);
    XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Events');
  }

  // Registrations Sheet
  if (data.registrations.length > 0) {
    const regsData = data.registrations.map(reg => ({
      'Registration ID': reg.id || 'N/A',
      'User Name': reg.userName,
      'Email': reg.userEmail,
      'Phone': reg.userPhone || 'N/A',
      'Status': reg.status,
      'Payment Status': reg.paymentStatus,
      'Registered At': formatDate(reg.createdAt),
    }));
    const regsSheet = XLSX.utils.json_to_sheet(regsData);
    XLSX.utils.book_append_sheet(workbook, regsSheet, 'Registrations');
  }

  // Club Applications Sheet
  if (data.clubs.length > 0) {
    const clubsData = data.clubs.map(app => ({
      'Full Name': app.fullName,
      'Email': app.email,
      'Club': app.clubName,
      'Department': app.department,
      'Year': app.year,
      'Status': app.status,
      'Applied At': formatDate(app.createdAt),
    }));
    const clubsSheet = XLSX.utils.json_to_sheet(clubsData);
    XLSX.utils.book_append_sheet(workbook, clubsSheet, 'Club Applications');
  }

  const fileName = `Department_Data_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};