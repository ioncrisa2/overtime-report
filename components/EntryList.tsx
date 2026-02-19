import React, { useState, useMemo } from 'react';
import { OvertimeEntry } from '../types';
import { Filter, FileText, Download, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface EntryListProps {
  entries: OvertimeEntry[];
  username: string;
  onBack?: () => void;
  title?: string;
  isAdminView?: boolean;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, username, onBack, title, isAdminView }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredEntries = useMemo(() => {
    return entries.filter(e => {
      if (startDate && new Date(e.date) < new Date(startDate)) return false;
      if (endDate && new Date(e.date) > new Date(endDate)) return false;
      return true;
    });
  }, [entries, startDate, endDate]);

  const totalHours = filteredEntries.reduce((acc, curr) => acc + curr.durationHours, 0);

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Title & Header
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('Overtime Report', 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text(`Employee: ${username}`, 14, 36);

    const periodText = (startDate || endDate) 
      ? `Period: ${startDate || 'Start'} to ${endDate || 'Now'}`
      : 'Period: All History';
    doc.text(periodText, 14, 42);

    // Table
    autoTable(doc, {
      startY: 50,
      head: [['Date', 'Time In', 'Time Out', 'Hours', 'Task Description']],
      body: filteredEntries.map(e => [
        e.date,
        e.clockIn,
        e.clockOut,
        e.durationHours,
        e.taskDescription
      ]),
      foot: [['', '', 'Total Hours:', totalHours, '']],
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // Slate 800
        textColor: 255,
        fontStyle: 'bold'
      },
      footStyles: {
        fillColor: [241, 245, 249],
        textColor: [15, 23, 42],
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
    });

    doc.save(`Overtime_Report_${username.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 space-y-0">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {title || 'Overtime History'}
            </CardTitle>
          </div>
          
          {!isAdminView && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 bg-secondary p-1 rounded-md">
                 <div className="px-2 text-muted-foreground"><Filter size={14} /></div>
                 <Input 
                   type="date" 
                   value={startDate}
                   onChange={e => setStartDate(e.target.value)}
                   className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 w-36 text-xs"
                 />
                 <span className="text-muted-foreground">-</span>
                 <Input 
                   type="date" 
                   value={endDate}
                   onChange={e => setEndDate(e.target.value)}
                   className="h-8 border-none bg-transparent shadow-none focus-visible:ring-0 w-36 text-xs"
                 />
              </div>

              <Button
                onClick={handleExportPDF}
                disabled={filteredEntries.length === 0}
                variant="outline"
                className="gap-2"
              >
                <Download size={16} />
                Export PDF
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Task</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.date}</TableCell>
                  <TableCell>{entry.clockIn} - {entry.clockOut}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.durationHours}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={entry.taskDescription}>
                    {entry.taskDescription}
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No entries found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {filteredEntries.length > 0 && (
              <tfoot>
                <tr className="border-t bg-muted/50 font-medium">
                  <td colSpan={2} className="p-4 text-right">Total Hours:</td>
                  <td className="p-4">{totalHours}</td>
                  <td colSpan={1}></td>
                </tr>
              </tfoot>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
