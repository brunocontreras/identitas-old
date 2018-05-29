import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
import ffprobe from 'ffprobe'
import ffprobeStatic from 'ffprobe-static'

const ROOT_DIRECTORIES = {
  EXPERTS: 'Expertos',
  FAMILY: 'Familia',
  TRAINING: 'Formación',
  CONFERENCES: 'Conferencias'
}

const PRESENTATION_DIRECTORIES = {
  AUDIOS: 'Audio',
  LYRICS: 'Letras',
  VIDEOS: 'Videos',
  SLIDES: 'PowerPoint'
}

// Data
const data = {
  experts: undefined,
  family: undefined,
  training: undefined,
  conferences: undefined,
  presentations: {},
  videos: {},
  audios: {}
}

const log = []

let presentationIdx = 0
// let videoIdx = 0
// let audioIdx = 0

// Helpers
const naturalCompare = (a, b) => {
  let ax = []
  let bx = []
  a.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']) })
  b.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']) })

  while (ax.length && bx.length) {
    const an = ax.shift()
    const bn = bx.shift()
    const nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1])
    if (nn) return nn
  }

  return ax.length - bx.length
}

const parseToMMSS = (text) => {
  const secNum = parseInt(text, 10)
  let hours = Math.floor(secNum / 3600)
  let minutes = Math.floor((secNum - (hours * 3600)) / 60)
  let seconds = secNum - (hours * 3600) - (minutes * 60)

  if (hours < 10) hours = `0${hours}`
  if (minutes < 10) minutes = `0${minutes}`
  if (seconds < 10) seconds = `0${seconds}`
  return `${minutes}:${seconds}`
}

// Warnings
const warningRootNoContent = () => log.push('La carpeta raíz no tiene contenido')
const warningNoContent = breadCrumb => log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
const warningNoDirectory = directory => log.push(`No existe la carpeta '${directory}'`)
const warningNoSlides = name => log.push(`La presentación ${name} no tiene diapositivas`)
const checkData = () => {
  if (data.experts === undefined) log.push(warningNoDirectory(ROOT_DIRECTORIES.EXPERTS))
  if (data.family === undefined) log.push(warningNoDirectory(ROOT_DIRECTORIES.FAMILY))
  if (data.training === undefined) log.push(warningNoDirectory(ROOT_DIRECTORIES.TRAINING))
  if (data.conferences === undefined) log.push(warningNoDirectory(ROOT_DIRECTORIES.CONFERENCES))
}

const isDirectory = path => lstatSync(path).isDirectory()
const isFile = path => lstatSync(path).isFile()
const getDirectories = path => readdirSync(path).filter(name => isDirectory(join(path, name)))
const getFiles = path => readdirSync(path).filter(name => isFile(join(path, name)))

const newPresentation = ({ path, name, breadCrumb }) => {
  presentationIdx++
  const id = presentationIdx.toString()
  const presentation = { id, path, name, breadCrumb }
  data.presentations[id] = presentation
  return presentation
}

// const newAudio = ({ path, name }) => {

// }

// const newVideo = ({ path, name }) => {

// }

// const readAudioDir = path => {

// }

const readVideoDir = (path, name, breadCrumb) => {
  debugger
  const files = getFiles(path).sort(naturalCompare)
  if (files) {
    return files.map(name => {
      ffprobe(join(path, name), { path: ffprobeStatic.path })
        .then(info => {
          return {
            name,
            path,
            breadCrumb,
            duration: parseToMMSS(info.streams[0].duration)
          }
        })
        .catch(err => {
          console.error(err)
        })
    })
  }
}

const readSlides = (path, name, breadCrumb) => {
  const files = getFiles(path)
  if (!files) warningNoSlides(name)
  else {
    return files.sort(naturalCompare)
  }
}

const readPresentation = ({ path, name, breadCrumb }) => {
  const directories = getDirectories(path).sort(naturalCompare)
  if (!directories) {
    warningNoContent(breadCrumb)
    return []
  } else {
    const presentation = newPresentation({ path, name, breadCrumb })
    directories.forEach(name => {
      switch (name) {
        case PRESENTATION_DIRECTORIES.AUDIOS:
          // presentation.audios = readAudioDir(path)
          break
        case PRESENTATION_DIRECTORIES.VIDEOS:
          presentation.videos = readVideoDir(join(path, name))
          break
        case PRESENTATION_DIRECTORIES.SLIDES:
          presentation.slides = readSlides(join(path, name))
          break
      }
    })
    return presentation.id
  }
}

const readPresentations = ({ path, name, breadCrumb }) => {
  const directories = getDirectories(path).sort(naturalCompare)
  if (!directories) {
    warningNoContent(breadCrumb)
    return []
  } else {
    return directories.map(name => readPresentation({
      path: join(path, name),
      name,
      breadCrumb: [...breadCrumb, name]
    }))
  }
}

const readCourses = ({ path, name, breadCrumb }) => {
  const directories = getDirectories(path).sort(naturalCompare)
  if (!directories) {
    warningNoContent(breadCrumb)
    return []
  } else {
    return directories.map(name => ({
      name,
      presentations: readPresentations({
        path: join(path, name),
        name,
        breadCrumb: [...breadCrumb, name]
      })
    }))
  }
}

const readRootDirectory = path => {
  const directories = getDirectories(path)
  if (!directories) warningRootNoContent()
  else {
    directories.forEach(name => {
      const dirPath = join(path, name)
      const breadCrumb = [name]
      switch (name) {
        case ROOT_DIRECTORIES.EXPERTS:
          data.experts = {
            name: ROOT_DIRECTORIES.EXPERTS,
            courses: readCourses({ path: dirPath, name, breadCrumb })
          }
          break
        case ROOT_DIRECTORIES.FAMILY:
          data.family = {
            name: ROOT_DIRECTORIES.FAMILY,
            courses: readCourses({ path: dirPath, name, breadCrumb })
          }
          break
        case ROOT_DIRECTORIES.TRAINING:
          data.training = {
            name: ROOT_DIRECTORIES.TRAINING,
            courses: readCourses({ path: dirPath, name, breadCrumb })
          }
          break
        case ROOT_DIRECTORIES.CONFERENCES:
          data.conferences = {
            name: ROOT_DIRECTORIES.CONFERENCES,
            presentations: readPresentations({ path: dirPath, name, breadCrumb })
          }
          break
      }
    })
    checkData()
  }
}

export default readRootDirectory
