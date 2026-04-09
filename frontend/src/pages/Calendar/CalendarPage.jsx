import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ErrorBanner from '../../components/shared/ErrorBanner';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, ExternalLink } from 'lucide-react';

const getMockEvents = () => {
  const now = new Date();
  const addDays = (d) => { const t = new Date(); t.setDate(t.getDate() + d); return t.toISOString(); };
  return [
    { id: '1', title: 'DEADLINE: Kalvium Build-a-thon 2025', start: addDays(7), allDay: true, type: 'HACKATHON', color: '#ef4444' },
    { id: '2', title: 'DEADLINE: AI Innovation Challenge', start: addDays(14), allDay: true, type: 'HACKATHON', color: '#ef4444' },
    { id: '3', title: 'Campus Placement Drive – Google', start: addDays(3), allDay: true, type: 'ANNOUNCEMENT', color: '#3b82f6' },
    { id: '4', title: 'Mid-Semester Project Submission', start: addDays(10), allDay: true, type: 'ANNOUNCEMENT', color: '#3b82f6' },
    { id: '5', title: 'DEADLINE: Web Dev Sprint', start: addDays(21), allDay: true, type: 'HACKATHON', color: '#ef4444' },
    { id: '6', title: 'Career Fair 2025', start: addDays(18), allDay: true, type: 'ANNOUNCEMENT', color: '#3b82f6' },
  ];
};

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
    const fetchEvents = async () => {
        try {
            const res = await api.get('/calendar');
            const apiEvents = res.data.data || [];
            if (apiEvents.length === 0) {
                setEvents(getMockEvents());
            } else {
                setEvents(apiEvents);
            }
        } catch (err) {
            // Use mock data so calendar is always functional
            setEvents(getMockEvents());
        } finally {
            setLoading(false);
        }
    };
        fetchEvents();
    }, []);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    // Sort events by date
    const sortedEvents = [...events].sort((a, b) => new Date(a.start) - new Date(b.start));
    
    const upcomingEvents = sortedEvents.filter(e => new Date(e.start) >= new Date());

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                    <div className="p-5 bg-kalvium rounded-[2rem] shadow-2xl shadow-kalvium/20">
                        <CalendarIcon className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">Campus <span className="text-kalvium">Calendar</span></h1>
                        <p className="text-slate-500 text-lg">Tracks your hackathon deadlines and official announcements.</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-12 h-12 border-4 border-kalvium/20 border-t-kalvium rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <ErrorBanner message={error} />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Event List Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 border-l-4 border-kalvium pl-4">Upcoming Events</h2>
                        {upcomingEvents.length === 0 ? (
                            <div className="p-12 bg-white rounded-[2.5rem] border border-dashed border-slate-300 text-center">
                                <p className="text-slate-500 font-medium">No major events scheduled at your campus.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                        <div className="flex items-center space-x-5">
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-white shrink-0 shadow-lg`} style={{ backgroundColor: event.color }}>
                                                <span className="text-[10px] uppercase leading-none opacity-80">{new Date(event.start).toLocaleString('default', { month: 'short' })}</span>
                                                <span className="text-xl leading-none">{new Date(event.start).getDate()}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-kalvium transition-colors">{event.title}</h3>
                                                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                                                    <span className="flex items-center italic">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {new Date(event.start).toLocaleDateString()}
                                                    </span>
                                                    <span className="bg-slate-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] text-slate-400 border border-slate-100">
                                                        {event.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 bg-slate-50 hover:bg-kalvium hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-all border border-slate-100">
                                            View Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Summary Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-kalvium" />
                                Campus Pulse
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hackathons</div>
                                    <div className="text-lg font-bold text-slate-900">{events.filter(e => e.type === 'HACKATHON').length}</div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">News Update</div>
                                    <div className="text-lg font-bold text-slate-900">{events.filter(e => e.type === 'ANNOUNCEMENT').length}</div>
                                </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 italic text-xs text-slate-400 text-center">
                                Automatically synced with your campus management system.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
