import { 
    Agent, 
    WACIProtocol,
    AgentModenaUniversalRegistry, 
    AgentModenaUniversalResolver,
    WACICredentialOfferSucceded,
    DWNTransport, 
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

    const waciProtocol = new WACIProtocol({
        issuer: {
            issueCredentials: async( waciInvitationId: string, holderId: string) => {
                return new WACICredentialOfferSucceded({
                    credentials:[{
                        credential: {
                            "@context": [
                                "https://www.w3.org/2018/credentials/v1",
                                "https://www.w3.org/2018/credentials/examples/v1",
                                "https://w3id.org/security/bbs/v1"
                            ],
                            id: "http://example.edu/credentials/58473",
                            type: [
                                "VerifiableCredential",
                                "AlumniCredential"
                            ],
                            issuer: "did:quarkid:matic:EiDs1liYifwFEg9l7rxrpR48MH-7Z-M2E32R1vEYThQWsQ",
                            issuanceDate: new Date(),
                            credentialSubject: {
                                id: holderId,
                                givenName: "Jhon",
                                familyName: "Does"
                            }
                        },
                        outputDescriptor: {
                            id: "alumni_credential_output",
                            schema: "https://schema.org/EducationalOccupationalCredential",
                            display: {
                                title: {
                                    path: [
                                        "$.name",
                                        "$.vc.name"
                                    ],
                                    fallback: "Alumni Credential"
                                },
                                subtitle: {
                                    path: [
                                        "$.class",
                                        "$.vc.class"
                                    ],
                                    fallback: "Alumni"
                                },
                                description: {
                                    "text": "Credencial que permite validar que es alumno del establecimiento"
                                },
                            },
                            styles: {
                                background: {
                                    color: "#ff0000"
                                },
                                thumbnail: {
                                    uri: "https://dol.wa.com/logo.png",
                                    alt: "Universidad Nacional"
                                },
                                hero: {
                                    uri: "https://dol.wa.com/alumnos.png",
                                    alt: "Alumnos de la universidad"
                                },
                                text: {
                                    color: "#d4d400"
                                }
                            },
                        },
                    }],
                    issuer: {
                        name: "Universidad Nacional",
                        styles: {
                            thumbnail: {
                                uri: "https://dol.wa.com/logo.png",
                                alt: "Universidad Nacional"
                            },
                            hero: {
                                uri: "https://dol.wa.com/alumnos.png",
                                alt: "Alumnos de la universidad"
                            },
                            background: {
                                color: "#ff0000"
                            },
                            text: {
                                color: "#d4d400"
                            }
                        }
                    },
                    options: {
                        challenge: "508adef4-b8e0-4edf-a53d-a260371c1423",
                        domain: "9rf25a28rs96"
                    }
                });
            },
        },
        storage: new FileSystemStorage({filepath: "./src/data/agent-issuer-storage.json"})
    });
    
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
        vcProtocols: [waciProtocol],
        supportedTransports: [new DWNTransport()]
    });

    await agent.initialize();
    console.log("Agent Initialized");

    const  myDid = await agent.identity.createNewDID({
        dwnUrl: dwnUrl
    });

    console.log("myDid method:"+ myDid.getDidMethod());
    console.log("myDid:"+ myDid.value);
}

index().finally(()=>{
    console.log("Bye!");
    process.exit(1);
});
