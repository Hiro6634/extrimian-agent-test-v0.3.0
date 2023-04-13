import {
    Agent,
    AgentModenaUniversalRegistry,
    AgentModenaUniversalResolver,
    WACIProtocol
} from '@extrimian/agent';

import { FileSystemStorage } from './filesystem-storage';
import { FileSystemAgentSecureStorage } from './filesystem-agent-secure-storage';
import { FileSystemVcStorage } from './filesystem-vc-storage';

export class AgentMessagingTest {
    private dwnUrl: string = "http://ssi.gcba-extrimian.com:1337";
    private agent: Agent;


    public constructor(){
        const waciProtocol = new WACIProtocol();

        this.agent = new Agent({
            didDocumentRegistry: new AgentModenaUniversalRegistry("http://modena.gcba-extrimian.com:8080"),
            didDocumentResolver: new AgentModenaUniversalResolver("http://modena.gcba-extrimian.com:8080"),
            agentStorage: new FileSystemStorage({
                filepath: "./src/data/agent-issuer-storage.json"
            }),
            secureStorage: new FileSystemAgentSecureStorage({
                filepath: "./src/data/agent-issuer-secure-storage.json"
            }),
            vcProtocols: [waciProtocol],
            vcStorage: new FileSystemVcStorage({
                filepath: "./src/data/agent-issuer-vc-storage.json"
            }),
        });
    }
    
    public exec = async () => {
    
    
        await this.agent.initialize();
    
        await this.agent.identity.createNewDID({
            dwnUrl: this.dwnUrl
        });
    
        const createDIDResult =async () => new Promise<void>((resolve, reject)=>{
            this.agent.identity.didCreated.on(async args => {
                resolve();
            });
        });
    
        await createDIDResult();
    }
}    


