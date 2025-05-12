export interface UploadFileProps {
  label?: string
  onClick?: () => void
  onChange?: (file: File) => void
  onDrop?: (file: File) => void
  previewUrl?: string
  error?: string
}