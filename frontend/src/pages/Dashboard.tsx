import { useMemo, useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NewMeetingModal from '../components/MeetingModal';
import { useSearch } from '../context/SearchContext';
import { useDashboardData } from '../hooks/useDashboardData';
import { MonthNavigator } from '../components/MonthNavigator';
import { StatCard } from '../components/StatCard';
import { MeetingCard } from '../components/MeetingCard';
import { EmptyState } from '../components/EmptyState';
import type { Meeting, MeetingStatus } from '@/types/meetings';
import api from '../api/axios';

export default function Dashboard() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [meetingToEdit, setMeetingToEdit] = useState<Meeting | null>(null);
  const { searchTerm } = useSearch();

  const { meetingsList, loading, error, fetchDashboardData, getRoomName } = useDashboardData(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );

  const currentMonthLabel = viewDate
    .toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
    .replace(/^\w/, (c) => c.toUpperCase());

  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const goToCurrentMonth = () => setViewDate(new Date());

  const filteredMeetings = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return meetingsList.filter(meeting =>
      meeting.title.toLowerCase().includes(term) ||
      meeting.category.toLowerCase().includes(term)
    );
  }, [meetingsList, searchTerm]);


  const stats = useMemo(() => {
    const total = filteredMeetings.length;
    const pendentes = filteredMeetings.filter(m => m.status === 'PENDENTE').length;
    const terminadas = filteredMeetings.filter(m => m.status === 'TERMINADA').length;
    const canceladas = filteredMeetings.filter(m => m.status === 'CANCELADA').length;
    return { total, pendentes, terminadas, canceladas };
  }, [filteredMeetings]);

  const handleStatusUpdate = async (id: string, newStatus: MeetingStatus) => {
    try {
      await api.patch(`/meeting-status/${id}`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      alert('Houve um erro ao atualizar o status.');
    }
  };

  const handleOpenNewMeeting = () => {
    setMeetingToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditMeeting = (meeting: Meeting) => {
    setMeetingToEdit(meeting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMeetingToEdit(null);
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-8 pb-24 lg:px-12">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold tracking-tight text-indigo-700 lg:text-3xl">Portal de Reuniões</h1>
          </div>
          <Button
            onClick={handleOpenNewMeeting}
            className="gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95"
          >
            <Plus size={20} />
            Nova Reunião
          </Button>
        </div>

        <div className="mb-10">
          <MonthNavigator label={currentMonthLabel} onPrev={prevMonth} onNext={nextMonth} onToday={goToCurrentMonth} />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total no Mês" value={stats.total} icon={CalendarCheck} iconWrapClass="" highlight />
          <StatCard
            label="Pendentes"
            value={stats.pendentes}
            icon={CalendarCheck}
            iconWrapClass="bg-blue-50 text-blue-600"
            barClass="bg-blue-500"
            percentage={stats.total > 0 ? (stats.pendentes / stats.total) * 100 : 0}
          />
          <StatCard
            label="Concluídas"
            value={stats.terminadas}
            icon={CheckCircle2}
            iconWrapClass="bg-emerald-50 text-emerald-600"
            barClass="bg-emerald-500"
            percentage={stats.total > 0 ? (stats.terminadas / stats.total) * 100 : 0}
          />
          <StatCard
            label="Canceladas"
            value={stats.canceladas}
            icon={XCircle}
            iconWrapClass="bg-rose-50 text-rose-600"
            barClass="bg-rose-500"
            percentage={stats.total > 0 ? (stats.canceladas / stats.total) * 100 : 0}
          />
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800">Eventos Agendados</h2>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {meetingsList.length}
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <EmptyState message="A carregar reuniões..." />
            ) : error ? (
              <EmptyState message={error} />
            ) : filteredMeetings.length === 0 ? (
              <EmptyState message="Nenhuma reunião agendada no momento." />
            ) : (
              filteredMeetings.map(meeting => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  roomName={getRoomName(meeting.room)}
                  onEdit={handleOpenEditMeeting}
                  onStatusChange={handleStatusUpdate}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <NewMeetingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onMeetingUpdated={fetchDashboardData}
        meetingToEdit={meetingToEdit}
      />
    </>
  );
}