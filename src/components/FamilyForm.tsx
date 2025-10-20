  import { useState, FormEvent, ChangeEvent } from 'react';
  import { supabase } from '../lib/supabase';

  interface GrandChildData {
    name: string;
    dob: string;
    education: string;
    relation: string; // પૌત્ર/પૌત્રી
  }

  interface ChildData {
    name: string;
    dob: string;
    address: string;
    mobile: string;
    education: string;
    occupation: string;
    relation: string; // પુત્ર/પુત્રી
    marital_status?: string;
    spouse_details?: {
      name: string;
      dob: string;
      education: string;
      occupation: string;
    };
    children?: GrandChildData[]; // grandchildren
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

    const updateGrandchild = (childIndex: number, grandIndex: number, field: string, value: string) => {
      const updated = [...children];
      if (!updated[childIndex].children) updated[childIndex].children = [];
      updated[childIndex].children![grandIndex] = {
        ...updated[childIndex].children![grandIndex],
        [field]: value,
      };
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
      } : null;

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
          {/* Family head fields */}
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

          {/* Marital status */}
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

          {/* Wife details & children */}
          {maritalStatus === 'married' && (
            <>
              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-bold mb-3">કુટુંબના વડાના પત્ની ની વિગતો</h3>
                <div className="space-y-3">
                  <input type="text" name="wifeName" placeholder="નામ" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="date" name="wifeDOB" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" name="wifeEducation" placeholder="અભ્યાસ" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  <input type="text" name="wifeOccupation" placeholder="વ્યવસાય" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>

              {/* Number of children */}
              <div>
                <label className="block font-medium mb-1">સંતાનોની સંખ્યા:</label>
                <select
                  value={numChildren}
                  onChange={handleNumChildrenChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              {/* Children form */}
              {children.map((child, childIndex) => (
                <div key={childIndex} className="bg-gray-50 p-4 rounded-md space-y-3">
                  <h4 className="font-bold">સંતાન {childIndex + 1}</h4>
                  <input type="text" placeholder="નામ" value={child.name} onChange={(e) => updateChild(childIndex, 'name', e.target.value)} required className="w-full px-3 py-2 border rounded-md" />
                  <input type="date" value={child.dob} onChange={(e) => updateChild(childIndex, 'dob', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  <input type="text" placeholder="સરનામું" value={child.address} onChange={(e) => updateChild(childIndex, 'address', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  <input type="text" placeholder="મોબાઈલ નંબર" value={child.mobile} onChange={(e) => updateChild(childIndex, 'mobile', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  <input type="text" placeholder="અભ્યાસ" value={child.education} onChange={(e) => updateChild(childIndex, 'education', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  <input type="text" placeholder="વ્યવસાય" value={child.occupation} onChange={(e) => updateChild(childIndex, 'occupation', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  <select value={child.relation} onChange={(e) => updateChild(childIndex, 'relation', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                    <option value="પુત્ર">પુત્ર</option>
                    <option value="પુત્રી">પુત્રી</option>
                  </select>

                  {/* Child marital status */}
                  {child.relation === 'પુત્ર' && (
                    <>
                      <select value={child.marital_status || ''} onChange={(e) => updateChild(childIndex, 'marital_status', e.target.value)} className="w-full px-3 py-2 border rounded-md">
                        <option value="">-- પસંદ કરો --</option>
                        <option value="unmarried">અપરણિત</option>
                        <option value="married">પરણિત</option>
                      </select>

                      {/* Spouse details */}
                      {child.marital_status === 'married' && (
                        <div className="bg-white p-3 rounded-md space-y-2">
                          <p className="font-medium text-sm">પુત્રવધુ ની વિગતો:</p>
                          <input type="text" placeholder="પુત્રવધુનું નામ" value={child.spouse_details?.name || ''} onChange={(e) => updateChild(childIndex, 'spouse_name', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                          <input type="date" value={child.spouse_details?.dob || ''} onChange={(e) => updateChild(childIndex, 'spouse_dob', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                          <input type="text" placeholder="અભ્યાસ" value={child.spouse_details?.education || ''} onChange={(e) => updateChild(childIndex, 'spouse_education', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />
                          <input type="text" placeholder="વ્યવસાય" value={child.spouse_details?.occupation || ''} onChange={(e) => updateChild(childIndex, 'spouse_occupation', e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm" />

                          {/* Grandchildren */}
                          <div className="mt-2">
                            <label className="block mb-1 text-xs">પૌત્ર/પૌત્રી ની સંખ્યા:</label>
                            <select
                              value={child.children?.length || 0}
                              onChange={(e) => {
                                const count = parseInt(e.target.value);
                                const updated = [...children];
                                updated[childIndex].children = Array(count).fill(null).map((_, i) => ({
                                  name: updated[childIndex].children?.[i]?.name || '',
                                  dob: updated[childIndex].children?.[i]?.dob || '',
                                  relation: updated[childIndex].children?.[i]?.relation || 'પૌત્ર',
                                }));
                                setChildren(updated);
                              }}
                              className="w-full px-2 py-1 border rounded text-sm mb-2"
                            >
                              {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>

                            {child.children?.map((grandchild, gIndex) => (
                              <div key={gIndex} className="bg-gray-50 p-2 mb-2 rounded border border-gray-200 space-y-1">
                                <input type="text" placeholder="નામ" value={grandchild.name} onChange={(e) => updateGrandchild(childIndex, gIndex, 'name', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                <input type="date" value={grandchild.dob} onChange={(e) => updateGrandchild(childIndex, gIndex, 'dob', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                <input type="text" placeholder="અભ્યાસ" value={grandchild.education} onChange={(e) => updateGrandchild(childIndex, gIndex, 'education', e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
                                <select value={grandchild.relation} onChange={(e) => updateGrandchild(childIndex, gIndex, 'relation', e.target.value)} className="w-full px-2 py-1 border rounded text-sm">
                                  <option value="પૌત્ર">પૌત્ર</option>
                                  <option value="પૌત્રી">પૌત્રી</option>
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium">
            {isSubmitting ? 'સબમિટ થઈ રહ્યું છે...' : 'સબમિટ કરો'}
          </button>
        </form>
      </div>
    );
  }
