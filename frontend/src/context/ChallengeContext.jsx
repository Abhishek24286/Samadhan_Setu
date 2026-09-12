import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialChallenges, initialUniversities, platformStats } from '../data/mockData';

const ChallengeContext = createContext();

export const ChallengeProvider = ({ children }) => {
  const [challenges, setChallenges] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_challenges');
      return saved ? JSON.parse(saved) : initialChallenges;
    } catch (e) {
      console.error("Failed to parse localStorage challenges", e);
      return initialChallenges;
    }
  });

  const [universities] = useState(() => {
    try {
      const saved = localStorage.getItem('samadhan_universities');
      return saved ? JSON.parse(saved) : initialUniversities;
    } catch (e) {
      return initialUniversities;
    }
  });

  const [toasts, setToasts] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [rejectModalTarget, setRejectModalTarget] = useState(null);

  // Synchronize challenges to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem('samadhan_challenges', JSON.stringify(challenges));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }, [challenges]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Submit challenge (enters as Pending)
  const submitChallenge = (data) => {
    const newChallenge = {
      id: `CH-2024-${Math.floor(100 + Math.random() * 900)}`,
      title: data.title || "Untitled Societal Challenge",
      category: data.category || "Environment",
      location: data.location ? `${data.location}, Jharkhand` : "Ranchi, Jharkhand",
      district: data.location || "Ranchi",
      organization: data.organization || "Local Citizen Initiative",
      orgType: data.orgType || "Community Entity",
      description: data.description || "Societal challenge submitted for verification.",
      targetBeneficiaries: data.targetBeneficiaries || "Local community members and residents",
      requiredSkills: data.requiredSkills && data.requiredSkills.length > 0 
        ? data.requiredSkills 
        : ["Problem Solving", "Web Dev", "Field Research"],
      expectedSolution: data.expectedSolution || "Scalable digital/hardware innovation prototype.",
      expectedImpact: data.expectedImpact || "Measurable societal improvement in the targeted region.",
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      priority: data.priority || "High"
    };

    setChallenges((prev) => [newChallenge, ...prev]);
    showToast("Challenge submitted successfully! Now pending administrative verification.", "success");
    setSubmitModalOpen(false);
    return newChallenge;
  };

  // Approve challenge (moves from pending to approved -> immediately visible on Home page)
  const approveChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'approved',
            approvedDate: new Date().toISOString().split('T')[0]
          };
        }
        return c;
      })
    );
    showToast("Challenge approved successfully.", "success");
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge((prev) => ({ ...prev, status: 'approved' }));
    }
  };

  // Reject challenge (moves to rejected with reason -> hidden from Home page)
  const rejectChallenge = (id, reason) => {
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: 'rejected',
            rejectedDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason || "Insufficient problem details"
          };
        }
        return c;
      })
    );
    showToast("Challenge rejected.", "info");
    setRejectModalTarget(null);
    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge((prev) => ({ 
        ...prev, 
        status: 'rejected', 
        rejectionReason: reason || "Insufficient problem details" 
      }));
    }
  };

  // Reset to SIH demo seed data
  const resetDemoData = () => {
    setChallenges(initialChallenges);
    try {
      localStorage.setItem('samadhan_challenges', JSON.stringify(initialChallenges));
    } catch (e) {
      console.error(e);
    }
    showToast("Demo dataset restored to official SIH initial state.", "info");
  };

  return (
    <ChallengeContext.Provider
      value={{
        challenges,
        universities,
        stats: platformStats,
        toasts,
        showToast,
        removeToast,
        selectedChallenge,
        setSelectedChallenge,
        submitModalOpen,
        setSubmitModalOpen,
        rejectModalTarget,
        setRejectModalTarget,
        submitChallenge,
        approveChallenge,
        rejectChallenge,
        resetDemoData
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
};

export const useChallenges = () => {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error("useChallenges must be used within a ChallengeProvider");
  }
  return context;
};
