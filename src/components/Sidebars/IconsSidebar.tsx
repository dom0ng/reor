import React, { useEffect, useMemo, useState } from 'react'

import { IconContext } from 'react-icons'
import { FaSearch } from 'react-icons/fa'
import { GrNewWindow } from 'react-icons/gr'
import { ImFilesEmpty } from 'react-icons/im'
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5'
import { MdOutlineQuiz, MdSettings } from 'react-icons/md'
import { VscNewFile, VscNewFolder } from 'react-icons/vsc'

import NewDirectoryComponent from '../File/NewDirectory'
import NewNoteComponent from '../File/NewNote'
import FlashcardMenuModal from '../Flashcard/FlashcardMenuModal'
import SettingsModal from '../Settings/Settings'
import { SidebarAbleToShow } from './MainSidebar'

interface IconsSidebarProps {
  openRelativePath: (path: string) => void
  sidebarShowing: SidebarAbleToShow
  makeSidebarShow: (show: SidebarAbleToShow) => void
}

const IconsSidebar: React.FC<IconsSidebarProps> = ({ openRelativePath, sidebarShowing, makeSidebarShow }) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false)
  const [isNewDirectoryModalOpen, setIsNewDirectoryModalOpen] = useState(false)
  const [isFlashcardModeOpen, setIsFlashcardModeOpen] = useState(false)
  const [customDirectoryPath, setCustomDirectoryPath] = useState('')
  const [customFilePath, setCustomFilePath] = useState('')

  const [initialFileToCreateFlashcard, setInitialFileToCreateFlashcard] = useState('')
  const [initialFileToReviewFlashcard, setInitialFileToReviewFlashcard] = useState('')

  // open a new flashcard create mode
  useEffect(() => {
    const createFlashcardFileListener = window.ipcRenderer.receive(
      'create-flashcard-file-listener',
      (noteName: string) => {
        setIsFlashcardModeOpen(!!noteName)
        setInitialFileToCreateFlashcard(noteName)
      },
    )

    return () => {
      createFlashcardFileListener()
    }
  }, [])

  // open a new note window
  useEffect(() => {
    const handleNewNote = (relativePath: string) => {
      setCustomFilePath(relativePath)
      setIsNewNoteModalOpen(true)
    }

    window.ipcRenderer.receive("add-new-note-response", (relativePath: string) => {
        handleNewNote(relativePath);
      }
    );
  }, []);

  // open a new directory window
  useEffect(() => {
    const handleNewDirectory = (dirPath: string) => {
      setCustomDirectoryPath(dirPath);
      setIsNewDirectoryModalOpen(true);
    };
    
    window.ipcRenderer.receive('add-new-directory-listener', (dirPath) => {
      handleNewDirectory(dirPath)
    })
  }, []);
  const filesIconContextValue = useMemo(() => ({ color: sidebarShowing === 'files' ? 'white' : 'gray' }), [sidebarShowing])
  const chatsIconContextValue = useMemo(() => ({ color: sidebarShowing === 'chats' ? 'white' : 'gray' }), [sidebarShowing])
  const searchIconContextValue = useMemo(
    () => ({ color: sidebarShowing === 'search' ? 'white' : 'gray' }),
    [sidebarShowing],
  )
  return (
    <div className="flex size-full flex-col items-center justify-between gap-1 bg-neutral-800">
      <div
        className=" flex h-8 w-full cursor-pointer items-center justify-center"
        onClick={() => makeSidebarShow('files')}
      >
        <IconContext.Provider value={filesIconContextValue}>
          <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
            <ImFilesEmpty
              className="mx-auto text-gray-200 "
              size={18}
              title="Files"
            />
          </div>
        </IconContext.Provider>
      </div>
      <div
        className=" flex h-8 w-full cursor-pointer items-center justify-center"
        onClick={() => makeSidebarShow('chats')}
      >
        <IconContext.Provider value={chatsIconContextValue}>
          <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
            <IoChatbubbleEllipsesOutline
              className="text-gray-100 cursor-pointer "
              size={18}
              title={
                sidebarShowing === "chats" ? "Close Chatbot" : "Open Chatbot"
              }
            />
          </div>
        </IconContext.Provider>
      </div>
      <div
        className="flex h-8 w-full cursor-pointer items-center justify-center"
        onClick={() => makeSidebarShow('search')}
      >
        <IconContext.Provider value={searchIconContextValue}>
          <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
            <FaSearch
              size={18}
              className=" text-gray-200"
              title="Semantic Search"
            />
          </div>
        </IconContext.Provider>
      </div>
      <div
        className="flex h-8 w-full cursor-pointer items-center justify-center border-none bg-transparent "
        onClick={() => setIsNewNoteModalOpen(true)}
      >
        <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
          <IconContext.Provider value={{ color: "gray" }}>
            <VscNewFile className="text-gray-200" size={22} title="New Note" />
          </IconContext.Provider>
        </div>
      </div>
      <div
        className="mt-[2px] flex h-8 w-full cursor-pointer items-center justify-center border-none bg-transparent "
        onClick={() => setIsNewDirectoryModalOpen(true)}
      >
        <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
          <IconContext.Provider value={{ color: "gray" }}>
            <VscNewFolder
              className="text-gray-200"
              size={18}
              title="New Directory"
            />
          </IconContext.Provider>
        </div>
      </div>
      <div
        className="flex h-8 w-full cursor-pointer items-center justify-center border-none bg-transparent "
        onClick={() => setIsFlashcardModeOpen(true)}
      >
        <div className="rounded size-4/5 flex items-center justify-center hover:bg-neutral-700">
          <IconContext.Provider value={{ color: "gray" }}>
            <MdOutlineQuiz
              className="text-gray-200"
              size={19}
              title="Flashcard quiz"
            />
          </IconContext.Provider>
        </div>
      </div>

      <NewNoteComponent
        isOpen={isNewNoteModalOpen}
        onClose={() => setIsNewNoteModalOpen(false)}
        openRelativePath={openRelativePath}
        customFilePath={customFilePath}
      />
      <NewDirectoryComponent
        isOpen={isNewDirectoryModalOpen}
        onClose={() => setIsNewDirectoryModalOpen(false)}
        onDirectoryCreate={customDirectoryPath}
      />
      {isFlashcardModeOpen && (
        <FlashcardMenuModal
          isOpen={isFlashcardModeOpen}
          onClose={() => {
            setIsFlashcardModeOpen(false)
            setInitialFileToCreateFlashcard('')
            setInitialFileToReviewFlashcard('')
          }}
          initialFileToCreateFlashcard={initialFileToCreateFlashcard}
          initialFileToReviewFlashcard={initialFileToReviewFlashcard}
        />
      )}
      <div className="grow border-yellow-300" />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
      <div
        className="mb-[2px] flex w-full cursor-pointer items-center justify-center border-none bg-transparent pb-2"
        onClick={() => window.electronUtils.openNewWindow()}
      >
        <IconContext.Provider value={{ color: "gray" }}>
          <GrNewWindow
            className="text-gray-100"
            size={18}
            title="Open New Vault"
          />
        </IconContext.Provider>
      </div>
      <button
        className="flex w-full cursor-pointer items-center justify-center border-none bg-transparent pb-2"
        onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
        type="button"
        aria-label="Open Settings"
      >
        <IconContext.Provider value={{ color: "gray" }}>
          <MdSettings
            size={18}
            className="h-6 w-6 text-gray-100 mb-3"
            title="Settings"
          />
        </IconContext.Provider>
      </button>
    </div>
  )
}

export default IconsSidebar
