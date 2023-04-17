import { 
    Agent,
    AgentModenaUniversalRegistry,
    AgentModenaUniversalResolver,
    CredentialFlow,
    WACIProtocol,
    DWNTransport,
    WACICredentialOfferSucceded,
    DID
} from "@extrimian/agent";

import {DIDDocument } from '@extrimian/did-core';

import { 
    FileSystemStorage,
    FileSystemAgentSecureStorage
} from "./file-system-storage";

class AgentSingleton{
    private static singleton: AgentSingleton;
    private agent: Agent;
    private initialized: boolean = false;
    private didMethod: string = "did:quarkid:matic";
    private constructor(){
        this.agent = new Agent({
            didDocumentRegistry: new AgentModenaUniversalRegistry("http://modena.gcba-extrimian.com:8080", this.didMethod),
            didDocumentResolver: new AgentModenaUniversalResolver("http://modena.gcba-extrimian.com:8080"),
            agentStorage: new FileSystemStorage({
                filepath: "./src/data/agent-issuer-storage.json"
            }),
            secureStorage: new FileSystemAgentSecureStorage({
                filepath: "./src/data/agent-issuer-secure-storage.json" 
            }),
            vcStorage: new FileSystemStorage({
                filepath: "./src/data/agent-issuer-vc-storage.json"
            }),
            vcProtocols: [this.getFullWaciProtocol()],
            supportedTransports: [new DWNTransport({
                dwnPollMilliseconds: 5000
            })]
        });
        console.log("Agent Created");

    }

    public static getInstance() : AgentSingleton {
        if(!AgentSingleton.singleton){
            AgentSingleton.singleton = new AgentSingleton();
        }
        return AgentSingleton.singleton;
    }

    private getEmptyWaciProtocol = () : WACIProtocol=> {
        return new WACIProtocol({
            storage: new FileSystemStorage({
                filepath: "./src/data/agent-issuer-vc-storage.json"
            })
        });
    }

    private getFullWaciProtocol = () : WACIProtocol => {
        return new WACIProtocol({
            issuer: {
                issueCredentials: async (_waciInvitationId: string, holderId: string) => {
                    return new WACICredentialOfferSucceded({
                        credentials: [{
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
                                issuer:  "did:quarkid:matic:EiDgdE9uFjI186lFpOLBwWibRqXeJOyxaJcYVtP3b2XeTQ",
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
                                }
                            }
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
                        },
                    });
                },
            },
            verifier: {
                presentationDefinition: async (invitationId: string) => {
                    return {
                        frame: {
                            "@context": [
                                "https://www.w3.org/2018/credentials/v1",
                                "https://www.w3.org/2018/credentials/examples/v1",
                                "https://w3id.org/security/bbs/v1"
                            ],
                            "type": [
                                "VerifiableCredential",
                                "AlumniCredential"
                            ],
                            "credentialSubject": {
                                "@explicit": true,
                                "type": [
                                    "AlumniCredential"
                                ],
                                "givenName": {},
                                "familyName": {}
                            }
                        },
                        inputDescriptors: [
                            {
                                id: "Alumni Credential",
                                name: "AlumniCredential",
                                constraints: {
                                    fields: [
                                        {
                                            path: [
                                                "$.credentialSubject.givenName"
                                            ],
                                            filter: {
                                                type: "string"
                                            }
                                        },
                                        {
                                            path: [
                                                "$.credentialSubject.familyName"
                                            ],
                                            filter: {
                                                type: "string"
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                    }
                }
            },
            storage: new FileSystemStorage({
                filepath: "./src/data/waciprotocol-storage.json"
            })
        });
    }
    public async getAgent(): Promise<Agent>{
        if( !this.initialized){
            await this.initialize();
        }
        return this.agent;
    }

    private  initialize = async () => {
        if( this.initialized ) return;
        await this.agent.initialize();
        console.log("Agent Initializated");
        this.initialized = true;
    }
}

const index = async () => {
    const dwnUrl = "http://ssi.gcba-extrimian.com:1337";


    const issuerAgent = await AgentSingleton.getInstance().getAgent();

    // Emision de VC
    try{
        const invitationMsg = await issuerAgent.vc.createInvitationMessage({
            flow: CredentialFlow.Issuance
        });
     
        console.log('invitationMessage:', invitationMsg);
    }
    catch( error ){
        console.log(error);
    }

    // const myDid: DID = await issuerAgent.identity.createNewDID({
    //     dwnUrl: dwnUrl
    // });
    // console.log("DID:  " + myDid.value);

    // try{
    //     const dids = await issuerAgent.identity.getDIDs();
    //     dids.map((async did=>{
    //         console.log("DID:" + did);
    //         console.log("DidMethod:"+DID.from(did).getDidMethod());
    //         console.log("Did:" + DID.from(did).value);
    //         const didDoc: DIDDocument  = await issuerAgent.resolver.resolve(DID.from(did));
    //         console.log("DidDocument:" + didDoc);
    //     }));
    // }
    // catch(error){
    //     console.error(error);
    // }

    //DID Resolver
    // try{
    //     const did = "did:quarkid:matic:EiDs1liYifwFEg9l7rxrpR48MH-7Z-M2E32R1vEYThQWsQ";
    //     console.log("DID:" + did);
    //     console.log("DidMethod:"+DID.from(did).getDidMethod());
    //     console.log("Did:" + DID.from(did).value);
    //     const didDoc: DIDDocument  = await issuerAgent.resolver.resolve(DID.from(did));
    //     console.log("DidDocument:" + didDoc);
    // }
    // catch(error){
    //     console.error(error);
    // }

}

index();
