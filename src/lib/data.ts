import type { User, Bin, Report } from './types';

export const initialUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin123', role: 'admin' },
  { id: '2', username: 'collector', password: 'collector123', role: 'collector', approved: true },
  { id: '3', username: 'citizen', password: 'citizen123', role: 'citizen', points: 120 },
  { id: '4', username: 'new_collector', password: 'password', role: 'collector', approved: false },
  { id: '5', username: 'top_citizen', password: 'password', role: 'citizen', points: 350 },
  { id: '6', username: 'another_citizen', password: 'password', role: 'citizen', points: 50 },
];

export const initialBins: Bin[] = [
  { id: 'b001', type: 'plastic', location: { lat: 25, lng: 20 }, fillLevel: 92, status: 'full' },
  { id: 'b002', type: 'paper', location: { lat: 30, lng: 75 }, fillLevel: 45, status: 'ok' },
  { id: 'b003', type: 'glass', location: { lat: 80, lng: 80 }, fillLevel: 100, status: 'broken', notes: [{ text: 'Glass shard on ground', date: new Date().toISOString() }] },
  { id: 'b004', type: 'organic', location: { lat: 75, lng: 25 }, fillLevel: 85, status: 'full' },
  { id: 'b005', type: 'plastic', location: { lat: 50, lng: 50 }, fillLevel: 20, status: 'ok' },
  { id: 'b006', type: 'paper', location: { lat: 10, lng: 90 }, fillLevel: 15, status: 'ok' },
  { id: 'b007', type: 'glass', location: { lat: 90, lng: 10 }, fillLevel: 60, status: 'ok' },
  { id: 'b008', type: 'organic', location: { lat: 40, lng: 60 }, fillLevel: 78, status: 'ok' },
  { id: 'b009', type: 'plastic', location: { lat: 60, lng: 40 }, fillLevel: 95, status: 'full' },
  { id: 'b010', type: 'paper', location: { lat: 15, lng: 15 }, fillLevel: 30, status: 'ok' },
  { id: 'b011', type: 'glass', location: { lat: 85, lng: 55 }, fillLevel: 70, status: 'ok' },
  { id: 'b012', type: 'organic', location: { lat: 5, lng: 50 }, fillLevel: 50, status: 'ok' },
  { id: 'b013', type: 'plastic', location: { lat: 45, lng: 85 }, fillLevel: 88, status: 'full' },
  { id: 'b014', type: 'paper', location: { lat: 65, lng: 10 }, fillLevel: 10, status: 'ok' },
  { id: 'b015', type: 'glass', location: { lat: 20, lng: 60 }, fillLevel: 40, status: 'ok' },
];

export const initialReports: Report[] = [
  { id: 'r01', binId: 'b003', userId: '3', type: 'broken', status: 'pending', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'r02', binId: 'b001', userId: '5', type: 'full', status: 'resolved', date: new Date(Date.now() - 2 * 86400000).toISOString() },
];
