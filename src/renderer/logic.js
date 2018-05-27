import fs from 'fs'

const MAIN_DIRECTORIES = {
  EXPERTS: 'Expertos',
  FAMILY: 'Familia',
  TRAINING: 'Formación',
  CONFERENCES: 'Conferencias'
}

// const PRES_DIRECTORIES = {
//   AUDIOS: 'Audios',
//   LYRICS: 'Letras',
//   SLIDES: 'PowerPoint',
//   VIDEOS: 'Vídeos'
// }

const result = {
  experts: [],
  family: [],
  training: [],
  conferences: []
}

const log = []

const readPresentation = ({ path, name, breadCrumb }) => {
  const files = fs.readdirSync(path)
  if (!files) {
    log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
    return []
  } else {
    return []
  }
}

const readDir = ({ path, name, breadCrumb, isContainer = true }) => {
  const files = fs.readdirSync(path)
  if (!files) {
    log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
    return []
  } else {
    if (isContainer) {
      return files.map(file => readDir({
        path: `${path}/${file}`,
        name: file,
        breadCrumb: [...breadCrumb, file],
        isContainer: false
      }))
    } else {
      return files.map(file => readPresentation({
        path: `${path}/${file}`,
        name: file,
        breadCrumb: [...breadCrumb, file]
      }))
    }
  }
}

const checkResult = () => {
  if (result.experts.length === 0) log.push(`No existe la carpeta '${MAIN_DIRECTORIES.EXPERTS}'`)
  if (result.family.length === 0) log.push(`No existe la carpeta '${MAIN_DIRECTORIES.FAMILY}'`)
  if (result.training.length === 0) log.push(`No existe la carpeta '${MAIN_DIRECTORIES.TRAINING}'`)
  if (result.conferences.length === 0) log.push(`No existe la carpeta '${MAIN_DIRECTORIES.CONFERENCES}'`)
}

const readRootDirectory = path => {
  const files = fs.readdirSync(path)
  if (!files) log.push('La carpeta raíz no tiene contenido')
  else {
    files.forEach(file => {
      const filePath = `${path}/${file}`
      const breadCrumb = [file]
      switch (file) {
        case MAIN_DIRECTORIES.EXPERTS:
          result.experts = readDir({ path: filePath, name: file, breadCrumb })
          break
        case MAIN_DIRECTORIES.FAMILY:
          result.family = readDir({ path: filePath, name: file, breadCrumb })
          break
        case MAIN_DIRECTORIES.TRAINING:
          result.training = readDir({ path: filePath, name: file, breadCrumb })
          break
        case MAIN_DIRECTORIES.CONFERENCES:
          result.conferences = readDir({ path: filePath, name: file, breadCrumb })
          break
      }
    })
    checkResult()
  }
}

export default readRootDirectory
