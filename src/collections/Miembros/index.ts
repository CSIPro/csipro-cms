import { CollectionConfig } from 'payload/types'

export const Miembros: CollectionConfig = {
  slug: 'miembros',
  admin: {
    useAsTitle: "nombres",
  },
  fields: [
    {
      name: 'nombres',
      label: 'Nombres',
      type: 'text',
      required: true,
    },
    {
      name: 'apellidos',
      label: 'Apellidos',
      type: 'text',
      required: true,
      
    },
    {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
    },
    
    {
        name: 'redes', // required
        type: 'array', // required
        label: 'Redes Sociales',
        labels: {
            singular: 'Red Social',
            plural: 'Redes Sociales',
        },
        fields: [
            // required
            {
                name: 'nombre',
                label: 'Nombre de Red Social',
                type: 'text',
            },
            
            {
                name: 'link',
                label: 'Link a Red Social',
                type: 'text',
            },
            
        ],
    },
    
    
  ],
}
