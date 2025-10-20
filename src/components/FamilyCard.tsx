import { FamilyRecord } from '../lib/supabase';
import { User, X, Printer } from 'lucide-react';

export default function FamilyCard({ record, onClose }: { record: FamilyRecord; onClose: () => void }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 relative print:shadow-none print:my-0">
        <div className="flex justify-end gap-2 p-4 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer size={18} />
            પ્રિન્ટ કરો
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <X size={18} />
            બંધ કરો
          </button>
        </div>

        <div id="printable-card" className="p-8" style={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}>
          <div className="border-4 border-blue-600 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">કુટુંબ વિગતો કાર્ડ</h1>

            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex items-start gap-6">
                {record.head_photo_url ? (
                  <img
                    src={record.head_photo_url}
                    alt={record.head_name}
                    className="w-32 h-32 rounded-lg object-cover border-4 border-blue-300"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-4 border-blue-300">
                    <User size={64} className="text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3 text-blue-900">{record.head_name}</h2>
                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-semibold">જન્મ તારીખ:</span> {record.head_dob}
                    </div>
                    <div>
                      <span className="font-semibold">મોબાઈલ:</span> {record.mobile}
                    </div>
                    <div>
                      <span className="font-semibold">અભ્યાસ:</span> {record.education || '-'}
                    </div>
                    <div>
                      <span className="font-semibold">વ્યવસાય:</span> {record.occupation || '-'}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-semibold">સરનામું:</span> {record.address}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {record.marital_status === 'married' && record.wife_details && record.wife_details.name && (
              <div className="bg-pink-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold mb-3 text-pink-800">પત્ની ની વિગતો</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold">નામ:</span> {record.wife_details.name}
                  </div>
                  <div>
                    <span className="font-semibold">જન્મ તારીખ:</span> {record.wife_details.dob || '-'}
                  </div>
                  <div>
                    <span className="font-semibold">અભ્યાસ:</span> {record.wife_details.education || '-'}
                  </div>
                  <div>
                    <span className="font-semibold">વ્યવસાય:</span> {record.wife_details.occupation || '-'}
                  </div>
                </div>
              </div>
            )}

            {record.children && record.children.length > 0 && (
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4 text-green-800">સંતાનો ની વિગતો</h3>
                <div className="space-y-4">
                  {record.children.map((child, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border-2 border-green-200">
                      <h4 className="font-bold text-lg mb-2 text-green-900">
                        સંતાન {index + 1} - {child.name}
                      </h4>
                      <div className="grid md:grid-cols-2 gap-2 text-sm mb-2">
                        <div>
                          <span className="font-semibold">જન્મ તારીખ:</span> {child.dob || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">મોબાઈલ:</span> {child.mobile || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">અભ્યાસ:</span> {child.education || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">વ્યવસાય:</span> {child.occupation || '-'}
                        </div>
                        <div>
                          <span className="font-semibold">સંબંધ:</span> {child.relation}
                        </div>
                        {child.marital_status && (
                          <div>
                            <span className="font-semibold">સ્થિતિ:</span> {child.marital_status === 'married' ? 'પરણિત' : 'અપરણિત'}
                          </div>
                        )}
                        <div className="md:col-span-2">
                          <span className="font-semibold">સરનામું:</span> {child.address || '-'}
                        </div>
                      </div>

                      {child.marital_status === 'married' && child.spouse_details && child.spouse_details.name && (
                        <div className="bg-purple-50 p-3 rounded mt-3 border border-purple-200">
                          <p className="font-semibold text-sm text-purple-900 mb-2">પત્ની ની વિગતો:</p>
                          <div className="grid md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-semibold">નામ:</span> {child.spouse_details.name}
                            </div>
                            <div>
                              <span className="font-semibold">જન્મ તારીખ:</span> {child.spouse_details.dob || '-'}
                            </div>
                            <div>
                              <span className="font-semibold">અભ્યાસ:</span> {child.spouse_details.education || '-'}
                            </div>
                            <div>
                              <span className="font-semibold">વ્યવસાય:</span> {child.spouse_details.occupation || '-'}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>બનાવ્યું: {new Date(record.created_at).toLocaleDateString('gu-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-card, #printable-card * {
            visibility: visible;
          }
          #printable-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
