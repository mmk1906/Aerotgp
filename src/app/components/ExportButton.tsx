import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { exportToExcel, exportToCSV } from '../services/exportService';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  fileName: string;
  formatFunction?: (data: any[]) => any[];
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

/**
 * Reusable Export Button Component
 * Allows exporting data to Excel or CSV with a dropdown menu
 */
export function ExportButton({
  data,
  fileName,
  formatFunction,
  disabled = false,
  variant = 'outline',
  size = 'default',
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'csv') => {
    if (data.length === 0) {
      toast.warning('No data available to export');
      return;
    }

    setIsExporting(true);
    try {
      const formattedData = formatFunction ? formatFunction(data) : data;
      const fileNameWithDate = `${fileName}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'excel') {
        exportToExcel(formattedData, fileNameWithDate);
      } else {
        exportToCSV(formattedData, fileNameWithDate);
      }

      toast.success(
        `Successfully exported ${data.length} records to ${format.toUpperCase()}`
      );
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(`Failed to export: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || isExporting || data.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem
          onClick={() => handleExport('excel')}
          className="cursor-pointer hover:bg-slate-700"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as Excel (.xlsx)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className="cursor-pointer hover:bg-slate-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
