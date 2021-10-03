import { useStoreActions, useStoreState } from "../../state/Hooks";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import WorkflowPane from "./WorkflowPane";


const WorkflowsTabbed = () => {
    const workflows = useStoreState((state) => state.workflows);
    const addWorkflow = useStoreActions((actions) => actions.addWorkflow);

    return (<Tabs className="w-full h-full bg-white" >
        <TabList className="inline-flex pl-2 pt-2">
            {workflows?.map((workflow) =>
                <Tab key={workflow.id} className="bg-circle-gray-200 w-max rounded-t-lg p-2 mr-2 cursor-pointer">
                    <div className="flex flex-row h-5">
                        <svg className="w-8">
                            <path d="M13,12.0005 L13,14.5005 C13,15.8812153 14.1192847,17.0005 15.5,17.0005 C16.7716732,17.0005 17.8215783,16.0510253 17.9794794,14.8223119 C16.8252603,14.4045443 16,13.2985065 16,12.0005 C16,10.3434832 17.3434471,9.0005 19,9.0005 C20.6565529,9.0005 22,10.3434832 22,12.0005 C22,13.3107265 21.1591278,14.4253528 19.9878345,14.8339277 C19.8172144,17.1635097 17.8731367,19.0005 15.5,19.0005 C13.0147153,19.0005 11,16.9857847 11,14.5005 L11,12.0005 L11,9.4995 C11,8.11906389 9.88099443,7.0005 8.5,7.0005 C7.2278041,7.0005 6.17794274,7.94975945 6.020417,9.17853139 C7.17480406,9.5960731 8,10.7018409 8,12.0005 C8,13.6567847 6.65628475,15.0005 5,15.0005 C3.34371525,15.0005 2,13.6567847 2,12.0005 C2,10.6896797 2.84072326,9.57538027 4.01209968,9.16698275 C4.18228055,6.83714058 6.12646259,5.0005 8.5,5.0005 C10.9853872,5.0005 13,7.0143176 13,9.4995 L13,12.0005 Z M6,12.0005 C6,11.4482074 5.55213797,11.0005 5,11.0005 C4.44786203,11.0005 4,11.4482074 4,12.0005 C4,12.5522153 4.44828475,13.0005 5,13.0005 C5.55171525,13.0005 6,12.5522153 6,12.0005 Z M20,12.0005 C20,11.4482074 19.552138,11.0005 19,11.0005 C18.447862,11.0005 18,11.4482074 18,12.0005 C18,12.5522153 18.4482847,13.0005 19,13.0005 C19.5517153,13.0005 20,12.5522153 20,12.0005 Z"></path>
                        </svg>
                        <p className="text-lg">
                            {workflow.name}
                        </p>
                    </div>
                </Tab>
            )}
            <button className="bg-circle-blue transition-colors hover:bg-circle-blue-light text-white w-10 text-2xl rounded-t-lg p-1 mr-2 cursor-pointer"
                onClick={(e) => addWorkflow('new-workflow')}>
                +
            </button>
        </TabList>


        {workflows?.map((workflow) =>
            <TabPanel key={workflow.id} selectedClassName="h-full mr-4">
                <WorkflowPane items={workflow.jobNodes} bgClassName="bg-circle-gray-800" className="ml-2 border-2 border-b-0 border-circle-gray-400" />
            </TabPanel>
        )}
    </Tabs>)
}

export default WorkflowsTabbed;