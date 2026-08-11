import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Search } from 'lucide-react';
import type { MeetingParticipant } from '@/hooks/useMeetingForm';
import type { MeetingUser } from '@/hooks/useMeetingModalData';

interface MeetingParticipantsStepProps {
  dbUsers: MeetingUser[];
  participants: MeetingParticipant[];
  toggleParticipant: (user: MeetingParticipant) => void;
}

export function MeetingParticipantsStep({ dbUsers, participants, toggleParticipant }: MeetingParticipantsStepProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = dbUsers.filter(u =>
    u.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col animate-in slide-in-from-right-8 duration-300">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <Input
          placeholder="Buscar participantes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-11 w-full pl-12"
        />
      </div>

      <ScrollArea className="flex-1 pr-2">
        <div className="space-y-2">
          {filteredUsers.map(user => {
            const isSelected = participants.some(p => p.id === user.id);
            return (
              <div
                key={user.id}
                onClick={() => toggleParticipant(user)}
                className={`flex items-center rounded-2xl border p-3 cursor-pointer transition-all ${
                  isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <Avatar className="mr-4">
                  <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 font-bold text-slate-600">
                    {user.nome_completo.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-sm">
                  <h4 className="font-bold text-slate-800">{user.nome_completo}</h4>
                  <p className="text-xs text-slate-400">{user.departamento || 'Sem departamento'}</p>
                </div>
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all ${
                    isSelected ? 'bg-indigo-600 text-white' : 'border-2 border-slate-200 opacity-50'
                  }`}
                >
                  {isSelected && <Check size={14} />}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}