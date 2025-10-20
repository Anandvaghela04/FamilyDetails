import { useState, FormEvent, ChangeEvent } from 'react';
import { supabase } from '../lib/supabase';

interface ChildData {
  name: string;
  dob: string;
  address: string;
  mobile: string;
  education: string;
  occupation: string;
  relation: string;
  marital_status?: string;
  spouse_details?: {
    name: string;
    dob: string;
    education: string;
    occupation: string;
  };
}

export default function FamilyForm({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const [maritalStatus, setMaritalStatus] = useState('');
  const [numChildren, setNumChildren] = useState(0);
  const [children, setChildren] = useState<ChildData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMaritalStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setMaritalStatus(e.target.value);
    if (e.target.value === 'unmarried') {
      setNumChildren(0);
      setChildren([]);
    }
  };

  const handleNumChildrenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value);
    setNumChildren(count);
    const newChildren: ChildData[] = Array(count).fill(null).map(() => ({
      name: '',
      dob: '',
      address: '',
      mobile: '',
      education: '',
      occupation: '',
      relation: 'પુત્ર',
    }));
    setChildren(newChildren);
  };

  const updateChild = (index: number, field: string, value: string) => {
    const updated = [...children];
    if (field.startsWith('spouse_')) {
      if (!updated[index].spouse_details) {
        updated[index].spouse_details = { name: '', dob: '', education: '', occupation: '' };
      }
      const spouseField = field.replace('spouse_', '') as keyof typeof updated[number]['spouse_details'];
      updated[index].spouse_details![spouseField] = value;
    } else {
      (updated[index] as any)[field] = value;
    }
    setChildren(updated);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    let photoUrl = null;
    const photoFile = formData.get('headPhoto') as File;
    if (photoFile && photoFile.size > 0) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('family-photos')
        .upload(fileName, photoFile);

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('family-photos')
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }
    }

    const wifeDetails = maritalStatus === 'married' ? {
      name: formData.get('wifeName') as string,
      dob: formData.get('wifeDOB') as string,
      education: formData.get('wifeEducation') as string,
      occupation: formData.get('wifeOccupation') as string,
    } : {};

    const { error } = await supabase
      .from('family_records')
      .insert({
        head_name: formData.get('headName') as string,
        head_photo_url: photoUrl,
        head_dob: formData.get('headDOB') as string,
        address: formData.get('address') as string,
        mobile: formData.get('mobile') as string,
        education: formData.get('education') as string || '',
        occupation: formData.get('occupation') as string || '',
        marital_status: maritalStatus,
        wife_details: wifeDetails,
        children: children,
      });

    setIsSubmitting(false);

    if (!error) {
      alert('✅ માહિતી સફળતાપૂર્વક સેવ થઈ ગઈ!');
      onSubmitSuccess();
      (e.target as HTMLFormElement).reset();
      setMaritalStatus('');
      setNumChildren(0);
      setChildren([]);
    } else {
      alert('❌ કંઈક ભૂલ થઈ!');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: 'Noto Sans Gujarati, sans-serif' }}>
        કુટુંબ વિગતો ફોર્મ
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">કુટુંબના વડાનું નામ:</label>
          <input type="text" name="headName" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">ફોટો અપલોડ કરો:</label>
          <input type="file" name="headPhoto" accept="image/*" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block font-medium mb-1">જન્મ તારીખ:</label>
          <input type="date" name="headDOB" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">સરનામું:</label>
          <input type="text" name="address" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">મોબાઈલ નંબર:</label>
          <input type="text" name="mobile" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">અભ્યાસ:</label>
          <input type="text" name="education" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">વ્યવસાય:</label>
          <input type="text" name="occupation" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block font-medium mb-1">પરણિત છે કે અપરણિત:</label>
          <select
            value={maritalStatus}
            onChange={handleMaritalStatusChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- પસંદ કરો --</option>
            <option value="unmarried">અપરણિત</option>
            <option value="married">પરણિત</option>
          </select>
        </div>

        {maritalStatus === 'married' && (
          <>
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="text-lg font-bold mb-3">પત્ની ની વિગતો</h3>
              <div className="space-y-3">
                <input type="text" name="wifeName" placeholder="નામ" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input type="date" name="wifeDOB" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input type="text" name="wifeEducation" placeholder="અભ્યાસ" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                <input type="text" name="wifeOccupation" placeholder="વ્યવસાય" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">સંતાનોની સંખ્યા:</label>
              <select
                value={numChildren}
                onChange={handleNumChildrenChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[0, 1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {children.map((child, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md space-y-3">
                <h4 className="font-bold">સંતાન {index + 1}</h4>
                <input
                  type="text"
                  placeholder="નામ"
                  value={child.name}
                  onChange={(e) => updateChild(index, 'name', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="date"
                  value={child.dob}
                  onChange={(e) => updateChild(index, 'dob', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="સરનામું"
                  value={child.address}
                  onChange={(e) => updateChild(index, 'address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="મોબાઈલ નંબર"
                  value={child.mobile}
                  onChange={(e) => updateChild(index, 'mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="અભ્યાસ"
                  value={child.education}
                  onChange={(e) => updateChild(index, 'education', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  placeholder="વ્યવસાય"
                  value={child.occupation}
                  onChange={(e) => updateChild(index, 'occupation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <select
                  value={child.relation}
                  onChange={(e) => updateChild(index, 'relation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="પુત્ર">પુત્ર</option>
                  <option value="પુત્રી">પુત્રી</option>
                </select>

                {child.relation === 'પુત્ર' && (
                  <>
                    <select
                      value={child.marital_status || ''}
                      onChange={(e) => updateChild(index, 'marital_status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- પસંદ કરો --</option>
                      <option value="unmarried">અપરણિત</option>
                      <option value="married">પરણિત</option>
                    </select>

                    {child.marital_status === 'married' && (
                      <div className="bg-white p-3 rounded-md space-y-2">
                        <p className="font-medium text-sm">પત્ની ની વિગતો:</p>
                        <input
                          type="text"
                          placeholder="પત્નીનું નામ"
                          value={child.spouse_details?.name || ''}
                          onChange={(e) => updateChild(index, 'spouse_name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="date"
                          value={child.spouse_details?.dob || ''}
                          onChange={(e) => updateChild(index, 'spouse_dob', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="અભ્યાસ"
                          value={child.spouse_details?.education || ''}
                          onChange={(e) => updateChild(index, 'spouse_education', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        <input
                          type="text"
                          placeholder="વ્યવસાય"
                          value={child.spouse_details?.occupation || ''}
                          onChange={(e) => updateChild(index, 'spouse_occupation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
        >
          {isSubmitting ? 'સબમિટ થઈ રહ્યું છે...' : 'સબમિટ કરો'}
        </button>
      </form>
    </div>
  );
}
