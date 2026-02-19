import { User, UserRole, OvertimeEntry } from '../types';

// Extended type for internal mock database to include PIN
type DbUser = User & { pin: string };

// Simulating SQL Database state with PINs
let USERS: DbUser[] = [
  {
    id: '1',
    username: 'admin',
    fullName: 'System Administrator',
    role: UserRole.ADMIN,
    phoneNumber: '+15550001',
    avatar: 'https://picsum.photos/id/1/200/200',
    pin: '1234' // Default PIN
  },
  {
    id: '2',
    username: 'jdoe',
    fullName: 'John Doe',
    role: UserRole.USER,
    phoneNumber: '+15550002',
    avatar: 'https://picsum.photos/id/1012/200/200',
    pin: '1234' // Default PIN
  },
  {
    id: '3',
    username: 'sarah',
    fullName: 'Sarah Smith',
    role: UserRole.USER,
    phoneNumber: '+15550003',
    avatar: 'https://picsum.photos/id/1011/200/200',
    pin: '1234'
  },
  {
    id: '4',
    username: 'mike',
    fullName: 'Mike Johnson',
    role: UserRole.USER,
    phoneNumber: '+15550004',
    avatar: 'https://picsum.photos/id/1005/200/200',
    pin: '1234'
  },
  {
    id: '5',
    username: 'emily',
    fullName: 'Emily Chen',
    role: UserRole.USER,
    phoneNumber: '+15550005',
    avatar: 'https://picsum.photos/id/1027/200/200',
    pin: '1234'
  }
];

// Helper to generate dates for the current year
const currentYear = new Date().getFullYear();
const prevYear = currentYear - 1;

