import ReadEntry from './readEntry.interface';

export default interface BookRead {
  br_id: number;
  days_read: number;
  days_total: number;
  read_entry?: Array<ReadEntry>;
}