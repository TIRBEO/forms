'use client';

import { useState, useEffect } from 'react';

interface CaptchaChallenge {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  challengeType: string;
  question: string;
  options?: any[];
  imageUrl?: string;
  rayId: string;
  attempts: number;
  token: string;
}

export interface CaptchaWidgetProps {
  onSuccess?: (rayId: string) => void;
  onBlocked?: (rayId: string, reason: string) => void;
  requiredDifficulty?: string;
  apiBase?: string;
}

export function CaptchaWidget({ onSuccess, onBlocked, requiredDifficulty, apiBase = '/api/captcha' }: CaptchaWidgetProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChallenge();
  }, []);

  const loadChallenge = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/challenge`, { credentials: 'include' });
      const data = await res.json();
      if (data.blocked) {
        onBlocked?.(data.rayId, data.reason || 'blocked');
        return;
      }
      setChallenge(data.challenge);
    } catch (err: any) {
      setError(err?.message || 'Failed to load CAPTCHA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!challenge || !selectedAnswer) return;
    setVerifying(true);
    setError('');
    try {
      const res = await fetch(`${apiBase}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ challengeId: challenge.id, answer: selectedAnswer, token: challenge.token }),
      });
      const data = await res.json();
      if (data.valid) {
        onSuccess?.(data.rayId);
      } else if (data.blocked) {
        onBlocked?.(data.rayId, data.reason || 'blocked');
      } else {
        setError('Incorrect answer. Please try again.');
        setSelectedAnswer('');
        loadChallenge();
      }
    } catch (err: any) {
      setError(err?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="p-4 text-sm text-red-600">
        {error || 'Failed to load CAPTCHA'}
        <button onClick={loadChallenge} className="ml-2 text-blue-600 underline">
          Retry
        </button>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300',
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${difficultyColors[challenge.difficulty]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider">
          {challenge.difficulty} CAPTCHA
        </span>
        <span className="text-xs opacity-75">
          Attempts: {challenge.attempts}/3
        </span>
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 mb-4">
        <p className="text-lg font-semibold text-center text-gray-800">
          {challenge.question}
        </p>
      </div>

      {challenge.options && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {challenge.options.map((option: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedAnswer(option)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {!challenge.options && (
        <input
          type="text"
          value={selectedAnswer}
          onChange={(e) => setSelectedAnswer(e.target.value)}
          placeholder="Your answer"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 mb-4 text-center text-lg font-mono"
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
        />
      )}

      {error && (
        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={!selectedAnswer || verifying}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {verifying ? 'Verifying...' : 'Verify'}
      </button>

      <p className="text-xs text-center mt-2 opacity-75">
        Ray ID: {challenge.rayId.slice(0, 16)}...
      </p>
    </div>
  );
}
