import { useState, useMemo, useEffect } from 'react';
import JoinScreen from './screens/JoinScreen';
import PlayScreen from './screens/PlayScreen';
import ProjectorScreen from './screens/ProjectorScreen';
import './App.css';

const TEAM_STORAGE_KEY = 'crossword_team';

function normalizePathname() {
  let path = window.location.pathname || '/';
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  if (path === '/play') return '/play';
  if (path === '/projector') return '/projector';
  return '/';
}

function readStoredTeam() {
  try {
    return sessionStorage.getItem(TEAM_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

function writeStoredTeam(name) {
  try {
    if (name) sessionStorage.setItem(TEAM_STORAGE_KEY, name);
    else sessionStorage.removeItem(TEAM_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function getInitialRouteAndTeam() {
  if (typeof window === 'undefined') {
    return { route: '/', teamName: '' };
  }
  const route = normalizePathname();
  if (route === '/play') {
    const team = readStoredTeam();
    return { route, teamName: team };
  }
  return { route, teamName: '' };
}

export default function App() {
  const initial = useMemo(() => getInitialRouteAndTeam(), []);
  const [route, setRoute] = useState(initial.route);
  const [teamName, setTeamName] = useState(initial.teamName);

  // If user opened /play without a saved team, send them home.
  useEffect(() => {
    if (route === '/play' && !teamName) {
      window.history.replaceState({}, '', '/');
      setRoute('/');
    }
  }, [route, teamName]);

  const wsUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_WS_URL;
    if (envUrl) return envUrl;

    const host = window.location.hostname || 'localhost';
    if (host === 'classroom-crossword.vercel.app') {
      return 'wss://classroom-crossword.onrender.com';
    }
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${host}:3001`;
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const next = normalizePathname();
      setRoute(next);
      if (next === '/') {
        setTeamName('');
        writeStoredTeam('');
      } else if (next === '/play') {
        const saved = readStoredTeam();
        setTeamName(saved);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleJoin = (name) => {
    setTeamName(name);
    writeStoredTeam(name);
    window.history.pushState({}, '', '/play');
    setRoute('/play');
  };

  if (route === '/projector') {
    return <ProjectorScreen wsUrl={wsUrl} />;
  }

  if (route === '/play' && teamName) {
    return <PlayScreen teamName={teamName} wsUrl={wsUrl} />;
  }

  return <JoinScreen onJoin={handleJoin} />;
}
