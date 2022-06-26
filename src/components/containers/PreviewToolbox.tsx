import React from 'react'
import { useStoreActions, useStoreState } from '../../state/Hooks'
import Select from '../atoms/Select'
import CollapsibleList from './CollapsibleList'

export default function PreviewToolbox() {
    const toolbox = useStoreState((state) => state.previewToolbox)
    const updateToolbox = useStoreActions((actions) => actions.updatePreviewToolBox)


    const updateFilter = (key: 'type' | 'pattern', value: any) => {
        updateToolbox({ ...toolbox, filter: { ...toolbox.filter, [key]: value } });
    }

    return (
        <div className='absolute z-10 bg-white rounded m-2 p-4 shadow border border-circle-gray-300'>
            <CollapsibleList title="Preview Toolbox" >
                <div className='p-4'>
                    <CollapsibleList expanded title="Staged Job Filters" >
                        <div className='flex flex-row'>
                            <Select value={toolbox.filter.type}
                                onChange={(value: 'branches' | 'tags') => updateFilter('type', value)}
                                className='mt-2'>
                                <option value="branches">Branch</option>
                                <option value="tags">Tag</option>
                            </Select>
                            <input className='bg-white rounded p-2 ml-2 mt-2 shadow-sm border border-circle-gray-300' placeholder='^.*$' value={toolbox.filter.pattern}
                                onChange={(e) => {
                                    console.log(e.target.value)
                                    updateFilter('pattern', e.target.value)
                                }} />
                        </div>
                    </CollapsibleList>
                </div>
            </CollapsibleList>
        </div>
    )
}