let ENTRIES: OvertimeEntry[] = [
  // --- History for John Doe (User ID: 2) ---
  
  // Previous Year
  {
    id: '101',
    userId: '2',
    date: `${prevYear}-12-25`,
    clockIn: '09:00',
    clockOut: '14:00',
    durationHours: 5,
    taskDescription: 'Christmas Day: Emergency server maintenance and health checks.',
    status: 'APPROVED'
  },
  {
    id: '102',
    userId: '2',
    date: `${prevYear}-12-26`,
    clockIn: '10:00',
    clockOut: '15:00',
    durationHours: 5,
    taskDescription: 'Boxing Day: Post-deployment monitoring for retail client.',
    status: 'APPROVED'
  },

  // Current Year - Jan
  {
    id: '103',
    userId: '2',
    date: `${currentYear}-01-01`,
    clockIn: '10:00',
    clockOut: '16:00',
    durationHours: 6,
    taskDescription: 'New Year Day: Year-end data migration and backup validation.',
    status: 'APPROVED'
  },
  {
    id: '104',
    userId: '2',
    date: `${currentYear}-01-26`,
    clockIn: '08:00',
    clockOut: '12:00',
    durationHours: 4,
    taskDescription: 'Australia Day: Urgent client support ticket #4421 regarding login issues.',
    status: 'APPROVED'
  },

  // Current Year - March (Easter)
  {
    id: '105',
    userId: '2',
    date: `${currentYear}-03-29`,
    clockIn: '09:00',
    clockOut: '17:00',
    durationHours: 8,
    taskDescription: 'Good Friday: Full system overhaul and database indexing.',
    status: 'APPROVED'
  },
  {
    id: '106',
    userId: '2',
    date: `${currentYear}-03-31`,
    clockIn: '13:00',
    clockOut: '17:00',
    durationHours: 4,
    taskDescription: 'Easter Sunday: Monitoring high traffic volume.',
    status: 'APPROVED'
  },
  
  // Current Year - April (Anzac Day)
  {
    id: '107',
    userId: '2',
    date: `${currentYear}-04-25`,
    clockIn: '06:00',
    clockOut: '11:00',
    durationHours: 5,
    taskDescription: 'Anzac Day: Early morning deployment of security patches.',
    status: 'APPROVED'
  },

  // Current Year - May
  {
    id: '108',
    userId: '2',
    date: `${currentYear}-05-06`,
    clockIn: '09:00',
    clockOut: '15:00',
    durationHours: 6,
    taskDescription: 'Labor Day: Configuring new firewall rules for branch offices.',
    status: 'APPROVED'
  },

  // Current Year - June
  {
    id: '109',
    userId: '2',
    date: `${currentYear}-06-10`,
    clockIn: '08:00',
    clockOut: '16:00',
    durationHours: 8,
    taskDescription: 'King\'s Birthday: Major infrastructure upgrade and load testing.',
    status: 'APPROVED'
  },

  // Current Year - August
  {
    id: '110',
    userId: '2',
    date: `${currentYear}-08-05`,
    clockIn: '10:00',
    clockOut: '14:00',
    durationHours: 4,
    taskDescription: 'Bank Holiday: Assisting finance team with quarterly reporting generation.',
    status: 'APPROVED'
  },

  // Current Year - October
  {
    id: '111',
    userId: '2',
    date: `${currentYear}-10-07`,
    clockIn: '09:00',
    clockOut: '18:00',
    durationHours: 9,
    taskDescription: 'Labour Day: Resolving critical production outage (Incident #9902).',
    status: 'APPROVED'
  },

  // Current Year - Recent/Today (Dynamic)
  {
    id: '112',
    userId: '2',
    date: new Date().toISOString().split('T')[0],
    clockIn: '08:00',
    clockOut: '13:00',
    durationHours: 5,
    taskDescription: 'Today: Urgent bug fix for mobile application crash.',
    status: 'APPROVED'
  },

  // --- Seed Data for Other Users (for Admin Chart) ---
  {
    id: '201',
    userId: '3', // Sarah
    date: `${currentYear}-01-01`,
    clockIn: '08:00',
    clockOut: '12:00',
    durationHours: 4,
    taskDescription: 'New Year Support',
    status: 'APPROVED'
  },
  {
    id: '202',
    userId: '3', // Sarah
    date: `${currentYear}-04-25`,
    clockIn: '08:00',
    clockOut: '18:00',
    durationHours: 10,
    taskDescription: 'Anzac Day Audit',
    status: 'APPROVED'
  },
  {
    id: '301',
    userId: '4', // Mike
    date: `${currentYear}-06-10`,
    clockIn: '09:00',
    clockOut: '19:00',
    durationHours: 10,
    taskDescription: 'KB Birthday Migration',
    status: 'APPROVED'
  },
  {
    id: '302',
    userId: '4', // Mike
    date: `${currentYear}-10-07`,
    clockIn: '09:00',
    clockOut: '15:00',
    durationHours: 6,
    taskDescription: 'Labour Day Infra Check',
    status: 'APPROVED'
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
  // Simulates: POST /auth/login
  async login(username: string, pin: string): Promise<{ success: boolean; user?: User; message?: string }> {
    await delay(800);
    
    const user = USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.pin === pin) {
      // Return user without the PIN property for security simulation
      const { pin: _pin, ...safeUser } = user;
      return { success: true, user: safeUser };
    }

    return { success: false, message: 'Invalid PIN' };
  },

  // Simulates: GET /entries
  async getEntries(userId: string): Promise<OvertimeEntry[]> {
    await delay(500);
    return ENTRIES.filter(e => e.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Simulates: GET /all-entries (Admin only)
  async getAllEntries(): Promise<OvertimeEntry[]> {
    await delay(500);
    return [...ENTRIES].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // Simulates: POST /entries
  async addEntry(entry: Omit<OvertimeEntry, 'id' | 'status'>): Promise<OvertimeEntry> {
    await delay(800);
    const newEntry: OvertimeEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      status: 'APPROVED' // Auto-approved as per requirement to erase approval
    };
    ENTRIES = [newEntry, ...ENTRIES];
    return newEntry;
  },

  // Simulates: PUT /users/:id (User Profile Update)
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    await delay(800);
    USERS = USERS.map(u => (u.id === userId ? { ...u, ...data } : u));
    const updatedUser = USERS.find(u => u.id === userId)!;
    const { pin: _pin, ...safeUser } = updatedUser;
    return safeUser;
  },

  // --- Admin Methods ---

  async getUsers(): Promise<User[]> {
    await delay(500);
    return USERS.map(({ pin, ...u }) => u);
  },

  async adminAddUser(userData: Omit<User, 'id'> & { pin: string }): Promise<User> {
    await delay(800);
    const newUser: DbUser = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      avatar: `https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`
    };
    USERS = [...USERS, newUser];
    const { pin: _pin, ...safeUser } = newUser;
    return safeUser;
  },

  async adminUpdateUser(id: string, userData: Partial<User> & { pin?: string }): Promise<User> {
    await delay(800);
    USERS = USERS.map(u => u.id === id ? { ...u, ...userData } : u);
    const updated = USERS.find(u => u.id === id)!;
    const { pin: _pin, ...safeUser } = updated;
    return safeUser;
  },

  async deleteUser(id: string): Promise<void> {
    await delay(500);
    USERS = USERS.filter(u => u.id !== id);
    // Also clean up entries for this user
    ENTRIES = ENTRIES.filter(e => e.userId !== id);
  }
};
