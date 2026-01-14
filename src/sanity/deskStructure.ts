import { StructureBuilder } from 'sanity/structure'

// Singleton document types
const singletonTypes = new Set([
  'siteSettings',
  'homepageSettings',
  'aboutPage',
  'policiesPage',
  'bookPage',
  'footerSettings',
])

// Helper to create singleton items
const singletonItem = (S: StructureBuilder, typeName: string, title: string) =>
  S.listItem()
    .title(title)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName))

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singletons at top
      singletonItem(S, 'siteSettings', 'Site Settings'),
      singletonItem(S, 'homepageSettings', 'Homepage'),
      singletonItem(S, 'aboutPage', 'About Page'),
      singletonItem(S, 'policiesPage', 'Policies Page'),
      singletonItem(S, 'bookPage', 'Book Page'),
      singletonItem(S, 'footerSettings', 'Footer'),

      S.divider(),

      // Collections
      S.listItem()
        .title('Services')
        .schemaType('service')
        .child(S.documentTypeList('service').title('Services')),
    ])
