import { lstatSync, readdirSync } from 'fs'
import { join } from 'path'
// import ffprobe from 'ffprobe'
// import ffprobeStatic from 'ffprobe-static'

const ROOT_DIRECTORIES = {
  EXPERTS: 'Expertos',
  FAMILY: 'Familia',
  TRAINING: 'Formación',
  CONFERENCES: 'Conferencias'
}

const PRESENTATION_DIRECTORIES = {
  AUDIOS: 'Audios',
  LYRICS: 'Letras',
  VIDEOS: 'Vídeos',
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

// const parseToMMSS = (text) => {
//   const secNum = parseInt(text, 10)
//   let hours = Math.floor(secNum / 3600)
//   let minutes = Math.floor((secNum - (hours * 3600)) / 60)
//   let seconds = secNum - (hours * 3600) - (minutes * 60)

//   if (hours < 10) hours = `0${hours}`
//   if (minutes < 10) minutes = `0${minutes}`
//   if (seconds < 10) seconds = `0${seconds}`
//   return `${minutes}:${seconds}`
// }

// Warnings
const warningRootNoContent = () => log.push('La carpeta raíz no tiene contenido')
const warningNoContent = breadCrumb => log.push(`La carpeta ${breadCrumb.join(' > ')} no tiene contenido`)
const warningNoDirectory = directory => log.push(`No existe la carpeta '${directory}'`)
const warningNoSlides = name => log.push(`La presentación ${name} no tiene diapositivas`)
const checkData = () => {
  if (data.experts === undefined) warningNoDirectory(ROOT_DIRECTORIES.EXPERTS)
  if (data.family === undefined) warningNoDirectory(ROOT_DIRECTORIES.FAMILY)
  if (data.training === undefined) warningNoDirectory(ROOT_DIRECTORIES.TRAINING)
  if (data.conferences === undefined) warningNoDirectory(ROOT_DIRECTORIES.CONFERENCES)
}

const isDirectory = path => lstatSync(path).isDirectory()
const isFile = path => lstatSync(path).isFile()
const getDirectories = path => readdirSync(path).filter(name => isDirectory(join(path, name))).sort(naturalCompare)
const getFiles = path => readdirSync(path).filter(name => isFile(join(path, name))).sort(naturalCompare)

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const isEqual = (name1, name2) => normalize(name1.toLowerCase()) === normalize(name2.toLowerCase())
const removeExtension = name => name.replace(/\.[^/.]+$/, '')
const removeOrder = name => name.replace(/^(\d+)[.\-_]*/, '').trim()
const extractName = name => removeExtension(removeOrder(name))

// Constructores
let presentationIdx = 0
const newPresentation = ({ path, name, breadCrumb }) => {
  presentationIdx++
  const id = presentationIdx.toString()
  const presentation = { id, path, name, breadCrumb }
  data.presentations[id] = presentation
  return presentation
}

let videoIdx = 0
const newVideo = ({ path, name, breadCrumb }) => {
  videoIdx++
  const id = videoIdx.toString()
  const video = { id, path, name, breadCrumb }
  data.videos[id] = video
  return video
}

let audioIdx = 0
const newAudio = ({ path, lyricsDirPath, name, breadCrumb }) => {
  audioIdx++
  const id = audioIdx.toString()
  const audio = { id, path, name, breadCrumb }

  const lyricsFile = `${name}.txt`
  const lyricsPath = join(lyricsDirPath, lyricsFile)
  if (isFile(lyricsPath)) {
    audio.lyricsPath = lyricsPath
  }

  data.audios[id] = audio
  return audio
}

const readAudioDir = ({ path, lyricsDirPath, breadCrumb }) => {
  const files = getFiles(path)
  if (files) {
    return files.map(name => {
      const audio = newAudio({
        path: join(path, name),
        lyricsDirPath,
        name: extractName(name),
        breadCrumb
      })
      return audio.id
    })
  }
}

const readVideoDir = ({ path, breadCrumb }) => {
  const files = getFiles(path)
  if (files) {
    return files.map(name => {
      const video = newVideo({
        path: join(path, name),
        name: extractName(name),
        breadCrumb
      })
      // ffprobe(join(path, name), { path: ffprobeStatic.path })
      //   .then(info => {
      //     video.duration = parseToMMSS(info.streams[0].duration)
      //   })
      //   .catch(err => {
      //     console.error(err)
      //   })
      return video.id
    })
  }
}

const readSlides = ({ path, name }) => {
  const files = getFiles(path)
  if (!files) warningNoSlides(name)
  else return files.map(name => join(path, name))
}

const readPresentation = ({ path, name, breadCrumb }) => {
  const directories = getDirectories(path)
  if (!directories) {
    warningNoContent(breadCrumb)
    return []
  } else {
    const presentation = newPresentation({ path, name, breadCrumb })
    directories.forEach(name => {
      if (isEqual(PRESENTATION_DIRECTORIES.AUDIOS, name)) {
        const existsLyrics = directories.find(d => isEqual(PRESENTATION_DIRECTORIES.LYRICS, d))
        presentation.audios = readAudioDir({
          path: join(path, name),
          lyricsDirPath: existsLyrics ? join(path, PRESENTATION_DIRECTORIES.LYRICS) : '',
          name,
          breadCrumb: [...breadCrumb, name]
        })
      }
      if (isEqual(PRESENTATION_DIRECTORIES.VIDEOS, name)) {
        presentation.videos = readVideoDir({
          path: join(path, name),
          name,
          breadCrumb: [...breadCrumb, name]
        })
      }
      if (isEqual(PRESENTATION_DIRECTORIES.SLIDES, name)) {
        presentation.slides = readSlides({
          path: join(path, name),
          name
        })
      }
    })
    return presentation.id
  }
}

const readPresentations = ({ path, name, breadCrumb }) => {
  const directories = getDirectories(path)
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
  const directories = getDirectories(path)
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
  console.time('identitas')
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
    console.timeEnd('identitas')
    return {
      data,
      log
    }
  }
}

export default readRootDirectory
