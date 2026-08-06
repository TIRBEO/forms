'use client';

import { useState, useCallback } from 'react';
import { FormThemeConfig, DEFAULT_THEME_CONFIG } from '@/lib/templates/types';

const PRESET_THEMES = [
  { id: 'modern-blue', name: 'Modern Blue', primary: '#3b82f6', bg: '#ffffff', text: '#111827', accent: '#3b82f6', radius: '12px' },
  { id: 'dark-mode', name: 'Dark Mode', primary: '#60a5fa', bg: '#111827', text: '#f9fafb', accent: '#60a5fa', radius: '12px' },
  { id: 'sunset', name: 'Sunset', primary: '#f59e0b', bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', text: '#1f2937', accent: '#f59e0b', radius: '16px' },
  { id: 'nature', name: 'Nature', primary: '#059669', bg: '#ecfdf5', text: '#064e3b', accent: '#059669', radius: '12px' },
  { id: 'elegant', name: 'Elegant', primary: '#d4af37', bg: '#0a0a0a', text: '#f5f5f5', accent: '#d4af37', radius: '8px' },
  { id: 'minimal', name: 'Minimal', primary: '#18181b', bg: '#ffffff', text: '#18181b', accent: '#18181b', radius: '4px' },
];

export default function FormBuilderPage() {
  const [title, setTitle] = useState('My Form');
  const [description, setDescription] = useState('');
  const [headerImage, setHeaderImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [thankYouMessage, setThankYouMessage] = useState('Thank you for your response!');
  const [theme, setTheme] = useState<FormThemeConfig>(DEFAULT_THEME_CONFIG);
  const [activeTab, setActiveTab] = useState<'design' | 'fields' | 'settings'>('design');

  const applyPreset = useCallback((preset: typeof PRESET_THEMES[0]) => {
    setTheme(prev => ({
      ...prev,
      primaryColor: preset.primary,
      backgroundColor: preset.bg,
      textColor: preset.text,
      accentColor: preset.accent,
      borderRadius: preset.radius,
      themeId: preset.id,
    }));
  }, []);

  const handleSave = async () => {
    const formData = {
      title,
      description,
      headerImageUrl: headerImage,
      coverImageUrl: coverImage,
      thankYouMessage,
      theme,
      template: 'custom',
    };
    
    try {
      const res = await fetch('http://localhost:3000/api/forms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.form) {
        alert('Form created! Public URL: ' + data.form.publicId);
      } else {
        alert('Error: ' + (data.error?.message || 'Failed to create form'));
      }
    } catch (err) {
      alert('Network error. Make sure API is running.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>Form Builder</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => {}} style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '14px' }}>Preview</button>
          <button onClick={handleSave} style={{ padding: '8px 20px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Create Form</button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {(['design', 'fields', 'settings'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 20px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px', padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Preview */}
        <div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            {/* Header Image */}
            {headerImage && (
              <div style={{ height: '200px', backgroundImage: `url(${headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{ height: '100%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{title}</h2>
                </div>
              </div>
            )}
            {/* Form Content */}
            <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, padding: theme.padding || '32px', borderRadius: '0 0 16px 16px' }}>
              {!headerImage && <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: theme.textColor }}>{title}</h2>}
              {description && <p style={{ fontSize: '14px', color: theme.textColor, opacity: 0.7, marginBottom: '24px' }}>{description}</p>}
              
              {/* Sample Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: theme.textColor }}>Your Name</label>
                  <input type="text" placeholder="Enter your name" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${theme.accentColor}33`, borderRadius: theme.borderRadius, fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', color: '#111827' }} readOnly />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px', color: theme.textColor }}>Email</label>
                  <input type="email" placeholder="your@email.com" style={{ width: '100%', padding: '10px 14px', border: `1px solid ${theme.accentColor}33`, borderRadius: theme.borderRadius, fontSize: '14px', outline: 'none', boxSizing: 'border-box', backgroundColor: '#fff', color: '#111827' }} readOnly />
                </div>
              </div>

              {/* Submit Button */}
              <button style={{ marginTop: '24px', width: '100%', padding: '12px', backgroundColor: theme.primaryColor, color: '#fff', border: 'none', borderRadius: theme.borderRadius, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {activeTab === 'design' && (
            <>
              {/* Theme Presets */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Theme Presets</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {PRESET_THEMES.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => applyPreset(preset)}
                      style={{ padding: '10px', border: theme.themeId === preset.id ? '2px solid #3b82f6' : '2px solid #e5e7eb', borderRadius: '8px', background: '#fff', cursor: 'pointer', textAlign: 'center' }}
                    >
                      <div style={{ width: '100%', height: '32px', borderRadius: '6px', background: preset.bg, marginBottom: '6px', border: '1px solid #e5e7eb' }} />
                      <span style={{ fontSize: '11px', fontWeight: 500, color: '#374151' }}>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Custom Colors</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#374151' }}>Primary</label>
                    <input type="color" value={theme.primaryColor} onChange={e => setTheme(p => ({ ...p, primaryColor: e.target.value }))} style={{ width: '36px', height: '28px', border: 'none', cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#374151' }}>Background</label>
                    <input type="color" value={theme.backgroundColor} onChange={e => setTheme(p => ({ ...p, backgroundColor: e.target.value }))} style={{ width: '36px', height: '28px', border: 'none', cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#374151' }}>Text</label>
                    <input type="color" value={theme.textColor} onChange={e => setTheme(p => ({ ...p, textColor: e.target.value }))} style={{ width: '36px', height: '28px', border: 'none', cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <label style={{ fontSize: '13px', color: '#374151' }}>Border Radius</label>
                    <select value={theme.borderRadius} onChange={e => setTheme(p => ({ ...p, borderRadius: e.target.value }))} style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px' }}>
                      <option value="4px">Small</option>
                      <option value="8px">Medium</option>
                      <option value="12px">Large</option>
                      <option value="16px">Extra Large</option>
                      <option value="24px">Pill</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Header Image */}
              <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Header Image</h3>
                <input type="url" value={headerImage} onChange={e => setHeaderImage(e.target.value)} placeholder="https://example.com/image.jpg" style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          {activeTab === 'fields' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Form Fields</h3>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>Fields are configured after creating the form.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>Form Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>Description</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '4px' }}>Thank You Message</label>
                  <input type="text" value={thankYouMessage} onChange={e => setThankYouMessage(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
