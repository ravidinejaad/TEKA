import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { quizAPI } from '../utils/api';
import { STORAGE_KEYS } from '../utils/constants';
import { storage } from '../utils/storage';

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [attempt, setAttempt] = useState(() => storage.get(STORAGE_KEYS.QUIZ_STATE, null));
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Restore or manage countdown timer
  useEffect(() => {
    if (attempt?.waktu_batas) {
      const calculateRemaining = () => {
        const end = new Date(attempt.waktu_batas).getTime();
        const now = new Date().getTime();
        return Math.max(0, Math.floor((end - now) / 1000));
      };

      setTimeLeft(calculateRemaining());

      timerRef.current = setInterval(() => {
        const rem = calculateRemaining();
        setTimeLeft(rem);
        if (rem <= 0) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
        }
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [attempt?.waktu_batas]);

  const startQuiz = async (quizId) => {
    setLoading(true);
    try {
      const res = await quizAPI.startAttempt(quizId);
      if (res?.data) {
        const attemptData = res.data;
        setAttempt(attemptData);
        setQuestions(attemptData.questions || []);
        setCurrentIndex(0);
        setAnswers({});
        setFlagged([]);
        storage.set(STORAGE_KEYS.QUIZ_STATE, attemptData);
        return attemptData;
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAttempt = async (attemptId) => {
    setLoading(true);
    try {
      const res = await quizAPI.getAttempt(attemptId);
      if (res?.data) {
        const data = res.data;
        setAttempt(data);
        setQuestions(data.questions || []);
        storage.set(STORAGE_KEYS.QUIZ_STATE, data);
        return data;
      }
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = async (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    if (attempt?.id_percobaan) {
      try {
        await quizAPI.saveAnswer(attempt.id_percobaan, {
          id_soal: questionId,
          jawaban: value,
        });
      } catch (err) {
        console.warn('Failed to auto-save answer:', err);
      }
    }
  };

  const toggleFlag = (questionId) => {
    setFlagged((prev) =>
      prev.includes(questionId) ? prev.filter((id) => id !== questionId) : [...prev, questionId]
    );
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const handleAutoSubmit = async () => {
    if (attempt?.id_percobaan && !submitting) {
      await submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!attempt?.id_percobaan) return null;
    setSubmitting(true);
    try {
      const res = await quizAPI.submitAttempt(attempt.id_percobaan);
      storage.remove(STORAGE_KEYS.QUIZ_STATE);
      setAttempt(null);
      return res?.data;
    } finally {
      setSubmitting(false);
    }
  };

  const resetQuizState = () => {
    storage.remove(STORAGE_KEYS.QUIZ_STATE);
    setAttempt(null);
    setQuestions([]);
    setAnswers({});
    setFlagged([]);
    setCurrentIndex(0);
    setTimeLeft(0);
  };

  const value = {
    attempt,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] || null,
    answers,
    flagged,
    timeLeft,
    loading,
    submitting,
    startQuiz,
    loadAttempt,
    selectAnswer,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    submitQuiz,
    resetQuizState,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}

