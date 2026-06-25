import React from 'react';
import { RSVP } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface GuestsTabProps {
  filteredRSVPs: RSVP[];
}

export default function GuestsTab({ 
  filteredRSVPs 
}: GuestsTabProps) {
  return (
    <table id="admin-rsvps-table" className="w-full border-collapse min-w-[800px]">
      <thead className="text-[0.6rem] text-gold uppercase tracking-[0.2em] border-b border-gold/10">
        <tr>
          <th className="text-left py-4 px-4">Guest Name</th>
          <th className="text-left py-4 px-4">Attendance</th>
          <th className="text-left py-4 px-4">Group</th>
          <th className="text-left py-4 px-4">Preference</th>
          <th className="text-left py-4 px-4">Events</th>
        </tr>
      </thead>
      <tbody className="text-xs text-text-secondary">
        {filteredRSVPs.map((r) => (
          <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <td className="py-4 px-4">
              <p className="text-text-primary text-sm mb-0.5">{r.guest_name}</p>
              <p className="text-[0.7rem] text-text-secondary/60">{r.email}</p>
            </td>
            <td className="py-4 px-4">
              {r.attending ? (
                <span className="text-green-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> attending
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle size={12} /> Declines
                </span>
              )}
            </td>
            <td className="py-4 px-4">
              Adults: {r.total_guests} / Kids: {r.children_count}
            </td>
            <td className="py-4 px-4 italic font-medium">
              {r.food_preference}
            </td>
            <td className="py-4 px-4">
              <div className="flex flex-wrap gap-1">
                {r.events && r.events.map(ev => (
                  <span key={ev} className="bg-gold/10 text-gold scale-90 px-2 py-0.5 border border-gold/20 text-[10px]">
                    {ev}
                  </span>
                ))}
              </div>
            </td>
          </tr>
        ))}
        {filteredRSVPs.length === 0 && (
          <tr>
            <td colSpan={5} className="py-20 text-center text-text-secondary uppercase tracking-widest opacity-40">
              No entries found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
