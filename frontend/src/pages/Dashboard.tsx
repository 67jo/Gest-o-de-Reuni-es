import { useState, useEffect } from 'react';
import { 
  Plus, Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Clock, MapPin, TrendingUp, CalendarCheck, CheckCircle2, XCircle, MoreVertical, Edit3
} from 'lucide-react';
import NewMeetingModal from '../components/MeetingModal';
import api from '../api/axios';
import { useSearch } from '../context/SearchContext';

export default function Dashboard() {
  // Estados de Dados e UI
  const [viewDate, setViewDate] = useState(new Date(2026, 3, 1));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [meetingsList, setMeetingsList] = useState<any[]>([]);
  const [roomsList, setRoomsList] = useState<any[]>([]);
  
  // ESTADO PARA EDIÇÃO
  const [meetingToEdit, setMeetingToEdit] = useState<any>(null);
  
  const { searchTerm } = useSearch();

  const currentMonthLabel = viewDate.toLocaleDateString('pt-AO', { 
    month: 'long', 
    year: 'numeric' 
  }).replace(/^\w/, (c) => c.toUpperCase());

  // Navegação de Calendário
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToCurrentMonth = () => setViewDate(new Date(2026, 3, 1));

  // Filtro de Reuniões
  const filteredMeetings = meetingsList.filter(meeting => {
    const meetingDate = new Date(meeting.startTime.replace(' ', 'T'));
    const matchesDate = meetingDate.getMonth() === viewDate.getMonth() &&
                        meetingDate.getFullYear() === viewDate.getFullYear();
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.categoria.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });
  
  const fetchDashboardData = async () => {
    try {
      const [salasRes, meetingsRes] = await Promise.all([
        api.get('/salas'),
        api.get('/meeting-list') 
      ]);
      setRoomsList(salasRes.data);
      setMeetingsList(meetingsRes.data);
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  // Formatadores
  const formatMeetingDate = (mysqlDate: string) => {
    if (!mysqlDate) return '';
    const date = new Date(mysqlDate.replace(' ', 'T'));
    return date.toLocaleDateString('pt-AO', { weekday: 'long', day: '2-digit', month: '2-digit' });
  };

  const formatMeetingTime = (start: string, end: string) => {
    if (!start || !end) return '';
    const s = new Date(start.replace(' ', 'T')).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
    const e = new Date(end.replace(' ', 'T')).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' });
    return `${s} - ${e}`;
  };

  const getRoomName = (salaId: number) => {
    const room = roomsList.find(r => r.id === salaId);
    return room ? room.nome : `Sala ID ${salaId}`;
  };

  // HANDLERS
  const handleStatusUpdate = async (id: number, newStatus: string) => {
    try {
      await api.patch(`/meeting-status/${id}`, { status: newStatus });
      setOpenDropdownId(null); 
      fetchDashboardData();    
      alert("Status atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Houve um erro ao atualizar o status.");
    }
  };

  // Funções de Modal
  const handleOpenNewMeeting = () => {
    setMeetingToEdit(null); // Limpa para garantir modo "Criação"
    setIsModalOpen(true);
  };

  const handleOpenEditMeeting = (meeting: any) => {
    setMeetingToEdit(meeting); // Carrega a reunião selecionada
    setOpenDropdownId(null);   // Fecha o dropdown
    setIsModalOpen(true);      // Abre o modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMeetingToEdit(null); // Limpa o estado após fechar
  };

  // Estatísticas
  const totalMeetings = filteredMeetings.length;
  const agendadasCount = filteredMeetings.filter(m => m.status === 'agendada').length;
  const concluidasCount = filteredMeetings.filter(m => m.status === 'concluída').length;
  const canceladasCount = filteredMeetings.filter(m => m.status === 'cancelada').length;

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8 lg:px-12 pb-24">
        
        {/* Section: Title & Primary Action */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="text-indigo-600 w-8 h-8" />
            <h1 className="text-2xl lg:text-3xl font-bold text-indigo-700 tracking-tight">Portal de Reuniões</h1>
          </div>
          <button 
            onClick={handleOpenNewMeeting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-sm shadow-indigo-600/20 transition-all active:scale-95">
            <Plus size={20} />
            Nova Reunião
          </button>
        </div>

        {/* Section: Controls */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button onClick={prevMonth} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="px-6 font-semibold text-slate-700 text-sm min-w-[160px] text-center">
              {currentMonthLabel}
            </span>
            <button onClick={nextMonth} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          <button onClick={goToCurrentMonth} className="bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
            Mês Atual
          </button>
        </div>

        {/* Section: Bento Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total no Mês</p>
            <div className="text-4xl font-black text-indigo-900 mb-4">{totalMeetings}</div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
              <TrendingUp size={14} />
              <span>Atualizado agora</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <CalendarCheck size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-800">{agendadasCount}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Agendadas</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalMeetings > 0 ? (agendadasCount / totalMeetings) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-800">{concluidasCount}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Concluídas</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalMeetings > 0 ? (concluidasCount / totalMeetings) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <XCircle size={20} />
              </div>
              <span className="text-2xl font-bold text-slate-800">{canceladasCount}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-2">Canceladas</p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${totalMeetings > 0 ? (canceladasCount / totalMeetings) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Meeting List */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-800">Eventos Agendados</h2>
            <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {meetingsList.length}
            </span>
          </div>

          <div className="space-y-4">
            {filteredMeetings.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-200 rounded-2xl">
                <p className="text-slate-500">Nenhuma reunião agendada no momento.</p>
              </div>
            ) : (
              filteredMeetings.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer relative"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {meeting.title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider
                        ${meeting.status === 'concluída' ? 'bg-emerald-100 text-emerald-700' : 
                          meeting.status === 'cancelada' ? 'bg-rose-100 text-rose-700' : 
                          meeting.status === 'agendada' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {meeting.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
                      <div className="flex items-center gap-2 capitalize">
                        <CalendarIcon size={16} className="text-slate-400" />
                        {formatMeetingDate(meeting.startTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        {formatMeetingTime(meeting.startTime, meeting.endTime)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-400" />
                        {getRoomName(meeting.sala_id)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                    <div className="flex -space-x-3">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
                        alt="Participante" 
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 object-cover shadow-sm"
                      />
                    </div>
                    
                    {/* DROPDOWN DE AÇÕES */}
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === meeting.id ? null : meeting.id);
                        }}
                        className={`p-2 rounded-lg transition-all border ${
                          openDropdownId === meeting.id 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-white'
                        }`}
                        >
                        <MoreVertical size={20} />
                      </button>

                      {openDropdownId === meeting.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                          
                          {/* BOTÃO DE EDITAR */}
                          <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                            Ações
                          </p>
                          <button 
                            onClick={() => handleOpenEditMeeting(meeting)}
                            className="w-full text-left px-4 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 font-semibold transition-colors"
                          >
                            <Edit3 size={18} /> Editar Reunião
                          </button>

                          <div className="h-px bg-slate-100 my-1"></div>

                          <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Alterar Estado
                          </p>
                          
                          {meeting.status !== 'concluída' && (
                            <button onClick={() => handleStatusUpdate(meeting.id, 'concluída')} className="w-full text-left px-4 py-2.5 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 font-semibold transition-colors">
                              <CheckCircle2 size={18} /> Marcar como Concluída
                            </button>
                          )}

                          {meeting.status !== 'cancelada' && (
                            <button onClick={() => handleStatusUpdate(meeting.id, 'cancelada')} className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold transition-colors">
                              <XCircle size={18} /> Cancelar Reunião
                            </button>
                          )}

                          {meeting.status !== 'agendada' && (
                            <button onClick={() => handleStatusUpdate(meeting.id, 'agendada')} className="w-full text-left px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-semibold transition-colors">
                              <CalendarCheck size={18} /> Reabrir Agendamento
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* MODAL INTEGRADO COM EDIÇÃO */}
      <NewMeetingModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        onMeetingUpdated={fetchDashboardData} // <--- AQUI: Você deu ao modal o "poder" de atualizar o pai
        meetingToEdit={meetingToEdit}
      />
    </>
  );
}