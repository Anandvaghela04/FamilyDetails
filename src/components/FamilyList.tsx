import { useState, useEffect } from 'react';
import { supabase, FamilyRecord } from '../lib/supabase';
import { User, FileText } from 'lucide-react';

export default function FamilyList({ onGenerateCard }: { onGenerateCard: (record: FamilyRecord) => void }) {
  const [records, setRecords] = useState<FamilyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('family_records')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setRecords(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">લોડ થઈ રહ્યું છે...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">કોઈ રેકોર્ડ મળ્યો નથી</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}>
        વાઘેલા પરિવારના કુંટુંબની વિગતોના રેકોર્ડ્સ
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {records.map((record) => (
          <div key={record.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              {record.head_photo_url ? (
                <img
                  src={record.head_photo_url}
                  alt={record.head_name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={32} className="text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-bold text-lg">{record.head_name}</h3>
                <p className="text-sm text-gray-600">{record.mobile}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-700 mb-4">
              <p><span className="font-medium">સરનામું:</span> {record.address}</p>
              <p><span className="font-medium">વ્યવસાય:</span> {record.occupation || '-'}</p>
              <p><span className="font-medium">સ્થિતિ:</span> {record.marital_status === 'married' ? 'પરણિત' : 'અપરણિત'}</p>
            </div>
            <button
              onClick={() => onGenerateCard(record)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <FileText size={18} />
              કાર્ડ બનાવો
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
