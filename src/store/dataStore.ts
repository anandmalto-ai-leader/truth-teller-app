import { create } from 'zustand';
import { Document, SystemRecord } from '@/types';
import { initialDocuments, initialSystemRecords } from '@/data/mockData';

interface DataStore {
  documents: Document[];
  systemRecords: SystemRecord[];
  setDocuments: (docs: Document[]) => void;
  setSystemRecords: (records: SystemRecord[]) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  updateSystemRecord: (id: string, updates: Partial<SystemRecord>) => void;
  addDocument: (doc: Document) => void;
  addSystemRecord: (record: SystemRecord) => void;
  deleteDocument: (id: string) => void;
  deleteSystemRecord: (id: string) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  documents: initialDocuments,
  systemRecords: initialSystemRecords,
  
  setDocuments: (documents) => set({ documents }),
  setSystemRecords: (systemRecords) => set({ systemRecords }),
  
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    })),
    
  updateSystemRecord: (id, updates) =>
    set((state) => ({
      systemRecords: state.systemRecords.map((rec) =>
        rec.id === id ? { ...rec, ...updates } : rec
      ),
    })),
    
  addDocument: (doc) =>
    set((state) => ({ documents: [...state.documents, doc] })),
    
  addSystemRecord: (record) =>
    set((state) => ({ systemRecords: [...state.systemRecords, record] })),
    
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((doc) => doc.id !== id),
    })),
    
  deleteSystemRecord: (id) =>
    set((state) => ({
      systemRecords: state.systemRecords.filter((rec) => rec.id !== id),
    })),
}));
