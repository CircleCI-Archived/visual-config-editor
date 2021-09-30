import React, {useState} from 'react';
import Form from './components/Form';
import SplashText from './components/SplashText';
import Map from './components/Map';
import JobButton from './components/JobButton'
import { Workflow, Job } from './helpers/Workflow'
import { Position } from './helpers/Position';
import { InputType } from './helpers/InputType';
import { AddNode } from './helpers/AddNode'
import SplitPane from 'react-split-pane';
import './components/Split.css';

let id = 1;
let key = 1;
const getKey = () => key++
const getId = () => `node_${id++}`

const App: React.FC = () => {

  const [selector, setSelector] = useState(false);
  const [job, setJob] = useState('');
  const [elements, setElements] = useState<any>([]);
  const [executor, setExecutor] = useState('');

  const pushJob = (job: string) => {
  
    const newNode: AddNode = {
      id: getId(),
      key: getKey(),
      type: InputType(elements),
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
    <SplitPane split="vertical" defaultSize="40%">
      <div style={{width: '100%', height: '100%'}} className="bg-gray-900 px-32">
        {selector ? 
              (<Form addJob={addJob} />) 
              : 
              (<SplashText />)
        }
      </div>
      <SplitPane split="horizontal" defaultSize={400}>
        <JobButton enableJobForm={enableJobForm}/>
          <Map items={elements}/>
      </SplitPane>
    </SplitPane>
  );
}

export default App;
