import React, { useState } from 'react';

interface FormProps {
    addJob: (name: string, executor: string) => void;
}

const Form: React.FC<FormProps> = props => {

    const [name, setName] = useState("");
    const [executor, setExecutor] = useState("docker");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        props.addJob(name, executor)
        setName("");
    } 

    return (
            <div>
                <form className='pt-20 text-green-300 font-mono' onSubmit={handleSubmit}>
                <div>
                    <label className= "mt-4 font-bold">Job Name</label>
                    <input className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    type="text"
 
                    value={name}
                    onChange={e => setName(e.target.value)}></input>
                </div>

                <div>
                    <label className= "mt-4 font-bold">Executor</label>
                    <select name="Executor" onChange={e => setExecutor(e.target.value)} value={executor} className="mt-4 bg-green-600 shadow text-white ml-4 font-bold py-1 px-1 rounded">
                        {/* <option value="" className="">- select</option> */}
                        <option value="docker" className="">docker</option>
                        <option value="machine" className="">machine</option>
                        <option value="macos" className="">macos</option>
                        <option value="windows" className="">windows</option>
                    </select>
                </div>   
                
                {/* <div>
                    <label className="mt-4 font-bold">Resource Class: </label>
                    <select name="resource_class" className="mt-4 bg-green-600 shadow text-white ml-4 font-bold py-1 px-1 rounded">
                        <option value="" className="">- select</option>
                        <option value="default" className="">default</option>
                        <option value="large" className="">large</option>
                        <option value="xlarge" className="">xlarge</option>
                    </select>
                </div> */}

                <div>
                    <input className="mt-4 bg-green-600 shadow text-white ml-4 font-bold py-1 px-1 rounded" type="submit" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default Form;