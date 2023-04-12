import { 
    Agent, 
    WACIProtocol,
    AgentModenaUniversalRegistry, 
    AgentModenaUniversalResolver
} from "@extrimian/agent";

import { MemorySecureStorage } from "./memory-secure-storage";
import { MemoryStorage } from "./memory-storage";
import { MemoryVcStorage } from "./memory-vc-storage";
import { FileSystemAgentSecureStorage } from './filesystem-agent-secure-storage'
import { FileSystemStorage } from './filesystem-storage';
import { FileSystemVcStorage } from "./filesystem-vc-storage";

const index = async () => {
    const dwnUrl = "http://ssi.gcba-extrimian.com:1337";
    let agent: Agent;

    //const waciProtocol = new WACIProtocol({});
    
    agent = new Agent({
        didDocumentRegistry: new AgentModenaUniversalRegistry("http://modena.gcba-extrimian.com:8080"),
        didDocumentResolver: new AgentModenaUniversalResolver("http://modena.gcba-extrimian.com:8080"),
        agentStorage: new FileSystemStorage({
            filepath: "./src/data/agent-issuer-storage.json"
        }),
        secureStorage: new FileSystemAgentSecureStorage({
            filepath: "./src/data/agent-issuer-secure-storage.json"
        }),
        vcStorage: new FileSystemVcStorage({
            filepath: "./src/data/agent-issuer-vc-storage.json"
        }),
        vcProtocols: [],
    });

    await agent.initialize();
    console.log("Agent Initialized");

    const  myDid = await agent.identity.createNewDID();

    console.log("myDid method:"+ myDid.getDidMethod());
    console.log("myDid:"+ myDid.value);
}

index().finally(()=>{
    console.log("Bye!");
    process.exit(1);
});
