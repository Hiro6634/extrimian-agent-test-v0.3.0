import { AgentMessagingTest } from "./agent-messaging";

const index = async () =>{
    const agentMessagingTest = new AgentMessagingTest();

    await agentMessagingTest.exec();

}

index();