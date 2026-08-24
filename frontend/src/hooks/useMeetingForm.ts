import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { meetingServices } from '@/services/meeting.services';
import type { Meeting, MeetingStatus, MeetingPayload } from '@/types/meetings';
import { useAuth } from './useAuth';

export interface MeetingParticipant {
  id: string;
  name: string;
  email: string;
}

export interface MeetingFormData {
  title: string;
  category: string | null;
  room: string | null;
  status: MeetingStatus;
  date: Date | null;
  startTime: string;
  endTime: string;
  participants: MeetingParticipant[];
}

const emptyFormData: MeetingFormData = {
  title: '',
  category: '',
  room: '',
  status: 'PENDENTE',
  date: null,
  startTime: '09:00',
  endTime: '10:00',
  participants: []
};

interface UseMeetingFormArgs {
  isOpen: boolean;
  meetingToEdit?: Meeting | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function useMeetingForm({ isOpen, meetingToEdit, onSuccess, onClose }: UseMeetingFormArgs) {
  const isEditMode = !!meetingToEdit;
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [formData, setFormData] = useState<MeetingFormData>(emptyFormData);
  const { user } = useAuth()

  // Preenche o formulário quando o modal abre — a partir da reunião a editar, ou vazio para criar uma nova
  useEffect(() => {
    if (!isOpen) return;

    if (meetingToEdit) {
      const startDate = new Date(meetingToEdit.date_start.replace(' ', 'T'));
      const endDate = new Date(meetingToEdit.date_end.replace(' ', 'T'));

      setFormData({
        title: meetingToEdit.title,
        category: meetingToEdit.category,
        room: meetingToEdit.room,
        status: meetingToEdit.status,
        date: startDate,
        startTime: startDate.toTimeString().slice(0, 5),
        endTime: endDate.toTimeString().slice(0, 5),
        participants: [] // participantes não vêm no shape de Meeting; ajustar se a API expuser essa lista
      });
      setViewDate(startDate);
      setStep(1);
    } else {
      setFormData(emptyFormData);
      setViewDate(new Date());
      setStep(1);
    }
  }, [isOpen, meetingToEdit]);

  const updateField = <K extends keyof MeetingFormData>(field: K, value: MeetingFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleParticipant = (user: MeetingParticipant) => {
    setFormData(prev => {
      const isSelected = prev.participants.some(p => p.id === user.id);
      return isSelected
        ? { ...prev, participants: prev.participants.filter(p => p.id !== user.id) }
        : { ...prev, participants: [...prev.participants, user] };
    });
  };

  // Combina formData.date + horário (HH:mm) num ISO datetime válido (com T e Z),
  // que é o formato exigido pelo Zod no backend.
  const combineDateTime = (timeStr: string) => {
    if (!formData.date) return '';
    const d = new Date(formData.date);
    const [hours, minutes] = timeStr.split(':');
    d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return d.toISOString();
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleClose = () => {
    setStep(1);
    setFormData(emptyFormData);
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
     const payload: MeetingPayload = {
      title: formData.title,
      category: formData.category ?? '',
      room: formData.room ?? '',
      responsible: (isEditMode && meetingToEdit ? meetingToEdit.responsible : user?.id) ?? '',
      status: formData.status,
      n_participants: formData.participants.length,
      date_start: combineDateTime(formData.startTime),
      date_end: combineDateTime(formData.endTime),
      description: `Participantes: ${formData.participants.map(p => p.name).join(', ')}`,
      participant_ids: formData.participants.map(p => p.id) // ← novo
    };

      if (isEditMode && meetingToEdit) {
        await api.put<Meeting>(`/meeting-update/${meetingToEdit.id}`, payload);
      } else {
        await meetingServices.create(payload);
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro no servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const isStep1Valid = formData.title.trim() !== '' && formData.category !== '' && formData.room !== '';
  const isStep2Valid = formData.date instanceof Date && formData.startTime !== '' && formData.endTime !== '';

  return {
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
  };
}