import { 
    Agent, 
    WACIProtocol,
    AgentModenaUniversalRegistry, 
    AgentModenaUniversalResolver
} from "@extrimian/agent";

import { MemorySecureStorage } from "./memory-secure-storage";
import { MemoryStorage } from "./memory-storage";
import { MemoryVcStorage } from "./memory-vc-storage";

const index = async () => {
    const dwnUrl = "http://ssi.gcba-extrimian.com:1337";
    let agent: Agent;

    // const waciProtocol = new WACIProtocol({});
    
    agent = new Agent({
        didDocumentRegistry: new AgentModenaUniversalRegistry("http://modena.gcba-extrimian.com:8080"),
        didDocumentResolver: new AgentModenaUniversalResolver("http://modena.gcba-extrimian.com:8080"),
        agentStorage: new MemoryStorage(),
        secureStorage: new MemorySecureStorage(),
        vcStorage: new MemoryVcStorage(),
        vcProtocols: [],
    });

    await agent.initialize();
    console.log("Agent Initialized");

    const  myDid = await agent.identity.createNewDID();

    console.log("myDid:"+ myDid.getDidMethod());
}

index();