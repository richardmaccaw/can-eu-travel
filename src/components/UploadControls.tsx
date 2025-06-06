import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'

interface UploadControlsProps {
  onFile: (file: File) => void
  importButtonRef?: React.RefObject<HTMLButtonElement>
}

export function UploadControls({ onFile, importButtonRef }: UploadControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        ref={importButtonRef}
        className="mt-10 w-auto pointer-events-auto"
        onClick={handleUploadClick}
      >
        Import
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-sm text-muted-foreground underline opacity-70 hover:opacity-100 pointer-events-auto"
          >
            Show me how
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to export your location history</DialogTitle>
            <DialogDescription>
              Open your Google Maps application on your phone. Go to{' '}
              <strong>Settings</strong>, then{' '}
              <strong>Timeline</strong>, then choose{' '}
              <strong>Export location history</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}
