import styles from './Message.module.css'
import { useState, useEffect } from 'react'
import bus from '../../utils/bus'

function FlashMessage() {
  const [flashMessage, setFlashMessage] = useState(null)

  useEffect(() => {
    const handleFlash = ({ message, type }) => {
      setFlashMessage({ message, type })
      setTimeout(() => setFlashMessage(null), 3000)
    }

    bus.on('flash', handleFlash)

    return () => {
      bus.off('flash', handleFlash)
    }
  }, [])

  return (
    <>
      {flashMessage && (
        <div className={`${styles.message} ${styles[flashMessage.type]}`}>
          {flashMessage.message}
        </div>
      )}
    </>
  )
}

export default FlashMessage
