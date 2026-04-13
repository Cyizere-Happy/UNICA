'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, CheckCircle, UserCheck, Clock, AlertCircle, User, GraduationCap, Phone, Hash, Users, QrCode, XCircle } from 'lucide-react';
import { apiService } from '@/lib/gatepass/apiService';
import type { Visit } from '@/lib/gatepass/types';
import Lottie from "lottie-react";
import animationData from "@/lib/gatepass/assets/Digital Payment.json";
import animation from "@/lib/gatepass/assets/Posting Picture.json";
import pending from "@/lib/gatepass/assets/Pending.json";
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function Verification() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Visit[]>([]);
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.focus();
    }
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  const toggleScanner = () => {
    if (isScanning) {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
        scannerRef.current = null;
      }
      setIsScanning(false);
    } else {
      setIsScanning(true);
      setTimeout(() => {
        const scanner = new Html5QrcodeScanner(
          "qr-reader",
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );
        scannerRef.current = scanner;

        scanner.render(
          (decodedText) => {
            // Success handler
            setSearchQuery(decodedText);
            scanner.clear().catch(console.error);
            scannerRef.current = null;
            setIsScanning(false);

            // Auto-trigger search after successful scan
            setTimeout(() => {
              const query = decodedText;
              setLoading(true);
              setError('');
              setVisit(null);
              setSearchResults([]);

              apiService.getVisits({ search: query, limit: 1 }).then((data) => {
                if (data.visits.length > 0) {
                  setVisit(data.visits[0]);
                } else {
                  setError('No visit found with this QR Code');
                }
              }).catch(() => {
                setError('Failed to retrieve visitor from QR Code');
              }).finally(() => setLoading(false));

            }, 500);
          },
          (err) => {
            // Ignore ongoing parse errors
          }
        );
      }, 100);
    }
  };

  // Validate search input
  const validateSearchInput = (input: string): string | null => {
    const trimmed = input.trim();
    if (!trimmed) return 'Please enter a visit ID or phone number';
    if (trimmed.length < 3) return 'Search term must be at least 3 characters';
    return null;
  };

  const handleSearch = async () => {
    const validationError = validateSearchInput(searchQuery);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setVisit(null);
    setSearchResults([]);
    setSuccessMessage('');

    try {
      const data = await apiService.getVisits({ search: searchQuery.trim(), limit: 10 });
      if (data.visits.length > 0) {
        if (data.visits.length === 1) {
          setVisit(data.visits[0]); // Auto-select if there is exactly 1 perfect match
        } else {
          setSearchResults(data.visits); // Show list if multiple matches found
        }

        // Add to search history
        setSearchHistory(prev => {
          const newHistory = [searchQuery.trim(), ...prev.filter(item => item !== searchQuery.trim())];
          return newHistory.slice(0, 5); // Keep only last 5 searches
        });
      } else {
        setError('No visit found with this ID or phone number. Please check your input and try again.');
      }
    } catch (err) {
      setError('Failed to search for visit. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (selectedVisit: Visit) => {
    setVisit(selectedVisit);
    setSearchResults([]);
  };

  const handleCheckIn = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiService.checkIn({ stayCode: searchQuery.trim() });
      setVisit(response);
      setSuccessMessage(response.message || 'Visitor checked in successfully!');
      setTimeout(() => {
        setSearchQuery('');
        setVisit(null);
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check in visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canCheckIn = visit && visit.status === 'CONFIRMED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: '#292f36' }}>Gate Verification</h1>
        <p className="text-gray-600 mt-1">Verify guests arriving at UNICA House</p>

      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8 shadow-sm">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Visit ID or Guest Phone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-base sm:text-lg
             focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-gray-300 transition-all duration-200"
                aria-label="Search for visit by ID or phone number"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleSearch}
                disabled={loading || !searchQuery.trim()}
                className="flex-1 sm:flex-none px-6 py-3 text-white rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: '#153d5d' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0f2a42'}
                onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#153d5d'}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Search</span>
              </button>
              <button
                onClick={toggleScanner}
                className="flex-1 sm:flex-none px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan</span>
              </button>
            </div>
          </div>

          {/* QR Scanner Container */}
          {isScanning && (
            <div className="mt-6 p-2 sm:p-4 border-2 border-dashed border-purple-300 rounded-xl bg-purple-50 relative overflow-hidden">
              <button
                onClick={toggleScanner}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-600 z-10 p-2 bg-white rounded-full shadow-md"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <div id="qr-reader" className="w-full max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-inner font-sans"></div>
              <p className="text-center text-xs sm:text-sm text-purple-700 mt-3 font-semibold">Center the QR code in the frame</p>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && !visit && searchResults.length === 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {searchResults.length > 0 && !visit && (
            <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold" style={{ color: '#153d5d' }}>{searchResults.length} Results Found</h3>
                <p className="text-xs text-gray-500">Please select the correct visitor to verify</p>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {searchResults.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => handleSelectResult(res)}
                    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900">{res.guestName}</h4>
                      <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {res.roomName} {res.roomId ? `(${res.roomId})` : ''}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {res.guestPhone}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {res.relationship || 'Visitor'}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {res.visitorCount} {res.visitorCount === 1 ? 'Person' : 'People'}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {res.visitDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${res.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        res.status === 'CHECKED_IN' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {res.status}
                      </span>
                      <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
                        Select →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {visit && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-4xl mx-auto">
          {/* Status Header */}
          <div className={`p-6 ${canCheckIn ? 'bg-green-50 border-b border-green-200' :
            visit.status === 'CHECKED_IN' ? 'bg-blue-50 border-b border-blue-200' :
              'bg-yellow-50 border-b border-yellow-200'
            }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${canCheckIn ? 'bg-green-600' :
                  visit.status === 'CHECKED_IN' ? 'bg-[#153d5d]' :
                    'bg-yellow-600'
                  }`}>
                  {canCheckIn ? (
                    <UserCheck className="w-8 h-8 text-white" />
                  ) : visit.status === 'CHECKED_IN' ? (
                    <CheckCircle className="w-8 h-8 text-white bg-[#153d5d]" />
                  ) : (
                    <Clock className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {canCheckIn ? `Ready to Check In: ${visit.roomName || 'Visitor'}` :
                      visit.status === 'CHECKED_IN' ? `Checked In: ${visit.roomName || 'Visitor'}` :
                        visit.status === 'PENDING' ? 'Pending Approval' :
                          'Visit Status: ' + visit.status}
                  </h2>
                  <p className="text-gray-600">
                    {canCheckIn ? `Approving entry for visitor to see ${visit.roomName}` :
                      visit.status === 'CHECKED_IN' ? `${visit.guestName} successfully checked in to visit ${visit.roomName}` :
                        'This visit requires approval before check-in'}
                  </p>
                </div>
              </div>
              {canCheckIn && (
                <button
                  onClick={handleCheckIn}
                  disabled={loading}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 font-semibold flex items-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Check In Now
                </button>
              )}
            </div>
          </div>

          {/* Visitor & Student Info */}
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Visitor Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Visitor Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Lead Guest Name</label>
                      <p className="text-lg font-semibold text-gray-900">{visit.guestName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Phone Number</label>
                      <p className="text-gray-900 font-mono">{visit.guestPhone}</p>
                    </div>
                  </div>
                  {visit.nationalId && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <Hash className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">National ID</label>
                        <p className="text-gray-900 font-mono">{visit.nationalId}</p>
                      </div>
                    </div>
                  )}
                  {visit.visitorCount && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">Additional Visitors</label>
                        <p className="text-gray-900 font-semibold">{visit.visitorCount}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Student Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Host / Room</label>
                      <p className="text-lg font-semibold text-gray-900">{visit.roomName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Hash className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-gray-600">Room ID</label>
                      <p className="text-gray-900 font-mono text-lg">{visit.roomId}</p>
                    </div>
                  </div>
                  {visit.relationship && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-gray-600">Relationship</label>
                        <p className="text-gray-900 font-semibold">{visit.relationship}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Placeholder for Lottie Animation */}
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
              {visit.status === 'CHECKED_IN' ? (
                <Lottie animationData={animation} loop={true} />
              ) : (
                <Lottie animationData={pending} loop={true} />
              )}

            </div>
          </div>

          {/* Checked-in Info */}
          {visit.checkedInAt && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Checked in at:</span> {visit.checkedInAt}
              </p>
            </div>
          )}
        </div>
      )}


      {!visit && searchResults.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Lottie animationData={animationData} loop={true} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Verify Guests</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            When guests arrive at UNICA House, they can enter their Visit ID or phone number to verify their approved stay and check in.
            This ensures only authorized visitors enter the school.
          </p>
        </div>
      )}
    </div>
  );
}
