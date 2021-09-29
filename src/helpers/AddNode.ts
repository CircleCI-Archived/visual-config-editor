export type ElementId = string;

export interface XYPosition {
    x: number;
    y: number;
}

export enum Position {
    Left = 'left',
    Top = 'top',
    Right = 'right',
    Bottom = 'bottom',
}

export interface AddNode {
    id: string;
    key?: any;
    position: {
        x: number;
        y: number;
    }
    type?: string;
    data?: {
        label: string;
    }
    className?: string;
    targetPosition?: string;
    sourcePosition?: string;
}