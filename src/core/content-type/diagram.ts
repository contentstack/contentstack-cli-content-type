import * as path from 'path'
import * as fs from 'fs'
import moment from 'moment'
const {graphviz} = require('node-graphviz')

enum DiagramNodeType {
    ContentType,
    GlobalFields
}

interface DiagramNode {
    uid: string;
    title: string;
    fields: any[];
}

interface DiagramNodeField {
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
  orientation: 'LR' | 'TD';
}

export async function createDiagram(options: CreateDiagramOptions): Promise<CreateDiagramResults> {
  const contentTypeNodes = createNodes(options.contentTypes)
  const globalFieldNodes = createNodes(options.globalFields)
  const now = moment().format('MMMM Do YYYY, h:mm:ss a')
  const graphLabel = `${options.stackName} | ${now}\n\n`

  const dotSource = createDotSource(graphLabel, contentTypeNodes, globalFieldNodes, options.style)

  const dotOutput = await graphviz.dot(dotSource, options.outputFileType)
  const outputPath = createOutputPath(options.outputFileName)

  fs.writeFileSync(outputPath, dotOutput)

  return {
    outputPath,
  }
}

const theme = {
  graph: {
    fontname: 'Helvetica',
    fontsize: '60',
    fontcolor: '#2a0f57',
  },

  node: {
    fontname: 'Helvetica',
    fontsize: '14',
    fontcolor: '#555555',
  },

  edge: {
    fontname: 'Helvetica',
    fontsize: '14',
    color: '#2a0f57',
  },

  table: {
    heading: {
      bgcolor: '#7c4dff',
      color: '#bab7c7',
      label: {
        color: 'white',
      },
    },
    row: {
      bgcolor: '#f7f7f7',
    },
  },

  entities: {
    hasOption: '&#x2713;',
    spacer: '&mdash;',
  },
}

function createNodes(contentTypes: any[]) {
  const result = [] as DiagramNode[]

  for (const contentType of contentTypes) {
    result.push({
      uid: contentType.uid,
      title: contentType.title,
      fields: createNodeFields(contentType),
    })
  }

  return result
}

function createNodeFields(contentType: any) {
  const result = [] as DiagramNodeField[]

  for (const field of contentType.schema) {
    const diagramField = {
      uid: field.uid,
      title: field.display_name,
      type: field.data_type,
      path: null,
      fields: [],
      references: [],
      multiple: field.multiple,
      mandatory: field.mandatory,
      unique: field.unique,
    } as DiagramNodeField

    if (field.data_type === 'reference') {
      diagramField.references = field.reference_to
    } else if (field.data_type === 'global_field') {
      diagramField.references = [field.reference_to]
    }

    if (field.schema) {
      diagramField.fields = createNodeFields(field)
    } else if (field.blocks) {
      for (const block of field.blocks) {
        const diagramBlockField = {
          uid: block.uid,
          title: block.title,
          type: null,
          path: null,
          fields: [],
          references: [],
          multiple: block.multiple,
          mandatory: block.mandatory,
          unique: block.unique,
        } as DiagramNodeField

        if (block.schema) {
          diagramBlockField.fields = createNodeFields(block)
        } else {
          diagramBlockField.type = 'global_field'
          diagramBlockField.references = [block.reference_to]
        }

        diagramField.fields.push(diagramBlockField)
      }
    }

    result.push(diagramField)
  }

  return result
}

function createDotSource(graphLabel: string, contentTypeNodes: DiagramNode[], globalFieldNodes: DiagramNode[], style: DiagramStyleOptions) {
  const result = `
        digraph content_model {
            label="${graphLabel}"
            labelloc="t"
            splines="true"
            clusterrank="global"
            rankdir="${style.orientation}"

            graph [
                fontname="${theme.graph.fontname}", 
                fontsize="${theme.graph.fontsize}", 
                fontcolor="${theme.graph.fontcolor}",
                pad="3", 
                nodesep="1.5", 
                ranksep="1.5", 
                outputorder="edgesfirst"
            ]

            node [
                fontname="${theme.node.fontname}",
                fontsize="${theme.node.fontsize}",
                fontcolor="${theme.node.fontcolor}",
                shape="plaintext"
            ]

            edge [
                fontname="${theme.edge.fontname}",
                fontsize="${theme.edge.fontsize}",
                color="${theme.edge.color}",
                penwidth="1"
            ]

            ${createDotNodes(globalFieldNodes, DiagramNodeType.GlobalFields)}
            ${createDotNodes(contentTypeNodes, DiagramNodeType.ContentType)}
            
            ${createDotEdges(globalFieldNodes)}
            ${createDotEdges(contentTypeNodes)}
        }
    `

  return result
}

