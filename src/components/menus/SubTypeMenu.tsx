import { useState } from 'react';
import { DefinitionModel, NavigationComponent } from '../../state/Store';
/** TODO: ISubType interface for component mappings? */

export type SubTypeMenuProps<T> = {
  typePage: NavigationComponent;
  menuPage: React.FunctionComponent<SubTypeMenuPageProps<T>>;
  menuProps: unknown;
};
export type SubTypeReference<T> = T;
export type SubTypeSelectPageProps<T> = {
  setSubtype: (subtype: SubTypeReference<T>) => void;
};
export type SubTypeMenuPageProps<T> = {
  subtype: SubTypeReference<T>;
  selectSubtype: () => void;
};
export interface SelectedSubType<T> {
  current?: SubTypeReference<T>;
  previous?: SubTypeReference<T>;
}

const SubTypeMenu = <SubTypeRef,>(props: SubTypeMenuProps<SubTypeRef>) => {
  const [subtype, setSubtype] = useState<SelectedSubType<SubTypeRef>>();

  const updateSubtype = (selected: SubTypeReference<SubTypeRef>) => {
    setSubtype({ current: selected, previous: subtype?.current });
  };

  const navBack = () => {
    setSubtype({ current: undefined, previous: subtype?.current });
  };

  const SubTypeSelectPage = props.typePage.Component as React.FunctionComponent<
    SubTypeSelectPageProps<SubTypeRef>
  >;
  const SubTypeMenuPage = props.menuPage;

  return (
    <div className="h-full flex flex-col">
      {subtype?.current ? (
        <SubTypeMenuPage
          subtype={subtype.current}
          selectSubtype={navBack}
          {...props.menuProps}
        />
      ) : (
        <SubTypeSelectPage setSubtype={updateSubtype} />
      )}
    </div>
  );
};

const SubTypeMenuNav: NavigationComponent = {
  Component: SubTypeMenu,
  Label: <SubTypeRef, >(props: SubTypeMenuProps<SubTypeRef>) => props.typePage.Label(props),
  Icon: <SubTypeRef, >(props: SubTypeMenuProps<SubTypeRef>) =>
    props.typePage.Icon ? props.typePage.Icon(props) : null,
};

export default SubTypeMenuNav;
