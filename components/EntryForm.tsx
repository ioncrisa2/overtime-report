import React, { useState, useEffect } from 'react';
import { OvertimeEntry } from '../types';
import { mockService } from '../services/mockService';
import { CalendarClock, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface EntryFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ userId, onSuccess, onCancel }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clockIn, setClockIn] = useState('09:00');
  const [clockOut, setClockOut] = useState('17:00');
  const [taskDescription, setTaskDescription] = useState('');
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Calculate duration
    const start = new Date(`1970-01-01T${clockIn}:00`);
    const end = new Date(`1970-01-01T${clockOut}:00`);
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    // Handle overnight shift roughly
    if (diff < 0) diff += 24;
    
    setDuration(parseFloat(diff.toFixed(2)));
  }, [clockIn, clockOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (duration <= 0) {
      alert("Invalid time range");
      return;
    }

    setLoading(true);
    try {
      await mockService.addEntry({
        userId,
        date,
        clockIn,
        clockOut,
        durationHours: duration,
        taskDescription
      });
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold tracking-tight">Record Overtime</h2>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>New Entry</CardTitle>
            <CardDescription>Log your holiday working hours for approval.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
                <Label>Holiday Date</Label>
                <Input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                <Label>Clock In</Label>
                <Input
                    type="time"
                    required
                    value={clockIn}
                    onChange={e => setClockIn(e.target.value)}
                />
                </div>
                <div className="space-y-2">
                <Label>Clock Out</Label>
                <Input
                    type="time"
                    required
                    value={clockOut}
                    onChange={e => setClockOut(e.target.value)}
                />
                </div>
            </div>

            <div className="bg-muted p-4 rounded-md flex items-center gap-3 text-sm font-medium">
                <CalendarClock size={20} className="text-primary" />
                Calculated Duration: <span className="font-bold">{duration} Hours</span>
            </div>

            <div className="space-y-2">
                <Label>Task Description</Label>
                <textarea
                required
                rows={4}
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Detail the work done during this public holiday..."
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Entry'}
                {!loading && <Save className="ml-2 h-4 w-4" />}
                </Button>
            </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
};
