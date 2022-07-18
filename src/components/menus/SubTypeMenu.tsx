import React, { useState } from 'react';
import { v4 } from 'uuid';
import { DefinitionSubscriptions } from '../../state/DefinitionStore';
import { NavigationComponent } from '../../state/Store';

export type SubTypeMenuProps<T> = {
  typePage: NavigationComponent;
  typeProps?: object;
  menuPage: (props: SubTypeMenuPageProps<T> & any) => JSX.Element;
  menuProps?: object;
  passThrough?: any;
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

const SubTypeMenu = <SubTypeRef,>(
  props: SubTypeMenuProps<SubTypeRef> & { nonce: string },
) => {
  const [subtype, setSubtype] = useState<
    Record<string, SelectedSubType<SubTypeRef>>
  >({});

  const current = subtype[props.nonce]?.current;

  const updateSubtype = (selected: SubTypeReference<SubTypeRef>) => {
    setSubtype({
      ...subtype,
      [props.nonce]: {
        current: selected,
        previous: current,
      },
    });
  };

  const navBack = () => {
    setSubtype({
      ...subtype,
      [props.nonce]: {
        current: undefined,
        previous: current,
      },
    });
  };

  const SubTypeSelectPage = props.typePage.Component as React.FunctionComponent<
    SubTypeSelectPageProps<SubTypeRef>
  >;
  const SubTypeMenuPage = props.menuPage;

  return (
    <div className="h-full flex flex-col">
      {current ? (
        <SubTypeMenuPage
          subtype={current}
          selectSubtype={navBack}
          {...props.menuProps}
        />
      ) : (
        <SubTypeSelectPage {...props.typeProps} setSubtype={updateSubtype} />
      )}
    </div>
  );
};

const SubTypeMenuNav: NavigationComponent = {
  Component: SubTypeMenu,
  Label: <SubTypeRef,>(props: SubTypeMenuProps<SubTypeRef>) =>
    props.typePage.Label(props),
  Icon: <SubTypeRef,>(props: SubTypeMenuProps<SubTypeRef>) =>
    props.typePage.Icon ? props.typePage.Icon(props) : null,
};

export const navSubTypeMenu = <SubTypeRef,>(
  props: SubTypeMenuProps<SubTypeRef>,
  values?: any,
  subscriptions?: DefinitionSubscriptions[],
) => {
  return {
    component: SubTypeMenuNav,
    props: { ...props, nonce: v4() },
    values,
    subscriptions,
  };
};
