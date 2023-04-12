import { IAgentStorage } from "@extrimian/agent";

export class MemoryStorage implements IAgentStorage {
    map = new Map<string, any>();

    async add(key: string, data: any): Promise<void> {
        this.map.set(key, data);
    }
    async get<T = any>(key: string): Promise<T> {
        return this.get(key);
    }
    async getAll(): Promise<Map<string, any>> {
        return this.map;
    }
    async update(key: string, data: any) {
        this.map.set(key, data);
    }
    async remove(key: string) {
        this.map.delete(key);
    }
    
}