import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditProfileDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">Em breve.</p>
      </DialogContent>
    </Dialog>
  );
}
