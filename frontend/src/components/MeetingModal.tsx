import { useState, useEffect } from 'react';
import { 
  X, Calendar as CalendarIcon, 
  Clock, Search, Check, CheckCircle2, 
  ChevronLeft, ChevronRight, Edit3 
} from 'lucide-react';
import api from '../api/axios';
import { meetingServices } from '@/services/meeting.services';
import type { Meeting, MeetingStatus, category, room } from '@/types/meetings';

export type { Meeting, MeetingStatus };

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMeetingUpdated: () => void;
  meetingToEdit?: Meeting | null;
}

export default function MeetingModal({ isOpen, onClose, onMeetingUpdated, meetingToEdit = null }: MeetingModalProps) {
  const isEditMode = !!meetingToEdit;
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbRooms, setDbRooms] = useState<room[]>([]);
  const [dbCategories, setDbCategories] = useState<category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    room: '',
    responsible: '',
    status: 'PENDENTE' as MeetingStatus,
    date: null as Date | null,
    startTime: '09:00',
    endTime: '10:00',
    participants: [] as any[]
  });

  const statusOptions: MeetingStatus[] = ['PENDENTE', 'DECORRENDO', 'CANCELADA', 'TERMINADA'];
  const statusLabels: Record<MeetingStatus, string> = {
    PENDENTE: 'Pendente',
    DECORRENDO: 'A decorrer',
    CANCELADA: 'Cancelada',
    TERMINADA: 'Terminada'
  };

  const [viewDate, setViewDate] = useState(new Date());
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  // Efeito para carregar dados iniciais e preencher se for Edição
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      Promise.allSettled([
        api.get('/user-list'),
        meetingServices.getMeetingModalData()
      ]).then(([usersResult, modalDataResult]) => {
        if (usersResult.status === 'fulfilled') {
          setDbUsers(usersResult.value.data);
        } else {
          console.error("Erro ao carregar utilizadores:", usersResult.reason);
        }

        if (modalDataResult.status === 'fulfilled') {
          setDbRooms(modalDataResult.value.roomAll);
          setDbCategories(modalDataResult.value.categoryAll);
        } else {
          console.error("Erro ao carregar dados do modal (salas/categorias):", modalDataResult.reason);
        }

        if (meetingToEdit) {
          const startDate = new Date(meetingToEdit.date_start.replace(' ', 'T'));
          const endDate = new Date(meetingToEdit.date_end.replace(' ', 'T'));

          setFormData({
            title: meetingToEdit.title,
            category: meetingToEdit.category,
            room: meetingToEdit.room,
            responsible: meetingToEdit.responsible,
            status: meetingToEdit.status,
            date: startDate,
            startTime: startDate.toTimeString().slice(0, 5),
            endTime: endDate.toTimeString().slice(0, 5),
            participants: [] // participantes não vêm no shape de Meeting; ajustar se a API expuser essa lista
          });
          setViewDate(startDate);
        }
      }).finally(() => setLoading(false));
    }
  }, [isOpen, meetingToEdit]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const toggleParticipant = (user: any) => {
    setFormData(prev => {
      const isSelected = prev.participants.some(p => p.id === user.id);
      return isSelected
        ? { ...prev, participants: prev.participants.filter(p => p.id !== user.id) }
        : { ...prev, participants: [...prev.participants, user] };
    });
  };

  const formatToMySQL = (timeStr: string) => {
    if (!formData.date) return '';
    const d = new Date(formData.date);
    const [hours, minutes] = timeStr.split(':');
    d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    // Ajuste simples de fuso horário local para string MySQL format
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 19).replace('T', ' ');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        room: formData.room,
        responsible: formData.responsible,
        status: formData.status,
        date_start: formatToMySQL(formData.startTime),
        date_end: formatToMySQL(formData.endTime),
        description: `Participantes: ${formData.participants.map(p => p.nome_completo).join(', ')}`
      } as Meeting;

      if (isEditMode && meetingToEdit) {
        await api.put(`/meeting-update/${meetingToEdit.id}`, payload);
      } else {
        await meetingServices.create(payload);
      }

      if (onMeetingUpdated) onMeetingUpdated();
      handleClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro no servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      title: '',
      category: '',
      room: '',
      responsible: '',
      status: 'PENDENTE',
      date: null,
      startTime: '09:00',
      endTime: '10:00',
      participants: []
    });
    onClose();
  };

  const isStep1Valid = formData.title.trim() !== '' && formData.category !== '' && formData.room !== '' && formData.responsible !== '';
  const isStep2Valid = (formData.date instanceof Date) && formData.startTime !== '' && formData.endTime !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[680px] animate-in fade-in zoom-in-95 duration-200">

        {/* HEADER */}
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isEditMode ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {isEditMode ? <Edit3 size={20}/> : <CalendarIcon size={20} />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? 'Editar Reunião' : 'Nova Reunião'}
              </h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Passo {step} de 3</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="flex bg-slate-100 h-1">
          <div className={`h-full bg-indigo-600 transition-all duration-500 ease-out ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
              <div className="grid grid-cols-1 gap-6">
                <div className="group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 group-focus-within:text-indigo-600 transition-colors">Título da Reunião</label>
                  <input
                    type="text"
                    placeholder="Ex: Alinhamento de Design"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="">Selecione...</option>
                    {dbCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Sala de Reunião</label>
                  <select value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="">Selecione a sala...</option>
                    {dbRooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

              <div className={`grid ${isEditMode ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Responsável Organização</label>
                  <select value={formData.responsible} onChange={(e) => setFormData({...formData, responsible: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                    <option value="">Selecione o responsável...</option>
                    {dbUsers.map(u => <option key={u.id} value={u.id}>{u.nome_completo}</option>)}
                  </select>
                </div>

                {isEditMode && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estado</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as MeetingStatus})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-indigo-500 transition-all cursor-pointer">
                      {statusOptions.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CalendarIcon size={20} className="text-indigo-600"/> {months[viewDate.getMonth()]} de {viewDate.getFullYear()}
                  </h3>
                  <div className="flex gap-1">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {daysOfWeek.map(d => <span key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</span>)}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} />)}
                  {Array.from({ length: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                    const day = i + 1;
                    const isSelected = formData.date?.getDate() === day && formData.date?.getMonth() === viewDate.getMonth() && formData.date?.getFullYear() === viewDate.getFullYear();
                    return (
                      <button key={day} onClick={() => setFormData({...formData, date: new Date(viewDate.getFullYear(), viewDate.getMonth(), day)})}
                        className={`h-10 rounded-xl text-sm font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'hover:bg-indigo-50 text-slate-600'}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1"><Clock size={14}/> Início</label>
                    <input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 flex items-center gap-1"><Clock size={14}/> Fim</label>
                    <input type="time" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-all" />
                  </div>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
               <div className="mb-6 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Buscar participantes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white transition-all outline-none focus:border-indigo-500" />
               </div>
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {dbUsers.filter(u => u.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())).map(user => {
                    const isSelected = formData.participants.some(p => p.id === user.id);
                    return (
                      <div key={user.id} onClick={() => toggleParticipant(user)}
                        className={`flex items-center p-3 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 flex items-center justify-center font-bold mr-4">{user.nome_completo.charAt(0)}</div>
                        <div className="flex-1 text-sm">
                          <h4 className="font-bold text-slate-800">{user.nome_completo}</h4>
                          <p className="text-slate-400 text-xs">{user.departamento || 'Sem departamento'}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 opacity-50'}`}>
                          {isSelected && <Check size={14} />}
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 p-6 bg-slate-50/80 flex justify-between items-center">
          <button onClick={handleBack} disabled={step === 1} className={`px-6 py-2.5 font-bold text-sm transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-500 hover:text-slate-800'}`}>
            Voltar
          </button>

          <div className="flex gap-3">
            <button onClick={handleClose} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                className={`px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${((step === 1 && isStep1Valid) || (step === 2 && isStep2Valid)) ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={formData.participants.length === 0 || loading}
                className={`px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all active:scale-95 ${formData.participants.length > 0 ? 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                {loading ? 'Processando...' : isEditMode ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                {!loading && <CheckCircle2 size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}