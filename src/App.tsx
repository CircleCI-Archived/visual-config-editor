import { useState } from 'react';
import { Workflow, Job } from './helpers/Workflow'
import { Position } from './helpers/Position';
import { AddNode } from './helpers/AddNode'
import SplitPane from 'react-split-pane';
import DefinitionsPane from './components/panes/DefinitionsPane'
import WorkflowsTabbed from './components/panes/WorkflowsTabbed';
let id = 1;
let key = 1;
const getKey = () => key++
const getId = () => `node_${id++}`

const App = () => {

  const [selector, setSelector] = useState(false);
  const [job, setJob] = useState('');
  const [elements, setElements] = useState<any>([]);
  const [executor, setExecutor] = useState('');

  const pushJob = (job: string) => {

    const newNode: AddNode = {
      id: getId(),
      key: getKey(),
      type: 'job',
      sourcePosition: 'right',
      targetPosition: 'left',
      className: 'dndnode',
      position: Position(elements),
      data: { label: `${job}` },
    };

    setElements((es: {}[]) => es.concat(newNode));
  }

  const enableJobForm = () => {
    setSelector(true);
    Workflow();
  }

  const addJob = (name: string, executor: string) => {
    setJob(name);
    setExecutor(executor);
    pushJob(name);
    Job(job, executor)
  }

  return (
    <div>
      <SplitPane split="vertical" defaultSize="75%" className="bg-circle-gray-700 z-10" resizerClassName="z-0 w-0.5 h-full transition duration-500  hover:bg-circle-blue-light cursor-ew-resize">
        <SplitPane split="horizontal" defaultSize="70%" minSize="20%"
          resizerClassName="h-0.5 cursor-ns-resize transition duration-500 hover:bg-circle-blue-light">

          <WorkflowsTabbed workflows={[{ jobs: [], name: "build-and-test" }]} />

          <div className='bg-circle-gray-900 w-full h-full border-r-2 border-circle-green-light'>

          </div>
        </SplitPane>

        <DefinitionsPane />
      </SplitPane >
    </div>
  );
}

export default App;
