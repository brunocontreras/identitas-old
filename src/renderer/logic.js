import fs from 'fs'

const ROOT_DIRECTORIES = {
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

const data = {
  experts: [],
  family: [],
  training: [],
  conferences: [],
  presentations: {},
  videos: {},
  audios: {}
}

const log = []

let presentationIdx = 0
// let videoIdx = 0
// let audioIdx = 0

const newPresentation = ({ path, name }) => {
  presentationIdx++
  const id = presentationIdx.toString()
  const presentation = { id, path, name }
  data.presentations[id] = presentation
  return presentation
}

// const newAudio = ({ path, name }) => {

// }

// const newVideo = ({ path, name }) => {

// }

// const readAudioDir = path => {

// }

const readSlidesDir = path => {
  const files = fs.readdirSync(path)
  if (files) {
    return files.sort()
  }
}

const readPresentation = ({ path, name, breadCrumb }) => {
  const files = fs.readdirSync(path)
  if (!files) {
    log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
    return []
  } else {
    const presentation = newPresentation({ path, name })
    files.forEach(file => {
      switch (file) {
        case 'Audios':
          // presentation.audios = readAudioDir(path)
          break
        case 'Videos':
          // presentation.videos = readVideoDir(path)
          break
        case 'PowerPoint':
          presentation.slides = readSlidesDir(`${path}\\${file}`)
          break
      }
    })
    return presentation.id
  }
}

const readDir = ({ path, name, breadCrumb, isContainer = true }) => {
  const files = fs.readdirSync(path)
  if (!files) {
    log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
    return []
  } else {
    if (isContainer) {
      return files.map(file => ({
        name: file,
        presentations: readDir({
          path: `${path}\\${file}`,
          name: file,
          breadCrumb: [...breadCrumb, file],
          isContainer: false
        })
      }))
    } else {
      return files.map(file => readPresentation({
        path: `${path}\\${file}`,
        name: file,
        breadCrumb: [...breadCrumb, file]
      }))
    }
  }
}

const checkData = () => {
  if (data.experts.length === 0) log.push(`No existe la carpeta '${ROOT_DIRECTORIES.EXPERTS}'`)
  if (data.family.length === 0) log.push(`No existe la carpeta '${ROOT_DIRECTORIES.FAMILY}'`)
  if (data.training.length === 0) log.push(`No existe la carpeta '${ROOT_DIRECTORIES.TRAINING}'`)
  if (data.conferences.length === 0) log.push(`No existe la carpeta '${ROOT_DIRECTORIES.CONFERENCES}'`)
}

const readRootDirectory = path => {
  debugger
  const files = fs.readdirSync(path)
  if (!files) log.push('La carpeta raíz no tiene contenido')
  else {
    files.forEach(file => {
      const filePath = `${path}\\${file}`
      const breadCrumb = [file]
      switch (file) {
        case ROOT_DIRECTORIES.EXPERTS:
          data.experts = readDir({ path: filePath, name: file, breadCrumb })
          break
        case ROOT_DIRECTORIES.FAMILY:
          data.family = readDir({ path: filePath, name: file, breadCrumb })
          break
        case ROOT_DIRECTORIES.TRAINING:
          data.training = readDir({ path: filePath, name: file, breadCrumb })
          break
        case ROOT_DIRECTORIES.CONFERENCES:
          data.conferences = readDir({ path: filePath, name: file, breadCrumb, isContainer: false })
          break
      }
    })
    checkData()
  }
}

export default readRootDirectory
