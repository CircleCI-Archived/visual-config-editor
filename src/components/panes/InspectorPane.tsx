import { useStoreState } from "../../state/Hooks";

const InspectorPane = () => {
  const inspecting = useStoreState((state) => state.inspecting);
  // const inspect = useStoreActions((actions) => actions.inspect)

  if (inspecting && inspecting.dataType) {
    const Inspector = inspecting.dataType.components.inspector;

    return <div className="p-5">
      <Inspector  data={inspecting.data} />;
    </div>
  }
  return (<p className="text-circle-green-light font-semibold p-5">
    Select a defintion or node to view and edit properties
  </p>)
}

export default InspectorPane;