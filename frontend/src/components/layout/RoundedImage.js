import styles from './RoundedImage.module.css'

function RoundedImage({src, alt, width, className}) {
    return (
        <img
            className={`${styles.rounded_image} ${styles[width] || ''} ${className || ''}`}
            src={src}
            alt={alt}
        />
    )
}

export default RoundedImage
