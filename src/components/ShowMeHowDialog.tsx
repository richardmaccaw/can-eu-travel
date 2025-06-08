import { Button } from './ui/button'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from './ui/dialog'

export function ShowMeHowDialog({ disabled }: { disabled?: boolean }) {
    return (
        <Dialog>
            {!disabled ? (
                <DialogTrigger asChild>
                    <Button
                        variant="link"
                        className="text-sm text-muted-foreground underline opacity-70 hover:opacity-100 pointer-events-auto"
                        style={{ minHeight: 32 }}
                    >
                        Show me how
                    </Button>
                </DialogTrigger>
            ) : (
                <div style={{ minHeight: 32 }} aria-hidden="true" />
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>How to export your location history</DialogTitle>
                    <DialogDescription className="pt-4">
                        Open your Google Maps application on your phone. Go to{' '}
                        <strong>Settings</strong>, then{' '}
                        <strong>Your timeline</strong>, then choose{' '}
                        <strong>Options, Location and privacy settings</strong>, and finally{' '}
                        <strong>Export location history</strong>.
                        <br />
                        <br />
                        <strong>Note:</strong> This will only work if you have location history enabled in your Google Maps settings.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="secondary">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
} 