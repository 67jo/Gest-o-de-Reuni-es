import { Calendar as CalendarIcon, Edit3 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Meeting } from '@/types/meetings';
import { useMeetingModalData } from '@/hooks/useMeetingModalData';
import { useMeetingForm } from '@/hooks/useMeetingForm';
import { MeetingDetailsStep } from '../components/MeetinggDeatilsStep';
import { MeetingScheduleStep } from '../components/MeetingSchedulesStep';
import { MeetingParticipantsStep } from '../components/MeetingParticipantsStep';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingUpdated: () => void;
  meetingToEdit?: Meeting | null;
}

export default function MeetingModal({ isOpen, onClose, onMeetingUpdated, meetingToEdit = null }: MeetingModalProps) {
  const { dbUsers, dbRooms, dbCategories } = useMeetingModalData(isOpen);
  const {
    isEditMode,
    step,
    formData,
    viewDate,
    submitting,
    setViewDate,
    updateField,
    toggleParticipant,
    handleNext,
    handleBack,
    handleClose,
    handleSubmit,
    isStep1Valid,
    isStep2Valid
  } = useMeetingForm({ isOpen, meetingToEdit, onSuccess: onMeetingUpdated, onClose });

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex h-[90vh] max-h-[480px] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2 ${isEditMode ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {isEditMode ? <Edit3 size={20} /> : <CalendarIcon size={20} />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                {isEditMode ? 'Editar Reunião' : 'Nova Reunião'}
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Passo {step} de 3</p>
            </div>
          </div>
        </div>

        <Progress value={progress} className="h-1 rounded-none" />

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {step === 1 && (
            <MeetingDetailsStep
              formData={formData}
              updateField={updateField}
              dbCategories={dbCategories}
              dbRooms={dbRooms}
              isEditMode={isEditMode}
            />
          )}

          {step === 2 && (
            <MeetingScheduleStep
              formData={formData}
              updateField={updateField}
              viewDate={viewDate}
              setViewDate={setViewDate}
            />
          )}

          {step === 3 && (
            <MeetingParticipantsStep
              dbUsers={dbUsers}
              participants={formData.participants}
              toggleParticipant={toggleParticipant}
            />
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className={`font-bold ${step === 1 ? 'pointer-events-none opacity-0' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Voltar
          </Button>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleClose} className="flex-1 font-bold text-slate-400 hover:text-slate-600 sm:flex-none">
              Cancelar
            </Button>
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className="flex-1 rounded-xl bg-indigo-600 px-8 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 sm:flex-none"
              >
                Continuar
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={formData.participants.length === 0 || submitting}
                className="flex-1 rounded-xl bg-emerald-600 px-8 font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 sm:flex-none"
              >
                {submitting ? 'Processando...' : isEditMode ? 'Salvar Alterações' : 'Confirmar Agendamento'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}