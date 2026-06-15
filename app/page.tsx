'use client';

import { useEffect, useState } from 'react';

import DeckList from './components/DeckList';
import DefenseColumn from './components/DefenseColumn';
import CounterColumn from './components/CounterColumn';
import DetailPanel from './components/DetailPanel';

export default function Page() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [currentPage, setCurrentPage] = useState('deck1');
  const [deckPages, setDeckPages] = useState({
    deck1: {
      defenseDecks: [],
      counterDecks: [],
    },
    deck2: {
      defenseDecks: [],
      counterDecks: [],
    },
    deck3: {
      defenseDecks: [],
      counterDecks: [],
    },
    deck4: {
      defenseDecks: [],
      counterDecks: [],
    },
  });
  const [defenseDecks, setDefenseDecks] = useState(() => {
    const saved = localStorage.getItem('defenseDecks');

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 'defense1',
        title: '라오엘 공격형',
        heroes: [
          '/heroes/hero1.png',
          '/heroes/hero2.png',
          '/heroes/hero3.png',
          '/heroes/pet.png',
        ],
        skillOrder: [
          '/skills/skill1.png',
          '/skills/skill2.png',
          '/skills/skill3.png',
        ],
        tip: '라오엘 먼저 제거',
      },
    ];
  });
  const [counterDecks, setCounterDecks] = useState(() => {
    const saved = localStorage.getItem('counterDecks');

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: 'counter1',
        title: '카운터1',
        heroes: [
          '/heroes/hero1.png',
          '/heroes/hero2.png',
          '/heroes/hero3.png',
          '/heroes/pet.png',
        ],
        skillOrder: [
          '/skills/skill1.png',
          '/skills/skill2.png',
          '/skills/skill3.png',
        ],
        tip: '',
      },
    ];
  });
  const onTipChange = (deckId, newTip) => {
    setDefenseDecks(
      defenseDecks.map((d) => (d.id === deckId ? { ...d, tip: newTip } : d))
    );

    setCounterDecks(
      counterDecks.map((d) => (d.id === deckId ? { ...d, tip: newTip } : d))
    );

    if (selectedDeck?.id === deckId) {
      setSelectedDeck({
        ...selectedDeck,
        tip: newTip,
      });
    }
  };

  useEffect(() => {
    localStorage.setItem('defenseDecks', JSON.stringify(defenseDecks));

    localStorage.setItem('counterDecks', JSON.stringify(counterDecks));
  }, [defenseDecks, counterDecks]);

  return (
    <main className="mainLayout">
      <DeckList
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <DefenseColumn
        defenseDecks={defenseDecks}
        setDefenseDecks={setDefenseDecks}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        isAdmin={isAdmin}
      />

      <CounterColumn
        counterDecks={counterDecks}
        setCounterDecks={setCounterDecks}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        isAdmin={isAdmin}
      />

      <DetailPanel
        selectedDeck={selectedDeck}
        isAdmin={isAdmin}
        onTipChange={onTipChange}
      />
    </main>
  );
}
