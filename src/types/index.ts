export type BuildOutput = {
  header: string | null;
  body: string;
  footer: string | null;
  rows: string[][];
  hasResults: boolean;
};

export interface DiagramNode {
  uid: string;
  title: string;
  fields: DiagramNodeField[];
}

export interface DiagramNodeField {
  uid: string;
  title: string;
  path: string | null;
  type: string | null;
  fields: DiagramNodeField[];
  references: string[];
  multiple: boolean;
  mandatory: boolean;
  unique: boolean;
}

export interface CreateDiagramOptions {
  stackName: string;
  contentTypes: any[];
  globalFields: any[];
  outputFileName: string;
  outputFileType: string;
  style: DiagramStyleOptions;
}

export interface CreateDiagramResults {
  outputPath: string;
}

export interface DiagramStyleOptions {
  orientation: DiagramOrientation;
}

export enum DiagramNodeType {
  ContentType,
  GlobalFields
}

export interface Stack {
  uid: string;
  name: string;
  master_locale: string;
  api_key: string;
  org_uid: string;
}

export type Format = 'svg' | 'dot' | 'json' | 'dot_json' | 'xdot_json';

export enum DiagramOrientation {
  Portrait = 'LR',
  Landscape = 'TD'
}
