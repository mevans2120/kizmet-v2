import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './src/sanity/schemaTypes'
import { deskStructure } from './src/sanity/deskStructure'

export default defineConfig({
  name: 'kizmet',
  title: 'Kizmet Massage & Wellness',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [structureTool({ structure: deskStructure })],
  schema: { types: schemaTypes },
})
