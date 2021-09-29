let CircleCI = require('@circleci/circleci-config-sdk');

export function Workflow() {
    const myConfig = new CircleCI.Config();
    // Create new Workflow
    const myWorkflow = new CircleCI.Workflow('myWorkflow');
    myConfig.addWorkflow(myWorkflow);
    const MyYamlConfig = myConfig.stringify();
    console.log(MyYamlConfig);
}

export function Job(name: string, executor: string) {
    console.log(`Job Name ${name}, executor: ${executor}`)
}