function createDotNodes(nodes: DiagramNode[], type: DiagramNodeType) {
  return nodes.map((node, _) => {
    return createDotTable(node, type)
  }).join('\n')
}

function createDotTable(node: DiagramNode, type: DiagramNodeType) {
  const nodeLabel = type === DiagramNodeType.GlobalFields ? 'Global Field' : 'Content Type'

  return `
        ${node.uid} [label=<
            <table color="${theme.table.heading.color}" border="0" cellborder="1" cellspacing="1" cellpadding="4">
                <tr>
                    <td cellspacing="0" colspan="6" align="center" color="${theme.table.heading.color}" bgcolor="${theme.table.heading.bgcolor}">
                        <font color="${theme.table.heading.label.color}"><b>${node.title}</b></font>
                    </td>
                </tr>

                <tr>
                  <td cellspacing="0" colspan="6" align="center" bgcolor="${theme.table.row.bgcolor}">
                    ${nodeLabel}
                  </td>
                </tr>

                <tr>
                    <td align="left"><b>Display Name</b></td>
                    <td align="left"><b>Type</b></td>
                    <td align="left"><b>References</b></td>
                    <td><b>Multiple</b></td>
                    <td><b>Mandatory</b></td>
                    <td><b>Unique</b></td>
                </tr>

                ${createDotTableRows(node)}
            </table>
        >];
    `
}

function createDotTableRows(node: DiagramNode) {
  const fields = flattenFields(node.fields)

  return fields.map((field: any, _: any) => {
    return `<tr>
                    <td bgcolor="${theme.table.row.bgcolor}" align="left" port="${field.path}">${field.title}</td>
                    <td bgcolor="${theme.table.row.bgcolor}" align="left">${field.type === null ? 'block' : field.type}</td>
                    <td bgcolor="${theme.table.row.bgcolor}" align="left">${field.references.join(', ')}</td>
                    <td bgcolor="${theme.table.row.bgcolor}" align="center">${field.multiple ? theme.entities.hasOption : ''}</td>
                    <td bgcolor="${theme.table.row.bgcolor}" align="center">${field.mandatory ? theme.entities.hasOption : ''}</td>
                    <td bgcolor="${theme.table.row.bgcolor}" align="center">${field.unique ? theme.entities.hasOption : ''}</td>
                </tr>`
  }).join('\n')
}

function createDotEdges(nodes: DiagramNode[]) {
  return nodes.map((node, _) => {
    return createDotEdgeRows(node)
  }).join('\n')
}

function createDotEdgeRows(node: DiagramNode) {
  const result = []
  const fields = flattenFields(node.fields)

  for (const field of fields) {
    if (field.type === 'reference') {
      for (const reference of field.references) {
        result.push(`${node.uid}:${field.path} -> ${reference}:${reference}`)
      }
    } else if (field.type === 'global_field') {
      result.push(`${node.uid}:${field.path} -> ${field.references[0]}`)
    }
  }

  return result.join('\n')
}

function createFieldDescriptor(field: DiagramNodeField, depth = 0, prefix = '') {
  const spacer = theme.entities.spacer.repeat(depth === 0 ? 0 : depth * 2)
  const title = `${prefix ? spacer : ''}${field.title}`
  const path = `${prefix ? prefix + '_' : ''}${field.uid}`.replace(/\./g, '_')

  return {
    uid: field.uid,
    title: title,
    type: field.type,
    path: path,
    references: field.references,
    multiple: field.multiple,
    mandatory: field.mandatory,
    unique: field.unique,
  } as DiagramNodeField
}

function flattenFields(fields: DiagramNodeField[], depth = 0, prefix = '') {
  const rows = [] as DiagramNodeField[]

  for (const field of fields) {
    rows.push(createFieldDescriptor(field, depth, prefix))

    if (field.fields) {
      rows.push(...flattenFields(field.fields, depth + 1, (prefix ? prefix + '.' : '') + field.uid))
    }
  }

  return rows
}

function createOutputPath(outputFile: string) {
  const outputPath = path.resolve(process.cwd(), outputFile)
  const dirName = path.dirname(outputPath)

  fs.mkdirSync(dirName, {recursive: true})

  return outputPath
}
