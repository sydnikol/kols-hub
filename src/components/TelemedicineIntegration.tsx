import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Calendar, FileText, User, Clock, Phone, MessageSquare, Download, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string;
  prescriptions?: string[];
  documents?: string[];
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  availableTimes: string[];
  rating: number;
  avatar?: string;
}

export const TelemedicineIntegration: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [videoCallActive, setVideoCallActive] = useState(false);

  useEffect(() => {
    loadAppointments();
    loadDoctors();
  }, []);

  const loadAppointments = () => {
    const stored = localStorage.getItem('kol_appointments');
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  };

  const loadDoctors = () => {
    // Sample doctors data
    const sampleDoctors: Doctor[] = [
      {
        id: 'doc1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Primary Care',
        availableTimes: ['09:00', '10:00', '14:00', '15:00'],
        rating: 4.8,
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: 'doc2',
        name: 'Dr. Michael Chen',
        specialty: 'Rheumatology',
        availableTimes: ['10:00', '11:00', '13:00', '16:00'],
        rating: 4.9,
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      {
        id: 'doc3',
        name: 'Dr. Emily Rodriguez',
        specialty: 'Mental Health',
        availableTimes: ['09:00', '12:00', '14:00', '17:00'],
        rating: 5.0,
        avatar: 'https://i.pravatar.cc/150?img=3'
      }
    ];
    setDoctors(sampleDoctors);
  };

  const bookAppointment = (doctor: Doctor, date: string, time: string, type: 'video' | 'phone' | 'in-person') => {
    const appointment: Appointment = {
      id: `appt_${Date.now()}`,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      type,
      status: 'scheduled',
      notes: '',
      prescriptions: [],
      documents: []
    };

    const updated = [...appointments, appointment];
    setAppointments(updated);
    localStorage.setItem('kol_appointments', JSON.stringify(updated));
    toast.success('Appointment booked!');
    setShowBooking(false);
  };

  const cancelAppointment = (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      const updated = appointments.map(a =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      );
      setAppointments(updated);
      localStorage.setItem('kol_appointments', JSON.stringify(updated));
      toast.success('Appointment cancelled');
    }
  };

  const startVideoCall = (appointment: Appointment) => {
    setVideoCallActive(true);
    toast.success('Starting video call...');
    // Integration with video call platform (Zoom, Teams, custom WebRTC)
  };

  const exportMedicalRecords = () => {
    const data = {
      appointments,
      medications: JSON.parse(localStorage.getItem('kol_medications') || '[]'),
      healthMetrics: JSON.parse(localStorage.getItem('kol_health_metrics') || '{}')
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `medical_records_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Medical records exported!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'in-person': return <User className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-purple-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Video className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold text-white">Telemedicine</h1>
              <p className="text-gray-400 mt-1">Connect with healthcare providers remotely</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBooking(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </button>
            <button
              onClick={exportMedicalRecords}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Records
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <button className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-all text-left">
            <Video className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-white font-semibold">Video Call</h3>
            <p className="text-gray-400 text-sm">Start consultation</p>
          </button>
          <button className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-all text-left">
            <MessageSquare className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-white font-semibold">Message</h3>
            <p className="text-gray-400 text-sm">Chat with provider</p>
          </button>
          <button className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-all text-left">
            <FileText className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="text-white font-semibold">Records</h3>
            <p className="text-gray-400 text-sm">View medical history</p>
          </button>
          <button className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-all text-left">
            <Upload className="w-8 h-8 text-indigo-400 mb-2" />
            <h3 className="text-white font-semibold">Upload</h3>
            <p className="text-gray-400 text-sm">Share documents</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Upcoming Appointments
              </h3>

              {appointments.filter(a => a.status === 'scheduled').length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No upcoming appointments</p>
                  <button
                    onClick={() => setShowBooking(true)}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'scheduled').map(appt => (
                    <div
                      key={appt.id}
                      className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{appt.doctorName}</h4>
                          <p className="text-gray-400 text-sm">{appt.specialty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs ${getStatusColor(appt.status)} text-white`}>
                            {appt.status}
                          </span>
                          {getTypeIcon(appt.type)}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-sm text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(appt.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appt.time}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {appt.type === 'video' && (
                          <button
                            onClick={() => startVideoCall(appt)}
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm"
                          >
                            Join Call
                          </button>
                        )}
                        <button
                          onClick={() => cancelAppointment(appt.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Past Appointments */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Past Appointments</h3>
              <div className="space-y-3">
                {appointments.filter(a => a.status === 'completed').length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No past appointments</p>
                ) : (
                  appointments.filter(a => a.status === 'completed').map(appt => (
                    <div
                      key={appt.id}
                      className="bg-gray-800/30 border border-gray-700 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white text-sm font-semibold">{appt.doctorName}</h4>
                          <p className="text-gray-400 text-xs">{appt.specialty}</p>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {new Date(appt.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Providers & Info */}
          <div className="space-y-6">
            {/* Available Providers */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Available Providers</h3>
              <div className="space-y-3">
                {doctors.map(doctor => (
                  <div
                    key={doctor.id}
                    className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-3 cursor-pointer hover:border-purple-500/50 transition-all"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-semibold">{doctor.name}</h4>
                        <p className="text-gray-400 text-xs">{doctor.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-indigo-400 text-sm">★ {doctor.rating}</span>
                      <span className="text-gray-400 text-xs">{doctor.availableTimes.length} slots</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5" />
                <div>
                  <h4 className="text-indigo-200 font-semibold text-sm mb-1">Important</h4>
                  <p className="text-indigo-100 text-xs">
                    Telemedicine is not for emergencies. Call 911 for urgent medical needs.
                  </p>
                </div>
              </div>
            </div>

            {/* Patient Portal Links */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Patient Portals</h3>
              <div className="space-y-2">
                <a
                  href="https://www.mysaintlukeskc.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white"
                >
                  MySaintLukes
                </a>
                <a
                  href="https://www.myuhealth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-sm text-white"
                >
                  myUHealth
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBooking && selectedDoctor && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 border border-purple-500/30 rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Book with {selectedDoctor.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white">
                    {selectedDoctor.availableTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Type</label>
                  <select className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white">
                    <option value="video">Video Call</option>
                    <option value="phone">Phone Call</option>
                    <option value="in-person">In-Person</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      bookAppointment(selectedDoctor, '2025-12-01', '10:00', 'video');
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
                  >
                    Confirm Booking
                  </button>
                  <button
                    onClick={() => {
                      setShowBooking(false);
                      setSelectedDoctor(null);
                    }}
                    className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
