import { useState, useMemo } from 'react';
import JoinScreen from './screens/JoinScreen';
import PlayScreen from './screens/PlayScreen';
import ProjectorScreen from './screens/ProjectorScreen';
import './App.css';

function getRoute() {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash;
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [teamName, setTeamName] = useState('');

  // Determine WebSocket URL dynamically, with env override for deployments.
  const wsUrl = useMemo(() => {
    const envUrl = import.meta.env.VITE_WS_URL;
    if (envUrl) return envUrl;

    const host = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    return `${protocol}://${host}:3001`;
  }, []);

  // Listen for hash changes
  useState(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  });

  const handleJoin = (name) => {
    setTeamName(name);
    window.location.hash = '#/play';
    setRoute('/play');
  };

  // Routing
  if (route === '/projector') {
    return <ProjectorScreen wsUrl={wsUrl} />;
  }

  if (route === '/play' && teamName) {
    return <PlayScreen teamName={teamName} wsUrl={wsUrl} />;
  }

  // Default: join screen
  return <JoinScreen onJoin={handleJoin} />;
}
