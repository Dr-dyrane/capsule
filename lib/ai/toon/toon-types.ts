export type ToonTemplateId =
  | 'comparison-board'
  | 'timeline'
  | 'cascade'
  | 'risk-map'
  | 'protocol-board'
  | 'mechanism-board'

export type ToonRouteLevel = 'level-1' | 'level-2' | 'level-3'

export type ToonTemplateDefinition = {
  id: ToonTemplateId
  label: string
  layoutGrammar: string
  elementGrammar: string[]
  textGrammar: string[]
  colorGrammar: string[]
  compositionGrammar: string[]
  localRules: string[]
}

