import * as yup from 'yup'

export const formSchema = [
    yup.object({
        nameProjekt: yup.string().required('This field is required'),
        beginnProjekt: yup.string().required('This field is required'),
        endeProjekt: yup.string().required('This field is required'),
    })
    ,
    yup.object({
        verantwortlicher: yup.string().required('This field is required'),
        bearbeitungsZweck: yup.string().required('This field is required'),        
    })
    ,
    yup.object({
    })
    ,
    yup.object({
        identifizierungBetroffenheit: yup.string().required('This field is required'),
    })
    ,
    yup.object({})
]