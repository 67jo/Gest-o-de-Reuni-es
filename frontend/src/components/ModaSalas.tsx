import { DoorOpen, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface NewRoomState {
  name: string;
  capacity: string;
}

interface ModalSalaProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newRoom: NewRoomState;
  setNewRoom: (room: NewRoomState) => void;
}

export const ModalSala = ({ isOpen, onClose, onSubmit, newRoom, setNewRoom }: ModalSalaProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogHeader className="flex-row items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <DoorOpen className="text-indigo-600" />
            Adicionar Nova Sala
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6 p-6 md:p-8">
          <div>
            <Label className="mb-1 block text-sm font-bold text-slate-700">Nome da Sala *</Label>
            <Input
              type="text"
              required
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="Ex: Sala Gamma"
            />
          </div>

          <div>
            <Label className="mb-1 block text-sm font-bold text-slate-700">Capacidade *</Label>
            <Input
              type="number"
              required
              min="1"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
              placeholder="Ex: 10"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="font-semibold text-slate-600 hover:bg-slate-100">
              Cancelar
            </Button>
            <Button type="submit" className="gap-2 rounded-lg bg-indigo-600 px-6 font-bold shadow-md hover:bg-indigo-700 active:scale-95">
              <CheckCircle2 size={18} />
              Salvar Sala
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};