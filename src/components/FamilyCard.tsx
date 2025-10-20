import { FamilyRecord } from '../lib/supabase';
import { X, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function FamilyCard({
  record,
  onClose,
}: {
  record: FamilyRecord;
  onClose: () => void;
}) {
  const handlePrint = () => {
    const element = document.getElementById('printable-card');
    if (!element) return;

    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5], // inches
      filename: `${record.head_name || 'Family'}_Details.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl my-6 relative print:shadow-none print:my-0">
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 p-4 print:hidden sticky top-0 bg-white z-10 border-b">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer size={18} /> પ્રિન્ટ કરો
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <X size={18} /> બંધ કરો
          </button>
        </div>

        {/* Printable Content */}
        <div
          id="printable-card"
          className="p-8"
          style={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}
        >
          <div className="border-4 border-blue-600 rounded-lg p-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
              વાઘેલા પરિવારના કુંટુંબની વિગતોનું કાર્ડ
            </h1>

            {/* Head Details */}
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                {record.head_photo_url && (
                  <img
                    src={record.head_photo_url}
                    alt="Head"
                    className="w-32 h-32 object-cover rounded-full border-2 border-blue-600"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold">{record.head_name}</h2>
                  <p>જન્મ તા.: {record.head_dob}</p>
                  <p>સરનામું: {record.address}</p>
                  <p>મોબાઈલ: {record.mobile}</p>
                  <p>અભ્યાસ: {record.education}</p>
                  <p>વ્યવસાય: {record.occupation}</p>
                  <p>પરિણીત સ્થિતિ: {record.marital_status}</p>
                </div>
              </div>

              {record.wife_details && Object.keys(record.wife_details).length > 0 && (
                <div className="mt-4 bg-blue-100 p-3 rounded-md">
                  <h3 className="font-bold mb-1">કુંટુંબના વડાની પત્નીની વિગતો:</h3>
                  <p>નામ: {record.wife_details.name || '—'}</p>
                  <p>જન્મ તા.: {record.wife_details.dob || '—'}</p>
                  <p>અભ્યાસ: {record.wife_details.education || '—'}</p>
                  <p>વ્યવસાય: {record.wife_details.occupation || '—'}</p>
                </div>
              )}
            </div>

            {/* Children Details */}
            {record.children?.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-2 text-blue-700">સંતાનો</h2>

                {record.children.map((child: any, i: number) => (
                  <div
                    key={i}
                    className="border p-4 rounded-md bg-gray-50 page-break-inside-avoid"
                  >
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">
                      {child.relation || `સંતાન ${i + 1}`}: {child.name}
                    </h3>
                    <p>જન્મ તા.: {child.dob || '—'}</p>
                    <p>સરનામું: {child.address || '—'}</p>
                    <p>મોબાઈલ: {child.mobile || '—'}</p>
                    <p>અભ્યાસ: {child.education || '—'}</p>
                    <p>વ્યવસાય: {child.occupation || '—'}</p>
                    <p>પરિણીત સ્થિતિ: {child.marital_status || '—'}</p>

                    {/* Wife / Spouse Details */}
                    {(child.spouse_details || child.wife || child.wife_details) && (
                      <div className="ml-4 mt-3 p-3 bg-white border rounded-md">
                        <h4 className="font-medium text-blue-700 mb-1">
                          પુત્રવધુની વિગતો:
                        </h4>
                        <p>
                          નામ:{' '}
                          {child.spouse_details?.name ||
                            child.wife?.name ||
                            child.wife_details?.name ||
                            '—'}
                        </p>
                        <p>
                          જન્મ તા.:{' '}
                          {child.spouse_details?.dob ||
                            child.wife?.dob ||
                            child.wife_details?.dob ||
                            '—'}
                        </p>
                        <p>
                          અભ્યાસ:{' '}
                          {child.spouse_details?.education ||
                            child.wife?.education ||
                            child.wife_details?.education ||
                            '—'}
                        </p>
                        <p>
                          વ્યવસાય:{' '}
                          {child.spouse_details?.occupation ||
                            child.wife?.occupation ||
                            child.wife_details?.occupation ||
                            '—'}
                        </p>
                      </div>
                    )}

                    {/* Grandchildren */}
                    {child.children?.length > 0 && (
                      <div className="ml-6 mt-3">
                        <h5 className="font-semibold text-blue-700 mb-1">
                          પૌત્ર / પૌત્રી:
                        </h5>
                        {child.children.map((grand: any, gIdx: number) => (
                          <div
                            key={gIdx}
                            className="ml-2 p-2 border rounded bg-gray-100 mb-2"
                          >
                            <p>
                              <strong>{grand.relation || 'સંતાન'}:</strong>{' '}
                              {grand.name}
                            </p>
                            <p>જન્મ તા.: {grand.dob || '—'}</p>
                            <p>અભ્યાસ: {grand.education || '—'}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print & PDF Styles */}
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
            padding: 1rem;
          }
          .print\\:hidden {
            display: none !important;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }

        /* General layout fix for PDF */
        #printable-card {
          max-width: 800px;
          margin: auto;
          font-size: 14px;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
