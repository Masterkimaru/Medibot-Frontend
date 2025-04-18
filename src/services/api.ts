// src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // or your deployed Flask URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** ─── GENERAL ────────────────────────────────────────────────────────────── **/

export const sendChatMessage = async (message: string, history: any[] = []) => {
  const { data } = await api.post('/chat', {
    query: message,
    history,
  });
  return data;
};

export const analyzeImage = async (base64Image: string) => {
  const { data } = await api.post('/analyze-image', {
    image: base64Image,
  });
  return data;
};

export const calculateBMI = async (weight: number, height: number) => {
  const { data } = await api.post('/calculate-bmi', {
    weight,
    height,
  });
  return data;
};

/** ─── MENTAL HEALTH ───────────────────────────────────────────────────────── **/

/**
 * Submit structured mood input to the backend for analysis.
 * @param description  How the user is feeling (free text)
 * @param score        User-selected mood score (1–10)
 * @param tags         Optional tags or stressors (e.g., ["work", "anxiety"])
 */
export const trackMood = async (
  description: string,
  score: number,
  tags: string[] = []
) => {
  const { data } = await api.post('/mood', {
    description,
    score,
    tags,
  });
  return data; // { response: string, type: 'mood_tracking' }
};

/**
 * Request CBT exercises based on structured user input.
 * @param concern            What's bothering the user
 * @param tried_strategies   What they've already tried (optional)
 * @param desired_outcome    What they'd like to feel/achieve (optional)
 */
export const getCBTExercises = async (
  concern: string,
  tried_strategies: string = 'None',
  desired_outcome: string = 'Not specified'
) => {
  const { data } = await api.post('/cbt', {
    concern,
    tried_strategies,
    desired_outcome,
  });
  return data; // { response: string, type: 'cbt_exercises' }
};

/** ─── SYMPTOM TRACKER ─────────────────────────────────────────────────────── **/

export interface SymptomEntry {
  date: string;         // ISO datetime
  symptom: string;
  severity: number;
  duration?: string;
  triggers?: string[];
  medications?: string;
  notes?: string;
}

/**
 * Submit a symptom log to the backend.
 */
export const trackSymptom = async (entry: SymptomEntry) => {
  const { data } = await api.post('/symptoms', entry);
  return data; // { status: 'ok', inserted_id }
};