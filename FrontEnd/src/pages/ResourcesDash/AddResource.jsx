import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, MapPin, GraduationCap, Hash, BookOpen, Camera } from 'lucide-react';
import UploadCSV from "./UploadCSV";
export default function ResourceUpload() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    school_level: 'C1',
    quantity: '',
    subject: '',
    images:  [],
    condetion: 'good-new',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  function validateForm() {
  const newErrors = {};
  if (!form.name.trim()) newErrors.name = 'Name is required';
  if (!form.location) newErrors.location = 'Location is required';
  if (!form.school_level) newErrors.school_level = 'School level is required';
  if (!form.quantity || form.quantity <= 0) newErrors.quantity = 'Valid quantity is required';
  if (!form.subject.trim()) newErrors.subject = 'Subject is required';
  if (!form.images || form.images.length === 0) newErrors.image = 'At least one image is required'; // updated
  if (!form.condetion) newErrors.condetion = 'Condition is required';

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
}
function handleFileChange(e) {
  const files = Array.from(e.target.files); // convert FileList to array
  setForm(prev => ({ ...prev, images: files }));

  if (errors.image) {
    setErrors(prev => ({ ...prev, image: '' }));
  }
}
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }

  function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    setForm(prev => ({ ...prev, images: files }));
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  }
}


  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setResponse(null);

    const formData = new FormData();
    
     Object.entries(form).forEach(([key, value]) => {
    if (key !== 'images') {
      formData.append(key, value);
    }
  });
  form.images.forEach(file => {
 formData.append('images', file); // must match Multer field name
});

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/resources`, {
        method: 'POST',
        body: formData,
        credentials: 'include', // send cookies if needed
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setResponse(data);
      
      // Reset form on success
      setForm({
        name: '',
        description: '',
        location: '',
        school_level: 'C1',
        quantity: '',
        subject: '',
        images: [],
        condetion: 'good-new',
      });

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (fieldName) => `
    w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 
    focus:outline-none focus:ring-4 focus:ring-blue-500/20 
    ${errors[fieldName] 
      ? 'border-red-300 bg-red-50 focus:border-red-500' 
      : 'border-gray-200 bg-white focus:border-blue-500 hover:border-gray-300'
    }
  `;

  const locationOptions = [
    "KG Storage", "Library Storage", "Opposite to EMT Office",
    "Opposite to 1201 (Next CCDI Class)", "SEN", "Social Studies Storage",
    "Reception Storage", "Admin Storage Room", "ART Storage Room", "LABs", "Others"
  ];

  const schoolLevelOptions = [
    { value: "C1", label: "Cycle 1" },
    { value: "C2", label: "Cycle 2" },
    { value: "C3", label: "Cycle 3" },
    { value: "KG", label: "KG" },
    { value: "ALL", label: "All" },
    { value: "Others", label: "Others" }
  ];

  const conditionOptions = [
    { value: "good-new", label: "Good New" },
    { value: "good-used", label: "Good Used" },
    { value: "damaged", label: "Damaged" },
    { value: "over-used", label: "Over Used" }
  ];

  return (
    <div className="min-h-screen  py-2 px-2">
      <div className="max-w-2xl mx-auto">
        
        {response && (
          <div className={`mb-8 p-4 rounded-xl border-2 ${
            response.error 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-3">
              {response.error ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="font-medium">
                {response.error ? `Error: ${response.error}` : 'Resource uploaded successfully!'}
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Resource Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Resource Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter resource name"
                className={inputClass('name')}
              />
              {errors.name && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText className="w-4 h-4" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your resource (optional)"
                rows={3}
                className={inputClass('description')}
              />
            </div>

            {/* Location, School Level & Condition */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <select
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className={inputClass('location')}
                >
                  <option value="">Select Location</option>
                  {locationOptions.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
                {errors.location && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <GraduationCap className="w-4 h-4" />
                  School Level
                </label>
                <select
                  name="school_level"
                  value={form.school_level}
                  onChange={handleChange}
                  className={inputClass('school_level')}
                >
                  <option value="">Select School Level</option>
                  {schoolLevelOptions.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.school_level && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.school_level}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <GraduationCap className="w-4 h-4" />
                  Condition
                </label>
                <select
                  name="condetion"
                  value={form.condetion}
                  onChange={handleChange}
                  className={inputClass('condetion')}
                >
                  <option value="">Select Condition</option>
                  {conditionOptions.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                {errors.condetion && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.condetion}</p>}
              </div>
            </div>

            {/* Quantity and Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Hash className="w-4 h-4" />
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={inputClass('quantity')}
                />
                {errors.quantity && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.quantity}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <BookOpen className="w-4 h-4" />
                  Subject
                </label>
                <input
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Enter subject"
                  className={inputClass('subject')}
                />
                {errors.subject && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.subject}</p>}
              </div>
            </div>

            {/* Image Upload */}
            {/* <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Camera className="w-4 h-4" />
                Resource Image
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
                  ${dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : errors.image 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4">
                    <Camera className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium mb-1">
                    {form.image ? form.image.name : 'Drop your image here, or click to browse'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
              {errors.image && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.image}</p>}
            </div> */}
<div
  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200
    ${dragActive 
      ? 'border-blue-400 bg-blue-50' 
      : errors.image 
        ? 'border-red-300 bg-red-50' 
        : 'border-gray-300 bg-gray-50 hover:border-gray-400'
    }`}
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
>
  <input
    type="file"
    name="images"
    multiple
    accept="image/*"
    onChange={handleFileChange}
    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  />
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4">
      <Camera className="w-6 h-6 text-gray-400" />
    </div>
    <p className="text-gray-600 font-medium mb-1">
      {form.images.length > 0
        ? form.images.map(f => f.name).join(', ')
        : 'Drop your images here, or click to browse'}
    </p>
    <p className="text-sm text-gray-500">
      PNG, JPG, GIF up to 10MB each
    </p>
  </div>
</div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 
                focus:outline-none focus:ring-4 focus:ring-blue-500/20 
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                ${loading ? 'animate-pulse' : ''}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Resource
                  </>
                )}
              </div>
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          By uploading, you agree to share this resource with the educational community
        </p>
      </div>
    </div>
  );
}
