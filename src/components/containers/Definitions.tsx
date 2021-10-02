
import Collapsible from 'react-collapsible';
import { ReactElement } from 'react-redux/node_modules/@types/react';

export interface DefintionsProps {
    defintionTitle: string;
    icon?: ReactElement<any> | undefined
    addNewPlaceholder: string;
    items: Array<string>;
}

const Defintions = (props: DefintionsProps) => {
    return (
        <div className="mb-6">
            <Collapsible triggerClassName="text-gray-100 text-2xl p-2 inline-flex bg-circle-gray-700 duration:50 transition-all w-full rounded-lg"
                triggerOpenedClassName="inline-flex text-2xl p-2 text-gray-100 bg-circle-green w-full transition rounded-t-lg" transitionTime={50} trigger={
                    <div className="inline-flex">
                        {props.icon}
                        <p className="">
                            {props.defintionTitle}
                        </p>
                    </div>
                }
            >
                <div className="w-full p-2 bg-circle-gray-200">
                    {
                        props.items.map((item) =>
                            <div className="w-full">
                                {item}
                            </div>)
                    }
                </div>
                <div className="w-full flex-inline h-15 p-2 rounded-b-lg bg-circle-gray-200">
                    <input type="text" placeholder={props.addNewPlaceholder} className="rounded-l pl-3 pt-0.5 pb-0.5 bg-gray-300 w-4/5" />
                    <button className="w-1/5 rounded-r float-right text-white text-xl transition-colors hover:bg-circle-blue-light  bg-circle-blue">
                        +
                    </button>
                </div>
            </Collapsible>
        </div>
    );
};

export default Defintions;