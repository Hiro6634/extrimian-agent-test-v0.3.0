import { AgentSecureStorage } from "@extrimian/agent";

export class MemorySecureStorage implements AgentSecureStorage{
    map = new Map<string, any>();

    async add(key: string, data: any): Promise<void> {
        this.map.set(key, data);
    }
    
    async get(key: string): Promise<any> {
        // return this.map.get(key);
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