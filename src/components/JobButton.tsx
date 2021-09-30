import React from 'react';

interface ButtonProps {
    enableJobForm: () => void;
}

const JobButton: React.FC<ButtonProps> = props => {

    const handleClick = (event: React.FormEvent) => {
        props.enableJobForm()
    } 

    return (
        <div style={{width: '100%', height: '100%'}} className="flex items-center justify-center bg-gray-900 text-white">
          <button className="bg-green-600 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>Add Job</button>
        </div>
    )
}

export default JobButton;